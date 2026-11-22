import { locales, type Locale } from "@/shared/i18n/locales";
import type { PathFallbacks } from "@/shared/i18n/switch-href";

import { getPosts } from "./posts";
import { listPath } from "./list";
import { writingRoutes } from "./routes";
import type { Post } from "./types";

/**
 * Where the language switch sends a visitor from a blog page that has no
 * version in the target locale: target → { locale-less path → fallback }.
 * A path that exists in the target is absent and keeps its own URL.
 */
export type WritingFallbacks = PathFallbacks;

/** The pure part of `writingFallbacks`, over each locale's posts. */
export function buildFallbacks(
  postsByLocale: Record<Locale, readonly Post[]>,
  locale: Locale,
): WritingFallbacks {
  const from = writingRoutes(postsByLocale[locale]);
  const fallbacks: Partial<Record<Locale, Record<string, string>>> = {};

  for (const target of locales) {
    if (target === locale) continue;
    const exists = new Set(
      writingRoutes(postsByLocale[target]).map(({ path }) => path),
    );
    const map: Record<string, string> = {};
    // A missing page goes to its parent when the target has it — a tag page
    // past the target's last to the tag — and to the list otherwise.
    for (const route of from) {
      if (route.kind === "list" || exists.has(route.path)) continue;
      map[route.path] = exists.has(route.parent) ? route.parent : listPath();
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
