import { getBotInfo, getUpdates, sendMessage } from "../services/telegram.js";
import { handleBotCommand } from "./commands.js";

const ADMIN_ID = process.env.TELEGRAM_ADMIN_ID;
const ADMIN_USERNAME = process.env.TELEGRAM_ADMIN_USERNAME;

export async function startPolling() {
  let offset = 0;

  console.log("Starting Telegram bot polling...");

  try {
    const botInfo = await getBotInfo();
    console.log(`Bot connected: @${botInfo.result.username}`);
  } catch (error) {
    console.error("Failed to connect to bot:", error.message);
    return;
  }

  while (true) {
    try {
      const response = await getUpdates(offset);

      if (response.ok && response.result.length > 0) {
        console.log(`Received ${response.result.length} updates`);

        for (const update of response.result) {
          offset = update.update_id + 1;

          if (update.message && update.message.text) {
            const { chat, text, from } = update.message;

            console.log(`Message from ${from.username || from.id}: ${text}`);

            const isAdmin =
              (ADMIN_ID && from.id.toString() === ADMIN_ID) ||
              (ADMIN_USERNAME && from.username === ADMIN_USERNAME);

            if (!isAdmin) {
              console.log(`Access denied for user ${from.id}`);
              await sendMessage(chat.id, "Access denied. You are not admin.");
              continue;
            }

            if (text.startsWith("/")) {
              await handleBotCommand(chat.id, text, update.message);
            } else {
              await sendMessage(
                chat.id,
                "I only understand commands. Use /help for available commands.",
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Polling error:", error.message);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
