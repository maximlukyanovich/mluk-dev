import { dictionaryFor } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";

import type { Post } from "./types";

/** A post's cover, also its Open Graph image (app/…/[slug]/cover.png). */
export function coverPath(locale: Locale, slug: string): string {
  return localePath(locale, `/writing/${slug}/cover.png`);
}

/** The cover's meta line, as the kit's OgCover: `2026-11-18 · 8 min · EN`. */
export function coverMeta(post: Post): string {
  const words = dictionaryFor(post.locale);
  return [
    post.date,
    words.article.readingTime.replace("{n}", String(post.readingTime)),
    words.locales[post.locale].short,
  ].join(" · ");
}
