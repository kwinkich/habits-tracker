import { Router } from "express";
import axios from "axios";
import { getConfig, saveConfig } from "../config/index.js";
import { upload } from "../middleware/upload.js";
import { formatTelegramMessageWithProgress } from "../utils/formatters.js";
import { cleanupFiles } from "../utils/files.js";
import {
  sendPhotosAsAlbum,
  sendMultiplePhotos,
  getBotToken,
  getChatId,
} from "../services/telegram.js";

const router = Router();

router.get("/config", (req, res) => {
  try {
    const config = getConfig();
    const activeHabits = Object.entries(config.habits)
      .filter(([_, habit]) => habit.active !== false)
      .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
      .reduce((acc, [key, habit]) => {
        acc[key] = habit;
        return acc;
      }, {});

    res.json({
      success: true,
      habits: activeHabits,
      dayCount: config.dayCount || 1,
      version: config.version,
      lastUpdated: config.lastUpdated,
    });
  } catch (error) {
    console.error("Error getting config:", error);
    res.status(500).json({
      success: false,
      error: "Failed to load config",
    });
  }
});

router.post("/report", upload.array("photos"), async (req, res) => {
  const tempFiles = req.files || [];
  const BOT_TOKEN = getBotToken();
  const CHAT_ID = getChatId();

  try {
    console.log("Received request:", {
      body: req.body,
      files: tempFiles.map((f) => ({
        name: f.originalname,
        path: f.path,
        size: f.size,
      })),
    });

    if (!BOT_TOKEN || !CHAT_ID) {
      throw new Error("Telegram credentials not configured");
    }

    // Handle dayCount logic
    const config = getConfig();
    let dayCount;

    if (req.body.dayCount && req.body.dayCount !== "") {
      // User provided a custom dayCount
      dayCount = parseInt(req.body.dayCount);
    } else {
      // Auto-increment from config
      dayCount = (config.dayCount || 0) + 1;
    }

    // Update config with new dayCount
    config.dayCount = dayCount;
    saveConfig(config);

    // Add dayCount to request body for message formatting
    req.body.dayCount = dayCount;

    const caption = formatTelegramMessageWithProgress(req.body, tempFiles.length);
    console.log("Generated caption:", caption);

    if (tempFiles.length > 0) {
      console.log(`Processing ${tempFiles.length} photos as album...`);

      const photoPaths = tempFiles.map((f) => f.path);
      const result = await sendPhotosAsAlbum(photoPaths, caption);

      console.log("Photos sent as album:", result.ok);
    } else {
      console.log("Sending text-only message...");

      const response = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: CHAT_ID,
          text: caption,
          parse_mode: "MarkdownV2",
        },
      );

      console.log("Text message sent:", response.data.ok);
    }

    cleanupFiles(tempFiles);

    res.json({
      success: true,
      message: "Report sent successfully!",
      photosCount: tempFiles.length,
      asAlbum: true,
      caption: caption,
    });
  } catch (error) {
    console.error("Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    cleanupFiles(tempFiles);

    res.status(500).json({
      success: false,
      error: "Failed to send report",
      details: error.response?.data || error.message,
      hint: "Trying alternative method...",
    });
  }
});

router.post("/report-single", upload.array("photos"), async (req, res) => {
  const tempFiles = req.files || [];
  const BOT_TOKEN = getBotToken();
  const CHAT_ID = getChatId();

  try {
    console.log("Received request (single method):", { files: tempFiles.length });

    if (!BOT_TOKEN || !CHAT_ID) {
      throw new Error("Telegram credentials not configured");
    }

    // Handle dayCount logic
    const config = getConfig();
    let dayCount;

    if (req.body.dayCount && req.body.dayCount !== "") {
      // User provided a custom dayCount
      dayCount = parseInt(req.body.dayCount);
    } else {
      // Auto-increment from config
      dayCount = (config.dayCount || 0) + 1;
    }

    // Update config with new dayCount
    config.dayCount = dayCount;
    saveConfig(config);

    // Add dayCount to request body for message formatting
    req.body.dayCount = dayCount;

    const caption = formatTelegramMessageWithProgress(req.body, tempFiles.length);

    const photoPaths = tempFiles.map((f) => f.path);
    const results = await sendMultiplePhotos(photoPaths, caption);

    console.log(`Sent ${results.length} photos`);

    cleanupFiles(tempFiles);

    res.json({
      success: true,
      message: "Report sent successfully!",
      photosCount: tempFiles.length,
      asAlbum: false,
      results: results.map((r) => r.ok || false),
    });
  } catch (error) {
    console.error("Error:", error.message);
    cleanupFiles(tempFiles);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
