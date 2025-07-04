const { loadTasks, saveTasks } = require("../utils/tasks");

function deleteTask(taskIndex) {
  const tasks = loadTasks();
  const i = parseInt(taskIndex) - 1;
  if (tasks[i]) {
    tasks.splice(i, 1);
    saveTasks(tasks);
    console.log("🗑️ Task deleted.");
  } else {
    console.log("❗Invalid task number.");
  }
}

module.exports = deleteTask;
