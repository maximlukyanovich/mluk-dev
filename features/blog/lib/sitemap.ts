import { locales, type Locale } from "@/shared/i18n/locales";
import type { SitemapPage } from "@/shared/lib/sitemap";

import { pageCount } from "./paginate";
import { countTags, getPosts } from "./posts";
import type { Post } from "./types";

/** The latest publication or update among `posts`, if any. */
function lastChange(posts: readonly Post[]): string | undefined {
  return posts
    .map((post) => post.updated ?? post.date)
    .sort()
    .at(-1);
}

/**
 * Every blog page and the locales it exists in: the list (in every locale,
 * its empty state included) and its pages, each tag and its pages, each
 * post — with the latest change it shows.
 */
export function writingPages(
  postsByLocale: Record<Locale, readonly Post[]>,
): SitemapPage[] {
  const pages = new Map<string, SitemapPage["versions"]>();
  const add = (path: string, locale: Locale, posts: readonly Post[]) => {
    const versions = pages.get(path) ?? [];
    versions.push({ locale, lastModified: lastChange(posts) });
    pages.set(path, versions);
  };
  const paged = (base: string, locale: Locale, posts: readonly Post[]) => {
    for (let n = 2; n <= pageCount(posts.length); n++) {
      add(`${base}/page/${n}`, locale, posts);
    }
  };

  for (const locale of locales) {
    const posts = postsByLocale[locale];
    add("/writing", locale, posts);
    paged("/writing", locale, posts);
    for (const { tag } of countTags(posts)) {
      const tagged = posts.filter((post) => post.tags.includes(tag));
      add(`/writing/tag/${tag}`, locale, tagged);
      paged(`/writing/tag/${tag}`, locale, tagged);
    }
    for (const post of posts) add(`/writing/${post.slug}`, locale, [post]);
  }

  return [...pages].map(([path, versions]) => ({ path, versions }));
}

export function getWritingPages(): SitemapPage[] {
  const postsByLocale = Object.fromEntries(
    locales.map((locale) => [locale, getPosts(locale)]),
  ) as Record<Locale, Post[]>;
  return writingPages(postsByLocale);
}
