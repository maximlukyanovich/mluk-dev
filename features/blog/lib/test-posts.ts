// Test helper: posts built in memory, without files.
import type { Locale } from "@/shared/i18n/locales";

import type { Post } from "./types";

export function testPost(
  slug: string,
  locale: Locale,
  tags: string[] = [],
  date = "2026-11-01",
): Post {
  return {
    slug,
    locale,
    title: slug,
    description: `About ${slug}.`,
    date,
    tags,
    excerpt: "",
    readingTime: 1,
    headings: [],
  };
}

/** `count` posts `p1…pN` in `locale`, each with `tags`. */
export function testPosts(
  count: number,
  locale: Locale,
  tags: string[] = [],
): Post[] {
  return Array.from({ length: count }, (_, i) =>
    testPost(`p${i + 1}`, locale, tags),
  );
}
