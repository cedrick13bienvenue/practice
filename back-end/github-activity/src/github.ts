import https from "https";
import { GitHubEvent } from "./types";

const HEADERS: Record<string, string> = {
  "User-Agent": "github-activity-cli",
  Accept: "application/vnd.github.v3+json",
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

function get(path: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const req = https.request(
      { hostname: "api.github.com", path, method: "GET", headers: HEADERS },
      (res) => {
        let raw = "";
        res.on("data", (chunk: Buffer) => (raw += chunk.toString()));
        res.on("end", () => {
          try {
            resolve({ status: res.statusCode, body: JSON.parse(raw) });
          } catch {
            resolve({ status: res.statusCode, body: null });
          }
        });
      }
    );
    req.on("error", (err: Error) => reject(new Error(`Network error: ${err.message}`)));
    req.end();
  }) as Promise<unknown>;
}

async function fetchCommitCount(
  repoFullName: string,
  before: string,
  head: string
): Promise<number | undefined> {
  if (!before || !head || before === head) return undefined;
  try {
    const result = (await get(
      `/repos/${repoFullName}/compare/${before}...${head}`
    )) as { status: number; body: { ahead_by?: number } };
    if (result.status !== 200) return undefined;
    return result.body?.ahead_by;
  } catch {
    return undefined;
  }
}

export async function fetchUserActivity(username: string): Promise<GitHubEvent[]> {
  const result = (await get(
    `/users/${encodeURIComponent(username)}/events`
  )) as { status: number; body: GitHubEvent[] };

  if (result.status === 404) throw new Error(`User "${username}" not found`);
  if (result.status !== 200)
    throw new Error(`GitHub API responded with status ${result.status}`);

  const events: GitHubEvent[] = result.body;

  await Promise.all(
    events
      .filter((e) => e.type === "PushEvent" && e.payload.before && e.payload.head)
      .map(async (e) => {
        const count = await fetchCommitCount(
          e.repo.name,
          e.payload.before!,
          e.payload.head!
        );
        if (count !== undefined) e.payload.size = count;
      })
  );

  return events;
}
