# GitHub Activity

A CLI tool and REST API built with **TypeScript** and **Node.js** that fetches and displays recent public activity for any GitHub user using the [GitHub Events API](https://docs.github.com/en/rest/activity/events).

---

## Features

- Fetch recent public activity for any GitHub user
- CLI tool for quick terminal usage
- REST API server with JSON and plain text responses
- Accurate commit counts per push using the GitHub Compare API
- Supports multiple event types: pushes, issues, pull requests, stars, forks, releases, and more
- Optional `GITHUB_TOKEN` support via `.env` for higher rate limits

---

## Project Structure

```
github-activity/
├── src/
│   ├── index.ts       # Express REST API server
│   ├── cli.ts         # CLI entry point
│   ├── github.ts      # GitHub API fetching logic
│   ├── formatter.ts   # Event formatting/display logic
│   └── types.ts       # TypeScript type definitions
├── dist/              # Compiled JavaScript output
├── package.json
└── tsconfig.json
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm
- A GitHub Personal Access Token (recommended for commit counts and higher rate limits)

---

## Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/github-activity.git
cd github-activity
```

**2. Install dependencies**

```bash
npm install
```

**3. Build the project**

```bash
npm run build
```

**4. Set up your GitHub token (recommended)**

Create a `.env` file in the project root:

```bash
GITHUB_TOKEN=your_token_here
```

To generate a token:
1. Go to **GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)**
2. Click **Generate new token (classic)**
3. Check the **`read:user`** scope
4. Generate and paste it into `.env`

> Without a token, commit counts won't be shown and you're limited to 60 API requests/hour.
> With a token, you get full commit counts and 5,000 requests/hour.

---

## Usage

### CLI

Run the CLI to fetch and display a GitHub user's recent activity directly in your terminal.

```bash
npm run cli -- <username>
```

**Example:**

```bash
npm run cli -- torvalds
```

**Example output:**

```
Fetching activity for "torvalds"...

Output:
- Pushed 3 commits to torvalds/linux
- Commented on an issue in torvalds/linux
- Starred sindresorhus/awesome
```

---

### REST API Server

Start the server:

```bash
npm start
```

The server runs on `http://localhost:3000` by default. You can change the port by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

---

## API Endpoints

### `GET /`

Returns a summary of available endpoints.

**Response:**

```json
{
  "message": "GitHub Activity API",
  "endpoints": {
    "GET /activity/:username": "Fetch recent GitHub activity for a user",
    "GET /activity/:username?format=text": "Return activity as plain text"
  }
}
```

---

### `GET /activity/:username`

Fetches recent public activity for the given GitHub username and returns it as JSON.

**Example request:**

```
GET /activity/torvalds
```

**Example response:**

```json
{
  "username": "torvalds",
  "count": 30,
  "activity": [
    {
      "type": "PushEvent",
      "repo": { "name": "torvalds/linux" },
      ...
    }
  ]
}
```

---

### `GET /activity/:username?format=text`

Same as above but returns the activity as a plain text list.

**Example request:**

```
GET /activity/torvalds?format=text
```

**Example response:**

```
- Pushed 3 commits to torvalds/linux
- Starred sindresorhus/awesome
- Opened a pull request in torvalds/linux
```

---

## Supported Event Types

| Event             | Description                          |
|-------------------|--------------------------------------|
| `PushEvent`       | Commits pushed to a repository       |
| `IssuesEvent`     | Issue opened, closed, or updated     |
| `IssueCommentEvent` | Comment on an issue               |
| `WatchEvent`      | Repository starred                   |
| `ForkEvent`       | Repository forked                    |
| `CreateEvent`     | Branch or tag created                |
| `DeleteEvent`     | Branch or tag deleted                |
| `PullRequestEvent`| Pull request opened, closed, merged  |
| `CommitCommentEvent` | Comment on a commit              |
| `ReleaseEvent`    | A new release published              |
| `PublicEvent`     | Repository made public               |
| `MemberEvent`     | Collaborator added to a repository   |

---

## Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run build` | Compile TypeScript to JavaScript         |
| `npm start`     | Start the REST API server                |
| `npm run dev`   | Run the API server with ts-node          |
| `npm run cli`   | Run the CLI directly with ts-node        |

---

## Error Handling

| Scenario               | Response                              |
|------------------------|---------------------------------------|
| Username not found     | `404` — `{ "error": "User \"x\" not found" }` |
| GitHub API error       | `500` — `{ "error": "..." }`          |
| Network failure        | `500` — `{ "error": "Network error: ..." }` |

---

## Tech Stack

- **TypeScript** — type-safe JavaScript
- **Node.js** — runtime environment
- **Express** — REST API framework
- **dotenv** — environment variable management
- **GitHub Events API** — public activity data source
- **GitHub Compare API** — used to fetch accurate commit counts per push

---

## License

MIT
