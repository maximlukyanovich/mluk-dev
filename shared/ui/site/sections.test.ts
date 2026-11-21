import { describe, expect, it } from "vitest";

import { isInSection } from "./sections";

describe("isInSection", () => {
  it("marks the section page and its descendants", () => {
    expect(isInSection("/en/writing", "/writing")).toBe(true);
    expect(isInSection("/ru/writing/tag/nextjs/page/2", "/writing")).toBe(true);
  });

  it("leaves the home page and lookalike paths unmarked", () => {
    expect(isInSection("/en", "/writing")).toBe(false);
    expect(isInSection("/en/cvs", "/cv")).toBe(false);
    expect(isInSection("/en/projects", "/cv")).toBe(false);
  });
});
