import type { Metadata } from "next";

import { defaultLocale, localePath, locales, type Locale } from "./locales";

/**
 * `alternates` for a page's metadata: the canonical URL in `locale`, a
 * `hreflang` link for every locale the page exists in plus `x-default` (the
 * default locale when the page has it, else the first one it has), and the
 * locale's RSS feed. Every page sets it whole — Next replaces, not merges,
 * a parent's `alternates`. Paths are locale-less and resolve against
 * `metadataBase`.
 */
export function alternates(
  path: string,
  locale: Locale,
  available: readonly Locale[] = locales,
): NonNullable<Metadata["alternates"]> {
  const present = locales.filter((l) => available.includes(l));
  const fallback = present.includes(defaultLocale) ? defaultLocale : present[0];

  return {
    canonical: localePath(locale, path),
    languages: {
      ...Object.fromEntries(present.map((l) => [l, localePath(l, path)])),
      ...(fallback && { "x-default": localePath(fallback, path) }),
    },
    types: { "application/rss+xml": localePath(locale, "/feed.xml") },
  };
}
