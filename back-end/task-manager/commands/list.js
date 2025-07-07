const { loadTasks, saveTasks } = require("../utils/tasks");

function listTasks() {
  const tasks = loadTasks();
  const now = new Date();

  let updated = false;

  tasks.forEach((task) => {
    if (!task.done && !task.missed && new Date(task.deadline) < now) {
      task.missed = true;
      updated = true;
    }
  });

  if (updated) saveTasks(tasks);

  if (tasks.length === 0) {
    console.log("🗒️ No tasks found.");
  } else {
    tasks.forEach((task, index) => {
      const status = task.done
        ? "✅"
        : task.missed
          ? "⚠️ Missed"
          : "❌ Pending";
      console.log(`${index + 1}. ${status} | ${task.text}`);
      console.log(`    📅 Created: ${task.createdAt}`);
      console.log(`    ⏳ Deadline: ${task.deadline}`);
    });
  }
}

module.exports = listTasks;
