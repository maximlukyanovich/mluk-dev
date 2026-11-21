import { locales, type Locale } from "@/shared/i18n/locales";

import { pageCount } from "./paginate";
import { countTags, getPosts } from "./posts";
import type { Post } from "./types";

/**
 * Where the language switch sends a visitor from a blog page that has no
 * version in the target locale: target → { locale-less path → fallback }.
 * A path that exists in the target is absent and keeps its own URL.
 */
export type WritingFallbacks = Partial<Record<Locale, Record<string, string>>>;

const list = "/writing";

/** The pure part of `writingFallbacks`, over each locale's posts. */
export function buildFallbacks(
  postsByLocale: Record<Locale, readonly Post[]>,
  locale: Locale,
): WritingFallbacks {
  const from = postsByLocale[locale];
  const fallbacks: WritingFallbacks = {};

  for (const target of locales) {
    if (target === locale) continue;
    const to = postsByLocale[target];
    const map: Record<string, string> = {};

    const translated = new Set(to.map((post) => post.slug));
    for (const post of from) {
      if (!translated.has(post.slug)) map[`${list}/${post.slug}`] = list;
    }

    for (let n = pageCount(to.length) + 1; n <= pageCount(from.length); n++) {
      map[`${list}/page/${n}`] = list;
    }

    const targetTags = new Map(
      countTags(to).map(({ tag, count }) => [tag, count]),
    );
    for (const { tag, count } of countTags(from)) {
      const tagPath = `${list}/tag/${tag}`;
      const targetCount = targetTags.get(tag) ?? 0;
      if (!targetCount) map[tagPath] = list;
      // A tag page past the target's last goes to the tag, or to the list
      // when the target has no such tag at all.
      const firstMissing = targetCount ? pageCount(targetCount) + 1 : 2;
      for (let n = firstMissing; n <= pageCount(count); n++) {
        map[`${tagPath}/page/${n}`] = targetCount ? tagPath : list;
      }
    }

    if (Object.keys(map).length) fallbacks[target] = map;
  }
  return fallbacks;
}

/** The fallbacks for a page in `locale`, for the header and footer switches. */
export function writingFallbacks(locale: Locale): WritingFallbacks {
  const postsByLocale = Object.fromEntries(
    locales.map((l) => [l, getPosts(l)]),
  ) as Record<Locale, Post[]>;
  return buildFallbacks(postsByLocale, locale);
}
