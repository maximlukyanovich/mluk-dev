import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { localSite, nextArgv, portFrom } from "./port.mjs";

describe("portFrom", () => {
  it("reads PORT the way Node reads env files", () => {
    assert.deepEqual(portFrom("SOMETHING=x\nPORT=3001\n"), { port: "3001" });
    assert.equal(portFrom('PORT="3002"').port, "3002");
    assert.equal(portFrom("export PORT='3003'").port, "3003");
    assert.equal(portFrom("PORT=`3004`").port, "3004");
    assert.equal(portFrom("PORT=3005#this clone").port, "3005");
    assert.equal(portFrom("PORT=3001\nPORT=3006").port, "3006");
  });

  it("reads a file that starts with a byte-order mark", () => {
    assert.equal(portFrom("﻿PORT=3007").port, "3007");
  });

  it("sets no port and says nothing when the file has no PORT", () => {
    assert.deepEqual(portFrom("# PORT=3000\nNEXT_PUBLIC_PORT=4000"), {
      port: null,
    });
    assert.deepEqual(portFrom(""), { port: null });
  });

  it("warns instead of falling back in silence when a PORT line cannot be used", () => {
    for (const text of ["PORT=auto", "PORT: 3005", "PORT="]) {
      const { port, warning } = portFrom(text);
      assert.equal(port, null, text);
      assert.match(warning, /not a number/, text);
    }
  });
});

describe("nextArgv", () => {
  it("passes the file port to a serving command, before the rest", () => {
    assert.deepEqual(
      nextArgv("dev", ["--turbo"], undefined, "PORT=3001").argv,
      ["dev", "--port", "3001", "--turbo"],
    );
    assert.deepEqual(nextArgv("start", [], undefined, "PORT=3001").argv, [
      "start",
      "--port",
      "3001",
    ]);
  });

  it("leaves a PORT already in the environment to next", () => {
    assert.deepEqual(nextArgv("dev", [], "4000", "PORT=3001"), {
      argv: ["dev"],
    });
  });

  it("gives no port to a command that does not serve", () => {
    assert.deepEqual(nextArgv("build", [], undefined, "PORT=3001"), {
      argv: ["build"],
    });
    assert.deepEqual(nextArgv("--version", [], undefined, "PORT=3001"), {
      argv: ["--version"],
    });
  });

  it("passes nothing without a port and carries the warning of a bad one", () => {
    assert.deepEqual(nextArgv("dev", [], undefined, ""), {
      argv: ["dev"],
      warning: undefined,
    });
    assert.match(nextArgv("dev", [], undefined, "PORT=auto").warning, /number/);
  });
});

describe("localSite", () => {
  it("takes the port pnpm dev would take", () => {
    assert.equal(localSite("4000", "PORT=3001").url, "http://localhost:4000");
    assert.equal(
      localSite(undefined, "PORT=3001").url,
      "http://localhost:3001",
    );
    assert.equal(localSite(undefined, "").url, "http://localhost:3000");
  });

  it("falls back to 3000 with the warning of a bad file port", () => {
    const { url, warning } = localSite(undefined, "PORT=auto");
    assert.equal(url, "http://localhost:3000");
    assert.match(warning, /not a number/);
  });
});
