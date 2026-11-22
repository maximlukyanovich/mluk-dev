import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";

import { getPosts } from "../lib/posts";
import { PostList } from "./post-list";

/** Rows the home page shows (canvas, Main and M-Home). */
const recentCount = 4;

type RecentPostsProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Writing on the home page (canvas, Main and M-Home): the section title with
 * the feed and "All posts →", then the newest posts with the top one's
 * excerpt. A locale with no posts has no section.
 */
export function RecentPosts({ locale, dictionary }: RecentPostsProps) {
  const posts = getPosts(locale).slice(0, recentCount);
  if (!posts.length) return null;
  const words = dictionary.writing;

  return (
    <section className="pt-9 sm:pt-14" aria-labelledby="writing-h">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-display-section" id="writing-h">
          {words.title}
        </h2>
        <span className="flex flex-wrap gap-x-5 gap-y-2">
          <a
            className="mk-link"
            href={localePath(locale, "/feed.xml")}
            type="application/rss+xml"
          >
            {dictionary.site.footer.rss}
          </a>
          <Link className="mk-link" href={localePath(locale, "/writing")}>
            {words.allPosts} <span aria-hidden="true">→</span>
          </Link>
        </span>
      </div>
      <PostList
        posts={posts}
        locale={locale}
        copy={dictionary.article}
        excerptFirst
      />
    </section>
  );
}
