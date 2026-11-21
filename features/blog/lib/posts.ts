import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import matter from "gray-matter";

import { hasLocale, locales, type Locale } from "@/shared/i18n/locales";

import { excerpt } from "./excerpt";
import { parseFrontmatter, tagPattern } from "./frontmatter";
import { headings } from "./headings";
import { parseBody } from "./markdown";
import { readingTime } from "./reading-time";
import type { Post, TagCount } from "./types";

/** `content/posts/<slug>/<locale>.mdx`, images beside them. */
export const postsDir = path.join(process.cwd(), "content", "posts");

/**
 * The starting point for a new post, copied to `content/posts/<slug>/`. It
 * is not a post, and it keeps the blog's `import()` of a post file
 * resolvable when no post exists: Turbopack fails the build on an import
 * template with no file to match.
 */
export const templateDir = path.join(postsDir, "_template");

/** Slugs that would shadow a route under `/writing/` (`page/2`, `tag/x`). */
export const reservedSlugs: readonly string[] = ["page", "tag"];

/** One post file as read from disk. */
export type PostSource = {
  slug: string;
  locale: Locale;
  file: string;
  source: string;
};

/**
 * Every post file under `dir`. A folder is a slug and must look like a tag
 * (`tagPattern`) and not be reserved; an `.mdx` in it is named after a
 * locale. Anything else in a folder (images) is left alone, and so is a
 * folder whose name starts with `_` (`_template`).
 */
export function readPostSources(dir: string): PostSource[] {
  if (!existsSync(dir)) return [];
  const sources: PostSource[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith("_")) continue;
    const slug = entry.name;
    const folder = path.join(dir, slug);
    if (!tagPattern.test(slug)) {
      throw new Error(
        `${folder}: a post folder is named with lowercase Latin letters, digits and hyphens`,
      );
    }
    if (reservedSlugs.includes(slug)) {
      throw new Error(
        `${folder}: \`${slug}\` is reserved for a /writing/ route`,
      );
    }
    for (const name of readdirSync(folder)) {
      if (!name.endsWith(".mdx")) continue;
      const file = path.join(folder, name);
      const locale = name.slice(0, -".mdx".length);
      if (!hasLocale(locale)) {
        throw new Error(
          `${file}: a post file is named after a locale (${locales.join(", ")})`,
        );
      }
      sources.push({ slug, locale, file, source: readFileSync(file, "utf8") });
    }
  }
  return sources;
}

/** Newest first; the same day falls back to the slug, so the order is stable. */
function byDate(a: Post, b: Post): number {
  return b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug);
}

/** Parses post files; a bad one throws with its path, and so does a duplicate. */
export function buildPosts(sources: readonly PostSource[]): Post[] {
  const seen = new Map<string, string>();
  const posts = sources.map(({ slug, locale, file, source }) => {
    const key = `${locale}/${slug}`;
    const first = seen.get(key);
    if (first) throw new Error(`${file}: duplicates ${first}`);
    seen.set(key, file);

    const { data, content } = matter(source);
    const meta = parseFrontmatter(data, file);
    let tree;
    try {
      tree = parseBody(content);
    } catch (error) {
      throw new Error(
        `${file}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    return {
      ...meta,
      slug,
      locale,
      excerpt: excerpt(tree),
      readingTime: readingTime(tree),
      headings: headings(tree),
    };
  });
  return posts.sort(byDate);
}

let cache: Post[] | undefined;

/**
 * Every post in every locale. Read once per build; `next dev` reads again on
 * each call so a new or edited post shows without a restart.
 */
function allPosts(): Post[] {
  if (!cache || process.env.NODE_ENV === "development") {
    cache = buildPosts(readPostSources(postsDir));
  }
  return cache;
}

/** A locale's posts, newest first. */
export function getPosts(locale: Locale): Post[] {
  return allPosts().filter((post) => post.locale === locale);
}

export function getPost(locale: Locale, slug: string): Post | undefined {
  return allPosts().find(
    (post) => post.locale === locale && post.slug === slug,
  );
}

/** The locales a post is written in, in the site's order. */
export function postLocales(slug: string): Locale[] {
  const present = new Set(
    allPosts().flatMap((post) => (post.slug === slug ? [post.locale] : [])),
  );
  return locales.filter((locale) => present.has(locale));
}

/** Tags of a list of posts: the most used first, then alphabetically. */
export function countTags(posts: readonly Post[]): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getTags(locale: Locale): TagCount[] {
  return countTags(getPosts(locale));
}
