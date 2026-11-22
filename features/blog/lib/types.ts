import type { Locale } from "@/shared/i18n/locales";

/** A post's frontmatter, checked (`frontmatter.ts`). Dates are `YYYY-MM-DD`. */
export type PostMeta = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  tags: string[];
};

/** A section of a post: an h2 with the id `rehype-slug` gives it. */
export type Heading = { id: string; text: string };

/** One locale's version of a post, with what is computed from its text. */
export type Post = PostMeta & {
  slug: string;
  locale: Locale;
  /** Plain text of the opening paragraphs, one paragraph per line. */
  excerpt: string;
  /** Minutes, at least 1. */
  readingTime: number;
  headings: Heading[];
};

/** A tag with the number of posts that carry it in one locale. */
export type TagCount = { tag: string; count: number };
