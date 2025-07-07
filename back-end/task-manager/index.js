const inquirer = require("inquirer");
const addTask = require("./commands/add");
const listTasks = require("./commands/list");
const markDone = require("./commands/done");
const deleteTask = require("./commands/delete");

async function mainMenu() {
  console.clear();
  console.log("📝 Task Manager CLI\n");

  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "Choose an action:",
      choices: [
        { name: "➕ Add Task", value: "add" },
        { name: "📋 List Tasks", value: "list" },
        { name: "✅ Mark Task as Done", value: "done" },
        { name: "🗑️ Delete Task", value: "delete" },
        { name: "🚪 Exit", value: "exit" },
      ],
    },
  ]);

  switch (action) {
    case "add":
      const { text, deadline } = await inquirer.prompt([
        {
          type: "input",
          name: "text",
          message: "Enter task description:",
        },
        {
          type: "input",
          name: "deadline",
          message: "Enter deadline (e.g. 2025-07-10T23:59):",
        },
      ]);
      addTask(text, deadline);
      break;

    case "list":
      listTasks();
      break;

    case "done":
      const { doneIndex } = await inquirer.prompt([
        {
          type: "number",
          name: "doneIndex",
          message: "Enter task number to mark as done:",
        },
      ]);
      markDone(doneIndex);
      break;

    case "delete":
      const { deleteIndex } = await inquirer.prompt([
        {
          type: "number",
          name: "deleteIndex",
          message: "Enter task number to delete:",
        },
      ]);
      deleteTask(deleteIndex);
      break;

    case "exit":
      console.log("\n👋 Goodbye!\n");
      process.exit();
  }

  setTimeout(mainMenu, 500);
}

mainMenu();
