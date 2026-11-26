import { parseEnv } from "node:util";

/** The port Next serves on when nothing sets one. */
export const defaultPort = "3000";

/** The commands that serve on a port; `next build`, `next lint` and the rest take no `--port`. */
const serving = new Set(["dev", "start"]);

/**
 * The PORT a dotenv text sets, read the way Node reads env files (`parseEnv`:
 * quotes, `export`, comments, the last assignment). `port` is `null` when the
 * file sets none; `warning` says why a PORT line it has could not be used, so
 * a typo never falls back to 3000 in silence.
 */
export function portFrom(text) {
  const clean = text.replace(/^﻿/, "");
  const value = parseEnv(clean).PORT?.trim();
  if (value && /^\d+$/.test(value)) return { port: value };
  const mentioned = /^\s*(?:export\s+)?PORT\b/m.test(clean);
  if (value || mentioned) {
    return {
      port: null,
      warning: `PORT in .env.local is not a number (${JSON.stringify(value ?? "")}) — the default port is used; write PORT=<number>.`,
    };
  }
  return { port: null };
}

/**
 * The arguments for `next` after its binary: the command, then `--port` from
 * the file for a serving command — unless the environment already sets PORT,
 * which Next reads itself — then the rest.
 */
export function nextArgv(command, rest, envPort, fileText) {
  if (!serving.has(command) || envPort) return { argv: [command, ...rest] };
  const { port, warning } = portFrom(fileText);
  return {
    argv: [command, ...(port ? ["--port", port] : []), ...rest],
    warning,
  };
}

/**
 * The address of the local site, on the port `pnpm dev` and `pnpm start`
 * would take: PORT from the environment, else from the file, else 3000.
 */
export function localSite(envPort, fileText) {
  if (envPort) return { url: `http://localhost:${envPort}` };
  const { port, warning } = portFrom(fileText);
  return { url: `http://localhost:${port ?? defaultPort}`, warning };
}
