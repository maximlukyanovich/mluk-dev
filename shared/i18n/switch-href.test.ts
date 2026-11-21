import { describe, expect, it } from "vitest";

import { switchHref, switchHrefIn } from "./switch-href";

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

describe("switchHrefIn", () => {
  const fallbacks = { ru: { "/writing/en-only": "/writing" } };

  it("takes the fallback the map gives for the page", () => {
    expect(switchHrefIn("/en/writing/en-only", "ru", fallbacks)).toBe(
      "/ru/writing",
    );
  });

  it("keeps the page when the map has no entry for it or the target", () => {
    expect(switchHrefIn("/en/writing/both", "ru", fallbacks)).toBe(
      "/ru/writing/both",
    );
    expect(switchHrefIn("/ru/writing/en-only", "en", fallbacks)).toBe(
      "/en/writing/en-only",
    );
    expect(switchHrefIn("/en/cv", "ru")).toBe("/ru/cv");
  });
});
