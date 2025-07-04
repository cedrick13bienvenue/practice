const { loadTasks, saveTasks } = require("../utils/tasks");

function markDone(taskIndex) {
  const tasks = loadTasks();
  const i = parseInt(taskIndex) - 1;
  if (tasks[i]) {
    tasks[i].done = true;
    saveTasks(tasks);
    console.log("👍 Task marked as done.");
  } else {
    console.log("❗Invalid task number.");
  }
}

module.exports = markDone;
