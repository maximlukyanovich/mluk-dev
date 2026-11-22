import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { getPosts } from "../lib/posts";
import { testPosts } from "../lib/test-posts";
import type { Post } from "../lib/types";
import { RecentPosts } from "./recent-posts";

vi.mock("../lib/posts", () => ({ getPosts: vi.fn() }));
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const posts = vi.mocked(getPosts);

function render(list: Post[]) {
  posts.mockReturnValue(list);
  return renderToStaticMarkup(
    <RecentPosts locale="ru" dictionary={dictionaryFor("ru")} />,
  );
}

describe("RecentPosts", () => {
  beforeEach(() => posts.mockReset());

  it("renders nothing when the locale has no posts", () => {
    expect(render([])).toBe("");
  });

  it("shows the four newest posts and the top one's excerpt only", () => {
    const list = testPosts(5, "ru").map((post) => ({
      ...post,
      excerpt: `Excerpt of ${post.slug}`,
    }));
    const html = render(list);
    expect(posts).toHaveBeenCalledWith("ru");
    expect(html.match(/class="mk-post"/g)).toHaveLength(4);
    expect(html).toContain('href="/ru/writing/p4"');
    expect(html).not.toContain('href="/ru/writing/p5"');
    expect(html.match(/mk-post-excerpt/g)).toHaveLength(1);
    expect(html).toContain("Excerpt of p1");
  });

  it("links the locale's feed and the full list", () => {
    const html = render(testPosts(1, "ru"));
    expect(html).toContain('href="/ru/feed.xml"');
    expect(html).toContain('href="/ru/writing"');
  });
});
