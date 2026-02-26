import { GitHubEvent } from "./types";

function capitalize(str: string | undefined): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatEvent(event: GitHubEvent): string {
  const repo = event.repo.name;

  switch (event.type) {
    case "PushEvent": {
      const count = event.payload.size ?? event.payload.commits?.length;
      if (count !== undefined) {
        return `Pushed ${count} commit${count !== 1 ? "s" : ""} to ${repo}`;
      }
      return `Pushed to ${repo}`;
    }

    case "IssuesEvent":
      return `${capitalize(event.payload.action)} an issue in ${repo}`;

    case "IssueCommentEvent":
      return `Commented on an issue in ${repo}`;

    case "WatchEvent":
      return `Starred ${repo}`;

    case "ForkEvent":
      return `Forked ${repo} to ${event.payload.forkee?.full_name ?? "unknown"}`;

    case "CreateEvent":
      return `Created ${event.payload.ref_type} "${event.payload.ref ?? repo}" in ${repo}`;

    case "DeleteEvent":
      return `Deleted ${event.payload.ref_type} "${event.payload.ref}" in ${repo}`;

    case "PullRequestEvent":
      return `${capitalize(event.payload.action)} a pull request in ${repo}`;

    case "CommitCommentEvent":
      return `Commented on a commit in ${repo}`;

    case "ReleaseEvent":
      return `Released ${event.payload.release?.tag_name ?? "a version"} in ${repo}`;

    case "PublicEvent":
      return `Made ${repo} public`;

    case "MemberEvent":
      return `${capitalize(event.payload.action)} ${event.payload.member?.login ?? "a user"} to ${repo}`;

    default:
      return `${event.type.replace("Event", "")} activity in ${repo}`;
  }
}

export function formatActivity(events: GitHubEvent[]): string {
  if (!events || events.length === 0) {
    return "No recent activity found.";
  }

  return events.map((event) => `- ${formatEvent(event)}`).join("\n");
}
