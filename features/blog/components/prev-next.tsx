import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";

import type { Post } from "../lib/types";

type PrevNextProps = {
  previous?: Post;
  next?: Post;
  locale: Locale;
  copy: Dictionary["article"];
};

/**
 * The kit's PrevNext: the older and the newer post in the same locale. One
 * neighbour fills the row; with none there is no nav.
 */
export function PrevNext({ previous, next, locale, copy }: PrevNextProps) {
  if (!previous && !next) return null;
  const href = (post: Post) => localePath(locale, `/writing/${post.slug}`);

  return (
    <nav className="mk-pn" aria-label={copy.morePosts}>
      {previous && (
        <Link className="mk-card mk-glass" href={href(previous)} rel="prev">
          <span className="mk-pn-dir">
            <span aria-hidden="true">← </span>
            {copy.previous}
          </span>
          <span className="mk-pn-title">{previous.title}</span>
        </Link>
      )}
      {next && (
        <Link
          className="mk-card mk-glass mk-pn-next"
          href={href(next)}
          rel="next"
        >
          <span className="mk-pn-dir">
            {copy.next}
            <span aria-hidden="true"> →</span>
          </span>
          <span className="mk-pn-title">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
