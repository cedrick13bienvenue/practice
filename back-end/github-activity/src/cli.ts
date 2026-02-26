#!/usr/bin/env ts-node
import "dotenv/config";

import { fetchUserActivity } from "./github";
import { formatActivity } from "./formatter";

const username = process.argv[2];

if (!username) {
  console.error("Error: Please provide a GitHub username.");
  console.error("Usage: github-activity <username>");
  process.exit(1);
}

console.log(`Fetching activity for "${username}"...\n`);

fetchUserActivity(username)
  .then((events) => {
    console.log("Output:");
    console.log(formatActivity(events));
  })
  .catch((err: Error) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
