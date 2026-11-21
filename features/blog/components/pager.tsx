import Link from "next/link";
import type { ReactNode } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import { plural } from "@/shared/i18n/plural";

import { listHref } from "../lib/list";
import { pageWindow } from "../lib/paginate";

type PagerProps = {
  page: number;
  pages: number;
  total: number;
  /** Locale-less path of the list's first page. */
  base: string;
  locale: Locale;
  copy: Dictionary["pager"];
};

type StepProps = {
  /** None at the end of the list: the button stays, `aria-disabled`. */
  href?: string;
  rel: "prev" | "next";
  children: ReactNode;
};

/**
 * Newer or Older. The arrow sits in one inline box with the word, so the
 * space between them is the kit's ("← Newer"), not the button's 8px gap.
 */
function Step({ href, rel, children }: StepProps) {
  const className = "mk-btn mk-btn-secondary mk-btn-sm";
  return href ? (
    <Link className={className} href={href} rel={rel}>
      <span>{children}</span>
    </Link>
  ) : (
    <a className={className} aria-disabled="true">
      <span>{children}</span>
    </a>
  );
}

/**
 * The kit's Pager: "Page 2 of 5 · 42 posts", the page numbers (first, the
 * current one ±1, last) and Newer / Older, the missing direction
 * `aria-disabled`. A list of one page has none. On a phone the kit keeps
 * one line: Newer, "Page 2 of 5", Older.
 */
export function Pager({ page, pages, total, base, locale, copy }: PagerProps) {
  if (pages < 2) return null;
  const href = (n: number) => listHref(locale, base, n);
  const info = copy.info
    .replace("{page}", String(page))
    .replace("{pages}", String(pages));

  return (
    <nav className="mk-pager mt-6" aria-label={copy.label}>
      <span className="mk-pager-info">
        {info}
        <span className="mk-pager-total">
          {" · "}
          {plural(locale, total, copy.total)}
        </span>
      </span>
      <span className="mk-pages">
        {pageWindow(page, pages).map((item, index) =>
          item === "gap" ? (
            <span key={`gap-${index}`} className="mk-pages-gap">
              …
            </span>
          ) : item === page ? (
            <span key={item} aria-current="page">
              {item}
            </span>
          ) : (
            <Link key={item} href={href(item)}>
              {item}
            </Link>
          ),
        )}
      </span>
      <span className="mk-pager-nav">
        <Step href={page > 1 ? href(page - 1) : undefined} rel="prev">
          <span aria-hidden="true">←</span> {copy.newer}
        </Step>
        <Step href={page < pages ? href(page + 1) : undefined} rel="next">
          {copy.older} <span aria-hidden="true">→</span>
        </Step>
      </span>
    </nav>
  );
}
