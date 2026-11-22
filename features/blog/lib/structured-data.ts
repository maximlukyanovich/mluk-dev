import { localePath, type Locale } from "@/shared/i18n/locales";
import { personId, siteUrl } from "@/shared/lib/site";

import { coverPath } from "./cover";
import type { Post } from "./types";

/**
 * A post as a schema.org BlogPosting. The author is the site's Person, by the
 * same `@id` as on the home page; their name comes from the page, which
 * reads the CV.
 */
export function postJsonLd(post: Post, locale: Locale, authorName: string) {
  const url = siteUrl + localePath(locale, `/writing/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: {
      "@type": "Person",
      "@id": personId,
      name: authorName,
      url: siteUrl + localePath(locale, "/"),
    },
    image: siteUrl + coverPath(locale, post.slug),
    inLanguage: locale,
    url,
    mainEntityOfPage: url,
    keywords: post.tags,
  };
}
