import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { ogSize } from "@/shared/ui/og-cover";

import { coverPath } from "../lib/cover";
import type { Post } from "../lib/types";

type LatestCardProps = {
  post: Post;
  locale: Locale;
  copy: Dictionary["article"] & Dictionary["writing"];
};

/**
 * The newest post, large, on the first page of Writing (canvas, Blog-B3):
 * a glass card that is one link — the post's cover (its Open Graph
 * picture, the same file) beside the "Latest" meta row, the title, a
 * four-line excerpt, the tags as spans and "Read the post →". On a phone
 * the picture goes on top.
 */
export function LatestCard({ post, locale, copy }: LatestCardProps) {
  const readingTime = copy.readingTime.replace("{n}", String(post.readingTime));

  return (
    <Link
      href={localePath(locale, `/writing/${post.slug}`)}
      className="mk-card mk-glass mt-7 gap-3.5 p-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-7 sm:p-3.5"
    >
      {/* The first screen's image on Writing: eager. The picture carries the
          title, which the card repeats as text: decorative here. */}
      <Image
        src={coverPath(locale, post.slug)}
        alt=""
        width={ogSize.width}
        height={ogSize.height}
        sizes="(min-width: 1200px) 600px, (min-width: 640px) 50vw, 100vw"
        loading="eager"
        fetchPriority="high"
        className="box-border block h-auto w-full min-w-0 rounded-media border border-line sm:flex-[1_1_460px] sm:self-center"
      />
      <span className="flex min-w-0 flex-[1_1_340px] flex-col justify-center gap-3.5 px-1.5 pt-1 pb-2 sm:py-3.5 sm:pr-3.5 sm:pl-0">
        <span className="mk-card-meta p-0">
          <span className="mk-card-no">{copy.latest}</span>
          <span>
            <time dateTime={post.date}>{post.date}</time> · {readingTime}
          </span>
        </span>
        <h2 className="font-display text-display-latest">{post.title}</h2>
        {post.excerpt && (
          <span className="line-clamp-4 whitespace-pre-line text-muted">
            {post.excerpt}
          </span>
        )}
        {post.tags.length > 0 && (
          <span className="mk-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="mk-tag">
                <span className="mk-hash">#</span>
                {tag}
              </span>
            ))}
          </span>
        )}
        <span className="font-bold text-peri">
          {copy.readPost} <span aria-hidden="true">→</span>
        </span>
      </span>
    </Link>
  );
}
