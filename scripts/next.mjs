// `pnpm dev` and `pnpm start`: Next on the port this clone keeps in
// .env.local (PORT), default 3000. Next reads PORT only from the environment
// it starts in, never from its .env files, so the port is passed as `--port`.
// Only PORT is read here: preloading the whole file would make its values win
// over Next's own loading (.env.development.local, a reload on an edit).
//
// Next runs inside this process — its own CLI, resolved from this project's
// dependencies — so there is one process to stop and never a global `next`.
//
//   node scripts/next.mjs <command> [next args…]
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

import { nextArgv } from "./lib/port.mjs";

const [command, ...rest] = process.argv.slice(2);
if (!command) {
  console.error(
    "usage: node scripts/next.mjs <command> [next args…]   (dev, start, …)",
  );
  process.exit(2);
}

let envLocal = "";
try {
  envLocal = readFileSync(".env.local", "utf8");
} catch {
  // no .env.local — the default port
}

// An empty PORT counts as unset: Next would reject it instead of falling back.
if (process.env.PORT === "") delete process.env.PORT;
const { argv, warning } = nextArgv(command, rest, process.env.PORT, envLocal);
if (warning) console.warn(warning);

const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
process.argv = [process.argv[0], nextBin, ...argv];
await import(pathToFileURL(nextBin).href);
