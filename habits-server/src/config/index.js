import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_PATH = path.join(__dirname, "../../config.json");

let config = null;

export function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, "utf8");
      config = JSON.parse(data);
      return config;
    }

    const defaultConfig = {
      habits: {},
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
    };
    saveConfig(defaultConfig);
    return defaultConfig;
  } catch (error) {
    console.error("Error loading config:", error);
    return { habits: {}, version: "1.0.0" };
  }
}

export function saveConfig(newConfig) {
  try {
    newConfig.lastUpdated = new Date().toISOString();
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2), "utf8");
    config = newConfig;
    return true;
  } catch (error) {
    console.error("Error saving config:", error);
    return false;
  }
}

export function getConfig() {
  if (!config) {
    config = loadConfig();
  }
  return config;
}

export function updateConfig(updates) {
  const currentConfig = getConfig();
  const newConfig = { ...currentConfig, ...updates };
  return saveConfig(newConfig);
}
