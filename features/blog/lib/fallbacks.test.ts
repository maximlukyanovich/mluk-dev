import { describe, expect, it } from "vitest";

import { switchHref } from "@/shared/i18n/switch-href";

import { buildFallbacks } from "./fallbacks";
import { testPost, testPosts } from "./test-posts";

/** The entries for list pages and tags, without the untranslated posts. */
const listPaths = (map: Record<string, string> = {}) =>
  Object.fromEntries(
    Object.entries(map).filter(([path]) =>
      /^\/writing\/(page|tag)\//.test(path),
    ),
  );

describe("buildFallbacks", () => {
  it("sends an untranslated post to the target's list", () => {
    const fallbacks = buildFallbacks(
      {
        en: [testPost("both", "en"), testPost("only-en", "en")],
        ru: [testPost("both", "ru")],
      },
      "en",
    );
    expect(fallbacks.ru).toEqual({ "/writing/only-en": "/writing" });
  });

  it("sends a tag the target lacks to the list", () => {
    const fallbacks = buildFallbacks(
      {
        en: [testPost("a", "en", ["mdx", "css"])],
        ru: [testPost("a", "ru", ["css"])],
      },
      "en",
    );
    expect(fallbacks.ru).toEqual({ "/writing/tag/mdx": "/writing" });
  });

  it("sends a page past the target's last page to the list", () => {
    const fallbacks = buildFallbacks(
      { en: testPosts(25, "en"), ru: testPosts(15, "ru") },
      "en",
    );
    expect(listPaths(fallbacks.ru)).toEqual({ "/writing/page/3": "/writing" });
  });

  it("sends a tag page past the target's last to the tag, or to the list", () => {
    const en = [...testPosts(21, "en", ["mdx", "css"])];
    const ru = [...testPosts(5, "ru", ["mdx"])];
    expect(listPaths(buildFallbacks({ en, ru }, "en").ru)).toEqual({
      "/writing/page/2": "/writing",
      "/writing/page/3": "/writing",
      "/writing/tag/mdx/page/2": "/writing/tag/mdx",
      "/writing/tag/mdx/page/3": "/writing/tag/mdx",
      "/writing/tag/css": "/writing",
      "/writing/tag/css/page/2": "/writing",
      "/writing/tag/css/page/3": "/writing",
    });
  });

  it("has no entry for a target that has everything", () => {
    const posts = {
      en: [testPost("a", "en", ["mdx"])],
      ru: [testPost("a", "ru", ["mdx"])],
    };
    expect(buildFallbacks(posts, "en")).toEqual({});
    expect(buildFallbacks(posts, "ru")).toEqual({});
  });

  it("drives the language switch", () => {
    const fallbacks = buildFallbacks(
      { en: [testPost("only-en", "en")], ru: [] },
      "en",
    );
    const path = "/en/writing/only-en";
    expect(switchHref(path, "ru", fallbacks.ru?.["/writing/only-en"])).toBe(
      "/ru/writing",
    );
    expect(switchHref("/en/writing", "ru", fallbacks.ru?.["/writing"])).toBe(
      "/ru/writing",
    );
  });
});
