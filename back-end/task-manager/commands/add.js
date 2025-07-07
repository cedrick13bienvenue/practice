const { loadTasks, saveTasks } = require("../utils/tasks");

function addTask(taskText, deadline) {
  const tasks = loadTasks();

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
    missed: false,
    createdAt: new Date().toISOString(),
    deadline: new Date(deadline).toISOString(),
  };

  tasks.push(newTask);
  saveTasks(tasks);
  console.log("✅ Task added with deadline.");
}

module.exports = addTask;
