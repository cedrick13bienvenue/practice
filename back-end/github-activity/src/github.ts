import https from "https";
import { GitHubEvent } from "./types";

export function fetchUserActivity(username: string): Promise<GitHubEvent[]> {
  return new Promise((resolve, reject) => {
    const options: https.RequestOptions = {
      hostname: "api.github.com",
      path: `/users/${encodeURIComponent(username)}/events`,
      method: "GET",
      headers: {
        "User-Agent": "github-activity-cli",
        Accept: "application/vnd.github.v3+json",
      },
    };

    const req = https.request(options, (res) => {
      let raw = "";

      res.on("data", (chunk: Buffer) => {
        raw += chunk.toString();
      });

      res.on("end", () => {
        if (res.statusCode === 404) {
          reject(new Error(`User "${username}" not found`));
          return;
        }

        if (res.statusCode !== 200) {
          reject(
            new Error(
              `GitHub API responded with status ${res.statusCode}`
            )
          );
          return;
        }

        try {
          const events: GitHubEvent[] = JSON.parse(raw);
          resolve(events);
        } catch {
          reject(new Error("Failed to parse response from GitHub API"));
        }
      });
    });

    req.on("error", (err: Error) => {
      reject(new Error(`Network error: ${err.message}`));
    });

    req.end();
  });
}
