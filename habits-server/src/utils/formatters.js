import { getConfig } from "../config/index.js";

export function escapeMarkdownV2(text) {
  const specialChars = [
    "_",
    "*",
    "[",
    "]",
    "(",
    ")",
    "~",
    "`",
    ">",
    "#",
    "+",
    "-",
    "=",
    "|",
    "{",
    "}",
    ".",
    "!",
  ];
  let escaped = text;

  specialChars.forEach((char) => {
    const regex = new RegExp(`\\${char}`, "g");
    escaped = escaped.replace(regex, `\\${char}`);
  });

  return escaped;
}

export function formatTelegramMessageWithProgress(data, filesCount = 0) {
  const config = getConfig();
  const date = new Date();
  const formattedDate = date
    .toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    .toLowerCase();

  const time = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  const activeHabits = Object.entries(config.habits)
    .filter(([_, habit]) => habit.active !== false)
    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0));

  const totalHabits = activeHabits.length;
  const completedHabits = activeHabits.filter(
    ([key, _]) => data[key] === "true",
  ).length;

  const progressPercent =
    totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const progressBarLength = 10;
  const filledLength = Math.round((progressPercent / 100) * progressBarLength);
  const progressBar =
    "█".repeat(filledLength) + "░".repeat(progressBarLength - filledLength);

  let message = `${formattedDate}\n`;
  message += `┌${"─".repeat(11)}┐\n`;
  message += `│ ${progressBar} ${progressPercent}% │\n`;
  message += `└${"─".repeat(11)}┘\n\n`;

  activeHabits.forEach(([key, habit]) => {
    const done = data[key] === "true";
    const status = done ? "✅" : "❌";
    message += `${habit.emoji} ${habit.label} ${status}\n`;
  });

  message += `\n⏰ ${time}`;
  const visibleText = escapeMarkdownV2(message);
  const spoilerText = escapeMarkdownV2(`#d${data.dayCount || 1}`);

  const sentMsg = `${visibleText}\n\n ||${spoilerText}||`;

  return sentMsg.trim();
}
