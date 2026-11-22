import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";

import { pageCount, pageItems, parsePage } from "./paginate";
import { countTags } from "./posts";
import type { Post, TagCount } from "./types";

/** `/writing`, or a tag's `/writing/tag/<tag>`: page 1 of a list, locale-less. */
export function listPath(tag?: string): string {
  return tag ? `/writing/tag/${tag}` : "/writing";
}

/** Page `page` of the list at `base`: page 1 is the list's own URL. */
export function listPagePath(base: string, page: number): string {
  return page > 1 ? `${base}/page/${page}` : base;
}

/** One page of the blog list, ready to render. */
export type ListPage = {
  /** The tag the list is filtered by; none on `/writing`. */
  tag?: string;
  page: number;
  pages: number;
  /** Posts in the whole list, not on this page. */
  total: number;
  /** The large card of the newest post: `/writing`, first page only. */
  latest?: Post;
  /** The rows under it. */
  rows: Post[];
  /** Tags of the locale, for the filter. */
  tags: TagCount[];
  /** Locale-less path of page 1 of this list, for the pager. */
  base: string;
};

/**
 * Page `raw` (`undefined` for page 1) of the list of `posts` — one locale's,
 * newest first — filtered by `tag`; null when it is a 404: an unknown tag,
 * or a page `parsePage` rejects. On `/writing` the latest post is one of the
 * first page's ten, shown large; a tag page has no large card. An empty
 * `/writing` is a page with no rows, its empty state.
 */
export function listPage(
  posts: readonly Post[],
  { tag, raw }: { tag?: string; raw?: string } = {},
): ListPage | null {
  const listed = tag ? posts.filter((post) => post.tags.includes(tag)) : posts;
  if (tag && !listed.length) return null;

  const pages = pageCount(listed.length);
  const page = raw === undefined ? 1 : parsePage(raw, pages);
  if (page === null) return null;

  const items = pageItems(listed, page);
  const featured = !tag && page === 1;
  return {
    tag,
    page,
    pages,
    total: listed.length,
    latest: featured ? items[0] : undefined,
    rows: featured ? items.slice(1) : items,
    tags: countTags(posts),
    base: listPath(tag),
  };
}

/** A list page's URL in `locale`. */
export function listHref(locale: Locale, base: string, page: number): string {
  return localePath(locale, listPagePath(base, page));
}

/**
 * The `<title>` of a list page, before the site's " · mluk.dev": "Writing",
 * "#css · Writing", and either with " · page 2".
 */
export function listTitle(
  { tag, page }: Pick<ListPage, "tag" | "page">,
  words: Dictionary["writing"],
): string {
  const title = tag
    ? words.tagTitle.replace("{tag}", tag).replace("{title}", words.title)
    : words.title;
  return page > 1
    ? words.pageTitle.replace("{title}", title).replace("{n}", String(page))
    : title;
}
