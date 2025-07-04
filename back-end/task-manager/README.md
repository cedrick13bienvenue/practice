# 📝 Task Manager CLI App

A simple command-line Task Manager built using modular JavaScript (Node.js). You can add, list, mark as done, and delete tasks — all stored in a local JSON file.

---

## 📁 Project Structure

```
task-manager/
├── index.js              # CLI entry point
├── commands/             # Command handlers
│   ├── add.js           # Add a task
│   ├── list.js          # List all tasks
│   ├── done.js          # Mark task as done
│   └── delete.js        # Delete a task
├── utils/
│   └── tasks.js         # Load and save task helpers
├── tasks.json           # Task data storage
└── README.md            # This file
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Run the App

Make sure you have Node.js installed.

```bash
node index.js <command> [arguments]
```

---

## 📚 Available Commands

### ➕ Add a Task

```bash
node index.js add "Your task description"
```

### 📋 List All Tasks

```bash
node index.js list
```

### ✅ Mark a Task as Done

```bash
node index.js done <task_number>
```

Example:

```bash
node index.js done 2
```

### 🗑️ Delete a Task

```bash
node index.js delete <task_number>
```

Example:

```bash
node index.js delete 3
```

---

## 🧠 How It Works

- All tasks are stored in a local `tasks.json` file.
- Each task has:
  - `id`: a unique timestamp
  - `text`: the task description
  - `done`: `true` or `false`

---

## 💡 Example Usage

```bash
node index.js add "Build CLI task manager"
node index.js list
node index.js done 1
node index.js delete 1
```

---

## 📌 Notes

- You don't need a database — it's all stored in a simple `.json` file.
- This is a great foundation for learning modular JavaScript and Node.js CLI tools.

---

## 📥 Future Improvements (Optional)

- Add due dates or priorities
- Colorful terminal output (`chalk`)
- Interactive input (`inquirer`)
- Global installation (`npm link`)

---

## 👨‍💻 Author

**Bienvenue Cedrick**

Simple Node CLI app for practice and productivity!
