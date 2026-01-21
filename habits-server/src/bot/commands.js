import { getConfig, saveConfig } from "../config/index.js";
import { sendMessage } from "../services/telegram.js";

function parseArgs(args) {
  const params = {};
  const regex = /(\w+)=("[^"]+"|[^\s]+)/g;
  let match;

  while ((match = regex.exec(args)) !== null) {
    let value = match[2];
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.slice(1, -1);
    }
    params[match[1]] = value;
  }

  return params;
}

export async function sendHabitsList(chatId) {
  const config = getConfig();
  const habits = Object.entries(config.habits)
    .sort((a, b) => (a[1].order || 0) - (b[1].order || 0))
    .map(
      ([key, habit]) =>
        `${habit.emoji} *${key}*\n${habit.label}\nType: ${habit.type}\nOrder: ${habit.order}\nActive: ${habit.active ? "Yes" : "No"}\n`,
    )
    .join("\n");

  const message =
    habits.length > 0
      ? `*Current habits:*\n\n${habits}\n\nTotal: ${Object.keys(config.habits).length}`
      : "No habits configured yet. Use /addhabit to add a new habit.";

  await sendMessage(chatId, message);
}

export async function handleAddHabit(chatId, args) {
  try {
    const params = parseArgs(args);

    if (!params.key) {
      await sendMessage(
        chatId,
        'Usage: /addhabit key=value\nExample: /addhabit key=isMeditate type=boolean label="🧘 Meditation" emoji=🧘 order=8',
      );
      return;
    }

    const config = getConfig();
    const habitId = params.key.startsWith("is")
      ? params.key
      : `is${params.key.charAt(0).toUpperCase() + params.key.slice(1)}`;

    config.habits[habitId] = {
      type: params.type || "boolean",
      label: params.label || habitId,
      emoji: params.emoji || "✅",
      order: parseInt(params.order) || Object.keys(config.habits).length + 1,
      active: params.active !== "false",
    };

    saveConfig(config);
    await sendMessage(chatId, `Habit "${habitId}" added successfully!`);
  } catch (error) {
    console.error("Add habit error:", error);
    await sendMessage(chatId, "Error adding habit");
  }
}

export async function handleUpdateHabit(chatId, args) {
  try {
    const [habitId, ...rest] = args.split(" ");
    const params = parseArgs(rest.join(" "));
    const config = getConfig();

    if (!habitId || !config.habits[habitId]) {
      await sendMessage(chatId, `Habit "${habitId}" not found`);
      return;
    }

    const updatedHabit = { ...config.habits[habitId] };

    if (params.label !== undefined) updatedHabit.label = params.label;
    if (params.emoji !== undefined) updatedHabit.emoji = params.emoji;
    if (params.type !== undefined) updatedHabit.type = params.type;
    if (params.order !== undefined) updatedHabit.order = parseInt(params.order);
    if (params.active !== undefined)
      updatedHabit.active = params.active === "true";

    config.habits[habitId] = updatedHabit;
    saveConfig(config);

    await sendMessage(chatId, `Habit "${habitId}" updated!`);
  } catch (error) {
    console.error("Update habit error:", error);
    await sendMessage(chatId, "Error updating habit");
  }
}

export async function handleDeleteHabit(chatId, args) {
  try {
    if (!args) {
      await sendMessage(chatId, "Usage: /deletehabit <habitId>");
      return;
    }

    const config = getConfig();

    if (!config.habits[args]) {
      await sendMessage(chatId, `Habit "${args}" not found`);
      return;
    }

    delete config.habits[args];
    saveConfig(config);

    await sendMessage(chatId, `Habit "${args}" deleted!`);
  } catch (error) {
    console.error("Delete habit error:", error);
    await sendMessage(chatId, "Error deleting habit");
  }
}

export async function sendHelp(chatId) {
  const helpText = `
*Available commands:*

/habits - List all habits
/addhabit key=value - Add new habit
  Example: /addhabit key=isMeditate type=boolean label="🧘 Meditation" emoji=🧘 order=8

/updatehabit <id> key=value - Update habit
  Example: /updatehabit isMeditate label="🧘 Daily Meditation"

/deletehabit <id> - Delete habit
  Example: /deletehabit isMeditate

/help - Show this help
`;

  await sendMessage(chatId, helpText);
}

export async function handleBotCommand(chatId, text, message) {
  try {
    const command = text.split(" ")[0].toLowerCase();
    const args = text.split(" ").slice(1).join(" ");

    switch (command) {
      case "/habits":
        await sendHabitsList(chatId);
        break;

      case "/addhabit":
        await handleAddHabit(chatId, args);
        break;

      case "/updatehabit":
        await handleUpdateHabit(chatId, args);
        break;

      case "/deletehabit":
        await handleDeleteHabit(chatId, args);
        break;

      case "/help":
        await sendHelp(chatId);
        break;

      default:
        await sendMessage(
          chatId,
          "Unknown command. Use /help for list of commands.",
        );
    }
  } catch (error) {
    console.error("Command handler error:", error);
    await sendMessage(chatId, "Error processing command");
  }
}
