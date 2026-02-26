import "dotenv/config";
import express, { Request, Response } from "express";
import { fetchUserActivity } from "./github";
import { formatActivity } from "./formatter";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.json({
    message: "GitHub Activity API",
    endpoints: {
      "GET /activity/:username": "Fetch recent GitHub activity for a user",
      "GET /activity/:username?format=text": "Return activity as plain text",
    },
  });
});

app.get(
  "/activity/:username",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (req: Request, res: Response<any>) => {
    const { username } = req.params;
    const format = req.query.format as string | undefined;

    try {
      const events = await fetchUserActivity(username);

      if (format === "text") {
        res.type("text").send(formatActivity(events));
        return;
      }

      res.json({ username, count: events.length, activity: events });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      if (message.includes("not found")) {
        res.status(404).json({ error: message });
      } else {
        res.status(500).json({ error: message });
      }
    }
  }
);

app.listen(PORT, () => {
  console.log(`GitHub Activity server running on http://localhost:${PORT}`);
});
