import Link from "next/link";

import { cn } from "@/shared/lib/cn";

export type PrevNextItem = {
  href: string;
  title: string;
  /** A mono line under the title, e.g. a project's number and type. */
  meta?: string;
};

type PrevNextProps = {
  /** The nav's accessible name. */
  label: string;
  previous?: PrevNextItem;
  next?: PrevNextItem;
  previousLabel: string;
  nextLabel: string;
  className?: string;
};

/**
 * The kit's PrevNext: the previous and the next page of a series. One
 * neighbour fills the row; with none there is no nav.
 */
export function PrevNext({
  label,
  previous,
  next,
  previousLabel,
  nextLabel,
  className,
}: PrevNextProps) {
  if (!previous && !next) return null;

  return (
    <nav className={cn("mk-pn", className)} aria-label={label}>
      {previous && (
        <Link className="mk-card mk-glass" href={previous.href} rel="prev">
          <span className="mk-pn-dir">
            <span aria-hidden="true">← </span>
            {previousLabel}
          </span>
          <span className="mk-pn-title">{previous.title}</span>
          {previous.meta && <Meta text={previous.meta} />}
        </Link>
      )}
      {next && (
        <Link
          className="mk-card mk-glass mk-pn-next"
          href={next.href}
          rel="next"
        >
          <span className="mk-pn-dir">
            {nextLabel}
            <span aria-hidden="true"> →</span>
          </span>
          <span className="mk-pn-title">{next.title}</span>
          {next.meta && <Meta text={next.meta} />}
        </Link>
      )}
    </nav>
  );
}

function Meta({ text }: { text: string }) {
  return <span className="mk-pn-meta">{text}</span>;
}
