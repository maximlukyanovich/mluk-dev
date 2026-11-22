import Link from "next/link";

import { localePath, type Locale } from "@/shared/i18n/locales";
import { cn } from "@/shared/lib/cn";

type PostTagsProps = {
  tags: readonly string[];
  locale: Locale;
  label: string;
  className?: string;
};

/** The post's tags, each a link to its tag page (kit Tag, `.mk-tag` as a link). */
export function PostTags({ tags, locale, label, className }: PostTagsProps) {
  if (!tags.length) return null;
  return (
    <nav className={cn("mk-tags", className)} aria-label={label}>
      {tags.map((tag) => (
        <Link
          key={tag}
          className="mk-tag"
          href={localePath(locale, `/writing/tag/${tag}`)}
        >
          <span className="mk-hash">#</span>
          {tag}
        </Link>
      ))}
    </nav>
  );
}
