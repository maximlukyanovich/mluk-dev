import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";

import { listPath } from "../lib/list";
import type { TagCount } from "../lib/types";
import { TagMenu, type TagLink } from "./tag-menu";

type TagFilterProps = {
  tags: readonly TagCount[];
  /** The tag of the page; none on Writing itself. */
  current?: string;
  locale: Locale;
  copy: Dictionary["writing"];
};

/**
 * The row above the list (canvas, Blog-B3): tag chips that link to the tag
 * pages, the current one selected, and the RSS feed on the right. On a phone
 * the chips give way to the kit's Filter, whose list opens under the row.
 */
export function TagFilter({ tags, current, locale, copy }: TagFilterProps) {
  const links: TagLink[] = [
    {
      href: localePath(locale, listPath()),
      label: copy.all,
      current: !current,
    },
    ...tags.map(({ tag, count }) => ({
      href: localePath(locale, listPath(tag)),
      tag,
      label: tag,
      count,
      current: tag === current,
    })),
  ];

  return (
    <div className="relative mt-10 mb-3 flex flex-wrap items-center justify-between gap-1 sm:mt-12 sm:mb-4 sm:gap-4">
      <nav className="mk-tags mk-filter-chips" aria-label={copy.tags}>
        {links.map((link) => (
          <Link
            key={link.href}
            className="mk-chip"
            href={link.href}
            aria-current={link.current ? "page" : undefined}
          >
            {link.tag && <span className="mk-hash">#</span>}
            {link.label}
          </Link>
        ))}
      </nav>
      {/* On a phone the nav's box gives way, so its list spans the whole row,
          the RSS link included (canvas, M-Blog), and lies over the posts. */}
      <TagMenu
        label={copy.tags}
        button={copy.tagButton}
        value={current ?? copy.all}
        links={links.map((link, index) =>
          index === 0 ? { ...link, label: copy.allPosts } : link,
        )}
        className="max-sm:contents"
      />
      {/* A route handler, not a page: a plain link. */}
      <a
        className="mk-link inline-flex items-center max-sm:min-h-11"
        href={localePath(locale, "/feed.xml")}
        type="application/rss+xml"
      >
        {copy.rssFeed}
      </a>
    </div>
  );
}
