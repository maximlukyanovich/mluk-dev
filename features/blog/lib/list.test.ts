import { describe, expect, it } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { listPage, listPagePath, listPath, listTitle } from "./list";

type WritingQuery = Parameters<typeof listPage>[1];
import { testPost, testPosts } from "./test-posts";

const slugs = (posts: { slug: string }[]) => posts.map(({ slug }) => slug);

describe("listPath and listPagePath", () => {
  it("puts page 1 at the list's own URL", () => {
    expect(listPagePath(listPath(), 1)).toBe("/writing");
    expect(listPagePath(listPath(), 3)).toBe("/writing/page/3");
    expect(listPagePath(listPath("css"), 1)).toBe("/writing/tag/css");
    expect(listPagePath(listPath("css"), 2)).toBe("/writing/tag/css/page/2");
  });
});

describe("listPage", () => {
  const posts = testPosts(25, "en", ["nextjs"]);

  it("shows the newest post large on the first page of /writing, as one of its ten", () => {
    const first = listPage(posts)!;
    expect(first.latest?.slug).toBe("p1");
    expect(slugs(first.rows)).toEqual(slugs(posts.slice(1, 10)));
    expect(first).toMatchObject({ page: 1, pages: 3, total: 25 });
  });

  it("has no large card further on", () => {
    const third = listPage(posts, { raw: "3" })!;
    expect(third.latest).toBeUndefined();
    expect(slugs(third.rows)).toEqual(slugs(posts.slice(20)));
  });

  it("filters by tag, without the large card, and pages the same way", () => {
    const mixed = [
      ...testPosts(12, "en", ["css"]),
      testPost("other", "en", ["i18n"]),
    ];
    const tagged = listPage(mixed, { tag: "css" })!;
    expect(tagged.latest).toBeUndefined();
    expect(tagged.rows).toHaveLength(10);
    expect(tagged).toMatchObject({
      pages: 2,
      total: 12,
      base: "/writing/tag/css",
    });
    expect(listPage(mixed, { tag: "css", raw: "2" })!.rows).toHaveLength(2);
    // The filter lists the locale's tags, not only the current one.
    expect(tagged.tags.map(({ tag }) => tag)).toEqual(["css", "i18n"]);
  });

  it.each([
    [{ tag: "nope" }, "an unknown tag"],
    [{ raw: "1" }, "page 1 under page/"],
    [{ raw: "4" }, "past the last page"],
    [{ raw: "2a" }, "not a number"],
    [{ tag: "nextjs", raw: "4" }, "past a tag's last page"],
  ] as [WritingQuery, string][])("is a 404 for %j: %s", (query) => {
    expect(listPage(posts, query)).toBeNull();
  });

  it("gives an empty /writing its empty state, and nothing under it", () => {
    expect(listPage([])).toMatchObject({
      latest: undefined,
      rows: [],
      total: 0,
      pages: 1,
    });
    expect(listPage([], { raw: "2" })).toBeNull();
    expect(listPage([], { tag: "css" })).toBeNull();
  });
});

describe("listTitle", () => {
  it.each([
    ["en", undefined, 1, "Writing"],
    ["en", undefined, 2, "Writing · page 2"],
    ["en", "css", 1, "#css · Writing"],
    ["ru", "css", 3, "#css · Блог · страница 3"],
  ] as const)("%s, tag %s, page %i → %s", (locale, tag, page, title) => {
    expect(listTitle({ tag, page }, dictionaryFor(locale).writing)).toBe(title);
  });
});
