import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export function getBotToken() {
  return BOT_TOKEN;
}

export function getChatId() {
  return CHAT_ID;
}

export async function sendMessage(chatId, text) {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      },
      {
        timeout: 10000,
      },
    );
    console.log(`Message sent to ${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Send message error:", error.response?.data || error.message);
    return null;
  }
}

export async function sendTextMessage(chatId, text, parseMode = "MarkdownV2") {
  const response = await axios.post(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      chat_id: chatId,
      text: text,
      parse_mode: parseMode,
    },
  );
  return response.data;
}

export async function sendSinglePhoto(photoPath, caption = "") {
  try {
    const formData = new FormData();
    const photoBuffer = fs.readFileSync(photoPath);

    const ext = path.extname(photoPath).toLowerCase();
    let contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".gif") contentType = "image/gif";
    if (ext === ".webp") contentType = "image/webp";

    formData.append("photo", photoBuffer, {
      filename: path.basename(photoPath),
      contentType: contentType,
    });

    formData.append("chat_id", CHAT_ID);

    if (caption) {
      formData.append("caption", caption);
      formData.append("parse_mode", "MarkdownV2");
    }

    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 30000,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error sending photo:", error.message);
    throw error;
  }
}

export async function sendPhotosAsAlbum(photoPaths, caption) {
  try {
    const formData = new FormData();

    const media = photoPaths.map((photoPath, index) => {
      const ext = path.extname(photoPath).toLowerCase();
      let mimeType = "image/jpeg";
      if (ext === ".png") mimeType = "image/png";
      if (ext === ".gif") mimeType = "image/gif";
      if (ext === ".webp") mimeType = "image/webp";

      return {
        type: "photo",
        media: `attach://photo_${index}`,
        caption: index === 0 ? caption : undefined,
        parse_mode: "MarkdownV2",
      };
    });

    formData.append("chat_id", CHAT_ID);
    formData.append("media", JSON.stringify(media));

    photoPaths.forEach((photoPath, index) => {
      const fileStream = fs.createReadStream(photoPath);
      const filename = path.basename(photoPath);
      formData.append(`photo_${index}`, fileStream, {
        filename: filename,
        contentType: "image/jpeg",
      });
    });

    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMediaGroup`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
        timeout: 60000,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Error sending photo album:", error.message);
    if (error.response?.data) {
      console.error("Telegram API error:", error.response.data);
    }
    throw error;
  }
}

export async function sendMultiplePhotos(photoPaths, caption) {
  const results = [];

  if (photoPaths.length > 0) {
    const firstPhotoResult = await sendSinglePhoto(photoPaths[0], caption);
    results.push(firstPhotoResult);

    for (let i = 1; i < photoPaths.length; i++) {
      try {
        const result = await sendSinglePhoto(photoPaths[i], "");
        results.push(result);
      } catch (error) {
        console.error(`Failed to send photo ${i + 1}:`, error.message);
        results.push({ error: error.message });
      }
    }
  }

  return results;
}

export async function getBotInfo() {
  const response = await axios.get(
    `https://api.telegram.org/bot${BOT_TOKEN}/getMe`,
  );
  return response.data;
}

export async function getUpdates(offset, timeout = 30) {
  const response = await axios.get(
    `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`,
    {
      params: {
        offset: offset,
        timeout: timeout,
        allowed_updates: ["message"],
      },
      timeout: (timeout + 5) * 1000,
    },
  );
  return response.data;
}
