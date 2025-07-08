const { loadTasks, saveTasks } = require("../utils/tasks");

function addTask(taskText) {
  const tasks = loadTasks();
  const newTask = { id: Date.now(), text: taskText, done: false };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log("✅ Task added.");
}

module.exports = addTask;
