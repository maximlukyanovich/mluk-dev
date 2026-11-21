import { describe, expect, it } from "vitest";

import { parsePage } from "./paginate";
import {
  noneParam,
  pageParams,
  slugParams,
  tagPageParams,
  tagParams,
} from "./params";
import { testPost, testPosts } from "./test-posts";

describe("static params", () => {
  it("lists a locale's slugs and tags", () => {
    const posts = [
      testPost("a", "en", ["mdx"]),
      testPost("b", "en", ["mdx", "css"]),
    ];
    expect(slugParams(posts)).toEqual([{ slug: "a" }, { slug: "b" }]);
    expect(tagParams(posts)).toEqual([{ tag: "mdx" }, { tag: "css" }]);
  });

  it("lists pages 2…N", () => {
    expect(pageParams(25)).toEqual([{ n: "2" }, { n: "3" }]);
  });

  it("counts a tag's pages from its own posts", () => {
    const posts = [
      ...testPosts(11, "en", ["mdx"]),
      testPost("other", "en", ["css"]),
    ];
    expect(tagPageParams(posts, "mdx")).toEqual([{ n: "2" }]);
  });

  describe("with no posts, a placeholder its page turns into a 404", () => {
    it("slug and tag", () => {
      expect(slugParams([])).toEqual([{ slug: noneParam }]);
      expect(tagParams([])).toEqual([{ tag: noneParam }]);
    });

    it("pages, when one page holds everything", () => {
      for (const total of [0, 10]) {
        const [{ n }] = pageParams(total);
        expect(parsePage(n, 1)).toBeNull();
      }
      expect(tagPageParams(testPosts(3, "en", ["mdx"]), "mdx")).toEqual([
        { n: "2" },
      ]);
    });
  });
});
