import Link from "next/link";
import type { CSSProperties } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { cn } from "@/shared/lib/cn";

import type { Post } from "../lib/types";

type PostListProps = {
  posts: readonly Post[];
  locale: Locale;
  copy: Dictionary["article"];
  /** The home page shows the top post's excerpt (kit PostList). */
  excerptFirst?: boolean;
  className?: string;
};

/**
 * The kit's PostList: one glass panel, a row per post — date, title, its
 * first tag (a span: the row is the link), read time and the lime arrow.
 * The rows rise in the kit's stagger (`.mk-reveal`), so a list that comes
 * with a new page or tag rises again.
 */
export function PostList({
  posts,
  locale,
  copy,
  excerptFirst = false,
  className,
}: PostListProps) {
  if (!posts.length) return null;
  return (
    <ol className={cn("mk-postlist mk-glass mk-reveal is-a", className)}>
      {posts.map((post, index) => (
        // The stagger index is per row: no utility can carry it.
        <li key={post.slug} style={{ "--i": index } as CSSProperties}>
          <Link
            className="mk-post"
            href={localePath(locale, `/writing/${post.slug}`)}
          >
            <time className="mk-post-date" dateTime={post.date}>
              {post.date}
            </time>
            <span className="mk-post-title">{post.title}</span>
            {post.tags[0] && (
              <span className="mk-tag">
                <span className="mk-hash">#</span>
                {post.tags[0]}
              </span>
            )}
            <span className="mk-post-read">
              {copy.readingTime.replace("{n}", String(post.readingTime))}
            </span>
            <span className="mk-post-go" aria-hidden="true">
              →
            </span>
            {excerptFirst && index === 0 && post.excerpt && (
              <span className="mk-post-excerpt">{post.excerpt}</span>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
