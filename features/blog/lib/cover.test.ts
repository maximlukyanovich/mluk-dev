import { describe, expect, it } from "vitest";

import { coverMeta, coverPath } from "./cover";
import { testPost } from "./test-posts";

describe("cover", () => {
  it("lives under the post, per locale", () => {
    expect(coverPath("ru", "hello")).toBe("/ru/writing/hello/cover.png");
  });

  it("reads date, read time and locale in the post's language", () => {
    const post = {
      ...testPost("hello", "ru", [], "2026-11-18"),
      readingTime: 8,
    };
    expect(coverMeta(post)).toBe("2026-11-18 · 8 мин · RU");
    expect(coverMeta({ ...post, locale: "en" })).toBe(
      "2026-11-18 · 8 min · EN",
    );
  });
});
