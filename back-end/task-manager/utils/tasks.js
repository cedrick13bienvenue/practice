const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "tasks.json");

function loadTasks() {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("❌ Failed to load tasks:", error);
    return [];
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));
}

module.exports = { loadTasks, saveTasks };
