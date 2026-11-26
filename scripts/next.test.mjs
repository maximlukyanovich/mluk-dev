import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const launcher = path.join(import.meta.dirname, "next.mjs");
const envWithoutPort = { ...process.env };
delete envWithoutPort.PORT;

const runIn = (cwd, args, env = envWithoutPort) =>
  spawnSync(process.execPath, [launcher, ...args], {
    cwd,
    encoding: "utf8",
    env,
  });

function inTempDir(body) {
  const dir = mkdtempSync(path.join(tmpdir(), "next-launcher-"));
  try {
    body(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

// The wiring the pure tests in lib/port.test.mjs cannot see: Next's own CLI
// is found in this project's dependencies and runs with the built arguments.
describe("scripts/next.mjs", () => {
  it("runs this project's next in the same process, with no next on PATH", () => {
    const { status, stdout } = runIn(root, ["--version"], {
      ...envWithoutPort,
      PATH: path.dirname(process.execPath),
    });
    assert.equal(status, 0);
    assert.match(stdout, /Next\.js v\d+/);
  });

  it("reads .env.local from the folder it starts in and warns about a bad PORT", () => {
    inTempDir((dir) => {
      writeFileSync(path.join(dir, ".env.local"), "PORT=abc\n");
      const { status, stdout, stderr } = runIn(dir, ["dev", "--help"]);
      assert.equal(status, 0);
      assert.match(stdout, /Usage: next dev/);
      assert.match(stderr, /PORT in \.env\.local is not a number/);
    });
  });

  it("treats an empty PORT in the environment as unset", () => {
    // a folder without .env.local, so no --port masks the empty variable
    inTempDir((dir) => {
      const { status } = runIn(dir, ["dev", "--help"], {
        ...envWithoutPort,
        PORT: "",
      });
      assert.equal(status, 0);
    });
  });

  it("refuses to start without a command", () => {
    const { status, stderr } = runIn(root, []);
    assert.equal(status, 2);
    assert.match(stderr, /usage: node scripts\/next\.mjs <command>/);
  });
});
