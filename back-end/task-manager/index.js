#!/usr/bin/env node

const addTask = require("./commands/add");
const listTasks = require("./commands/list");
const markDone = require("./commands/done");
const deleteTask = require("./commands/delete");

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case "add":
    addTask(args.join(" "));
    break;
  case "list":
    listTasks();
    break;
  case "done":
    markDone(args[0]);
    break;
  case "delete":
    deleteTask(args[0]);
    break;
  default:
    console.log(`
Usage:
  node index.js add "Task description"
  node index.js list
  node index.js done [task_number]
  node index.js delete [task_number]
    `);
}
