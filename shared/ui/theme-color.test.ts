import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { pageBackground } from "./theme-color";

describe("pageBackground", () => {
  it("matches the --bg token in both themes", () => {
    const tokens = readFileSync(
      new URL("./styles/tokens.css", import.meta.url),
      "utf8",
    );
    const bg = tokens.match(/--bg:\s*light-dark\(([^,]+),\s*([^)]+)\)/);
    expect(bg?.slice(1, 3)).toEqual([
      pageBackground.light,
      pageBackground.dark,
    ]);
  });
});
