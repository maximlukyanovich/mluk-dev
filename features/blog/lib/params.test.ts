import { beforeEach, describe, expect, it, vi } from "vitest";

import { parsePage } from "./paginate";
import { generateTagPageParams, noneParam, staticParams } from "./params";
import { getPosts } from "./posts";
import { testPost, testPosts } from "./test-posts";

vi.mock("./posts", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./posts")>()),
  getPosts: vi.fn(),
}));

describe("static params", () => {
  it("lists a locale's slugs and tags", () => {
    const posts = [
      testPost("a", "en", ["mdx"]),
      testPost("b", "en", ["mdx", "css"]),
    ];
    expect(staticParams(posts, "post")).toEqual([{ slug: "a" }, { slug: "b" }]);
    expect(staticParams(posts, "tag")).toEqual([
      { tag: "mdx" },
      { tag: "css" },
    ]);
  });

  it("lists pages 2…N", () => {
    expect(staticParams(testPosts(25, "en"), "listPage")).toEqual([
      { n: "2" },
      { n: "3" },
    ]);
  });

  it("counts a tag's pages from its own posts", () => {
    const posts = [
      ...testPosts(11, "en", ["mdx"]),
      testPost("other", "en", ["css"]),
    ];
    expect(staticParams(posts, "tagPage")).toEqual([{ tag: "mdx", n: "2" }]);
  });

  describe("with no posts, a placeholder its page turns into a 404", () => {
    it("slug and tag", () => {
      expect(staticParams([], "post")).toEqual([{ slug: noneParam }]);
      expect(staticParams([], "tag")).toEqual([{ tag: noneParam }]);
    });

    it("pages, when one page holds everything", () => {
      for (const posts of [[], testPosts(10, "en")]) {
        const [{ n }] = staticParams(posts, "listPage");
        expect(parsePage(n, 1)).toBeNull();
      }
      expect(staticParams(testPosts(3, "en", ["mdx"]), "tagPage")).toEqual([
        { tag: noneParam, n: noneParam },
      ]);
    });
  });
});

describe("generateTagPageParams", () => {
  beforeEach(() => vi.mocked(getPosts).mockReset());

  // Next hands it only the root layout's `lang`: tag/[tag]/page.tsx is a
  // sibling, not a parent, so the tag comes from the generator itself.
  it("returns the tag with each page, given only the locale", () => {
    vi.mocked(getPosts).mockReturnValue(testPosts(11, "en", ["mdx"]));
    expect(generateTagPageParams({ params: { lang: "en" } })).toEqual([
      { tag: "mdx", n: "2" },
    ]);
    expect(getPosts).toHaveBeenCalledWith("en");
  });
});
