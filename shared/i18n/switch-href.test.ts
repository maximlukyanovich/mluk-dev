import { describe, expect, it } from "vitest";

import { switchHref } from "./switch-href";

describe("switchHref", () => {
  it("keeps the page, slug included, in the other locale", () => {
    expect(switchHref("/en/writing/hello-world", "ru")).toBe(
      "/ru/writing/hello-world",
    );
  });

  it("switches the locale root", () => {
    expect(switchHref("/ru", "en")).toBe("/en");
  });

  it("goes to the fallback when the page has no version in the target", () => {
    expect(switchHref("/en/writing/en-only", "ru", "/writing")).toBe(
      "/ru/writing",
    );
  });
});
