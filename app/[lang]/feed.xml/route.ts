import { notFound } from "next/navigation";

import { buildRss, getPosts } from "@/features/blog";
import { dictionaryFor } from "@/shared/i18n/dictionaries";
import { hasLocale, locales } from "@/shared/i18n/locales";
import { siteUrl } from "@/shared/lib/site";

// A route handler: next/root-params throws here, so the locale comes from
// params, and the file lists its own locales. `/feed.xml` is the English
// feed through the afterFiles rewrite in next.config.ts.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** The locale's RSS feed: every post, newest first. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { feed } = dictionaryFor(lang);

  const xml = buildRss(
    { locale: lang, title: feed.title, description: feed.description },
    getPosts(lang),
    siteUrl,
  );
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
