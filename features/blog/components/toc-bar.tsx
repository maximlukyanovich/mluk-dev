"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";

import { cn } from "@/shared/lib/cn";

import type { Heading } from "../lib/types";
import { sectionNumber, TocList } from "./toc-list";
import { useActiveHeading } from "./use-active-heading";

/** Where the side panel takes over (`wide` in theme.css). */
const wideQuery = "(min-width: 90rem)";

type TocBarProps = {
  headings: readonly Heading[];
  title: string;
  className?: string;
};

/**
 * The kit's Toc as a sticky bar, below 1440px: closed, it shows the current
 * section; open, the list. Picking a section closes it and moves focus to
 * the heading; Escape closes it back onto the summary; it also closes when
 * the window grows past 1440px, where it is hidden.
 */
export function TocBar({ headings, title, className }: TocBarProps) {
  const active = useActiveHeading(headings.map((heading) => heading.id));
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const index = headings.findIndex((heading) => heading.id === active);

  useEffect(() => {
    const wide = window.matchMedia(wideQuery);
    const close = () => {
      if (wide.matches && details.current) details.current.open = false;
    };
    wide.addEventListener("change", close);
    return () => wide.removeEventListener("change", close);
  }, []);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !details.current?.open) return;
    details.current.open = false;
    summary.current?.focus();
  };

  // The link still navigates to its anchor; focus follows without a second
  // scroll, so the next Tab continues from the section.
  const onPick = (id: string) => {
    if (details.current) details.current.open = false;
    document.getElementById(id)?.focus({ preventScroll: true });
  };

  return (
    <details
      ref={details}
      className={cn("mk-toc-bar mk-glass", className)}
      onKeyDown={onKeyDown}
    >
      <summary ref={summary}>
        <span className="mk-toc-current">
          {index >= 0 && (
            <>
              <span className="mk-card-no">{sectionNumber(index)}</span>
              <span>{headings[index].text}</span>
            </>
          )}
        </span>
        <span className="mk-toc-count">
          {title} · {headings.length}
          <span className="mk-chev" aria-hidden="true">
            ▾
          </span>
        </span>
      </summary>
      {/* The kit's preview takes the panel's 20px padding down to 0 6px here. */}
      <nav className="mk-toc px-1.5 py-0" aria-label={title}>
        <TocList headings={headings} active={active} onPick={onPick} />
      </nav>
    </details>
  );
}
