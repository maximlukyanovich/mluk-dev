import { locales, type Locale } from "@/shared/i18n/locales";
import type { SitemapPage } from "@/shared/lib/sitemap";

import { getPosts } from "./posts";
import { writingRoutes } from "./routes";
import type { Post } from "./types";

/** The latest publication or update among `posts`, if any. */
function lastChange(posts: readonly Post[]): string | undefined {
  return posts
    .map((post) => post.updated ?? post.date)
    .sort()
    .at(-1);
}

/**
 * Every blog page (`writingRoutes`) and the locales it exists in, with the
 * latest change it shows.
 */
export function writingPages(
  postsByLocale: Record<Locale, readonly Post[]>,
): SitemapPage[] {
  const pages = new Map<string, SitemapPage["versions"]>();
  for (const locale of locales) {
    for (const { path, posts } of writingRoutes(postsByLocale[locale])) {
      const versions = pages.get(path) ?? [];
      versions.push({ locale, lastModified: lastChange(posts) });
      pages.set(path, versions);
    }
  }
  return [...pages].map(([path, versions]) => ({ path, versions }));
}

export function getWritingPages(): SitemapPage[] {
  const postsByLocale = Object.fromEntries(
    locales.map((locale) => [locale, getPosts(locale)]),
  ) as Record<Locale, Post[]>;
  return writingPages(postsByLocale);
}

/** The locales a blog page exists in, for its `hreflang` links. */
export function writingPageLocales(path: string): Locale[] {
  const page = getWritingPages().find((entry) => entry.path === path);
  return page ? page.versions.map(({ locale }) => locale) : [];
}
