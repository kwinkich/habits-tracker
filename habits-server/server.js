import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";

import { loadConfig } from "./src/config/index.js";
import { getUploadsDir } from "./src/middleware/upload.js";
import habitsRoutes from "./src/routes/habits.js";
import { startPolling } from "./src/bot/polling.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

loadConfig();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5050",
      "http://habits-client:5050",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/habits", habitsRoutes);

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`Photo album endpoint: POST http://localhost:${port}/api/habits/report`);
  console.log(`Single photos endpoint: POST http://localhost:${port}/api/habits/report-single`);

  const uploadDir = getUploadsDir();
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log(`Created uploads directory: ${uploadDir}`);
  }

  if (process.env.TELEGRAM_BOT_TOKEN) {
    console.log("Starting bot polling in 3 seconds...");
    setTimeout(() => {
      startPolling().catch(console.error);
    }, 3000);
  } else {
    console.log("BOT_TOKEN not set, skipping bot setup");
  }
});
