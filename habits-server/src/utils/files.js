import fs from "fs";

export function cleanupFiles(files) {
  files.forEach((file) => {
    try {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
        console.log(`Deleted: ${file.path}`);
      }
    } catch (err) {
      console.error(`Failed to delete ${file.path}:`, err.message);
    }
  });
}
