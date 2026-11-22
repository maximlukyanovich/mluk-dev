import { describe, expect, it } from "vitest";

import { writingPages } from "./sitemap";
import { testPost, testPosts } from "./test-posts";

const byPath = (pages: ReturnType<typeof writingPages>) =>
  Object.fromEntries(pages.map(({ path, versions }) => [path, versions]));

describe("writingPages", () => {
  it("lists a post only in the locales it is written in, dated", () => {
    const pages = byPath(
      writingPages({
        en: [
          {
            ...testPost("both", "en", [], "2026-11-01"),
            updated: "2026-11-09",
          },
        ],
        ru: [
          testPost("both", "ru", [], "2026-11-02"),
          testPost("ru-only", "ru", [], "2026-11-05"),
        ],
      }),
    );
    expect(pages["/writing/both"]).toEqual([
      { locale: "en", lastModified: "2026-11-09" },
      { locale: "ru", lastModified: "2026-11-02" },
    ]);
    expect(pages["/writing/ru-only"]).toEqual([
      { locale: "ru", lastModified: "2026-11-05" },
    ]);
  });

  it("keeps the list in every locale, empty included, dated by its newest post", () => {
    const pages = byPath(
      writingPages({ en: [testPost("a", "en", [], "2026-11-03")], ru: [] }),
    );
    expect(pages["/writing"]).toEqual([
      { locale: "en", lastModified: "2026-11-03" },
      { locale: "ru", lastModified: undefined },
    ]);
  });

  it("adds list and tag pages past the first, where they exist", () => {
    const pages = byPath(
      writingPages({
        en: testPosts(21, "en", ["mdx"]),
        ru: testPosts(11, "ru", ["css"]),
      }),
    );
    expect(Object.keys(pages).filter((p) => p.includes("/page/"))).toEqual([
      "/writing/page/2",
      "/writing/page/3",
      "/writing/tag/mdx/page/2",
      "/writing/tag/mdx/page/3",
      "/writing/tag/css/page/2",
    ]);
    expect(pages["/writing/page/2"].map((v) => v.locale)).toEqual(["en", "ru"]);
    expect(pages["/writing/page/3"].map((v) => v.locale)).toEqual(["en"]);
    expect(pages["/writing/tag/css"].map((v) => v.locale)).toEqual(["ru"]);
  });
});
