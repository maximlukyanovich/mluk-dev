import { localePath, type Locale } from "@/shared/i18n/locales";

import type { Post } from "./types";

export type FeedChannel = {
  locale: Locale;
  title: string;
  description: string;
};

const entities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escape(text: string): string {
  return text.replace(/[&<>"']/g, (char) => entities[char]);
}

/** RFC 822, as RSS wants it: a `YYYY-MM-DD` date at midnight UTC. */
export function rfc822(date: string): string {
  return new Date(`${date}T00:00:00Z`).toUTCString();
}

const newest = (a: Post, b: Post) =>
  b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);

/**
 * A locale's RSS 2.0 feed: the channel links to that locale's blog and to
 * itself (`atom:link rel="self"`); each post gives its title, absolute link
 * as the guid, publication date, the frontmatter description and its tags
 * as categories — no full text. A channel without posts is still valid.
 */
export function buildRss(
  channel: FeedChannel,
  posts: readonly Post[],
  origin: string,
): string {
  const absolute = (path: string) => origin + localePath(channel.locale, path);
  const sorted = [...posts].sort(newest);
  const lastBuild = sorted
    .map((post) => post.updated ?? post.date)
    .sort()
    .at(-1);

  const items = sorted.map((post) => {
    const link = escape(absolute(`/writing/${post.slug}`));
    return [
      "    <item>",
      `      <title>${escape(post.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      `      <pubDate>${rfc822(post.date)}</pubDate>`,
      `      <description>${escape(post.description)}</description>`,
      ...post.tags.map((tag) => `      <category>${escape(tag)}</category>`),
      "    </item>",
    ].join("\n");
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escape(channel.title)}</title>`,
    `    <link>${escape(absolute("/writing"))}</link>`,
    `    <description>${escape(channel.description)}</description>`,
    `    <language>${channel.locale}</language>`,
    `    <atom:link href="${escape(absolute("/feed.xml"))}" rel="self" type="application/rss+xml"/>`,
    ...(lastBuild
      ? [`    <lastBuildDate>${rfc822(lastBuild)}</lastBuildDate>`]
      : []),
    ...items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");
}
