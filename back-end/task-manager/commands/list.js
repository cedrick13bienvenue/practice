const { loadTasks } = require("../utils/tasks");

function listTasks() {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log("🗒️ No tasks found.");
  } else {
    tasks.forEach((task, index) => {
      const status = task.done ? "✅" : "❌";
      console.log(`${index + 1}. ${status} ${task.text}`);
    });
  }
}

module.exports = listTasks;
