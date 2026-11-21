"use client";

import { useEffect, useRef, type KeyboardEvent, type MouseEvent } from "react";

import { cn } from "@/shared/lib/cn";

import type { Heading } from "../lib/types";
import { animateHeight } from "./animate-height";
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
 * section; open, the list. The list opens and closes smoothly, as the kit's
 * `.mk-drop` — height and opacity over 200ms (owner, 2026-11-21); without
 * scripts the native `<details>` toggles at once. Picking a section closes
 * it and moves focus to the heading; Escape closes it back onto the
 * summary; it also closes when the window grows past 1440px, where it is
 * hidden.
 */
export function TocBar({ headings, title, className }: TocBarProps) {
  const active = useActiveHeading(headings.map((heading) => heading.id));
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const panel = useRef<HTMLElement>(null);
  // The latest open or close: a close that finishes after a newer open
  // must not shut the bar.
  const motion = useRef(0);
  const index = headings.findIndex((heading) => heading.id === active);

  useEffect(() => {
    const wide = window.matchMedia(wideQuery);
    const close = () => {
      if (wide.matches && details.current) details.current.open = false;
    };
    wide.addEventListener("change", close);
    return () => wide.removeEventListener("change", close);
  }, []);

  const setOpen = (open: boolean) => {
    const bar = details.current;
    const list = panel.current;
    if (!bar || !list) return;
    const turn = ++motion.current;
    if (open) {
      bar.open = true;
      animateHeight(list, 0, list.getBoundingClientRect().height, true);
      return;
    }
    const height = list.getBoundingClientRect().height;
    animateHeight(list, height, 0, true).then(() => {
      if (turn === motion.current) bar.open = false;
    });
  };

  const onToggleClick = (event: MouseEvent) => {
    event.preventDefault();
    setOpen(!details.current?.open);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !details.current?.open) return;
    setOpen(false);
    summary.current?.focus();
  };

  // The link still navigates to its anchor; focus follows without a second
  // scroll, so the next Tab continues from the section.
  const onPick = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.focus({ preventScroll: true });
  };

  return (
    <details
      ref={details}
      className={cn("mk-toc-bar mk-glass", className)}
      onKeyDown={onKeyDown}
    >
      <summary ref={summary} onClick={onToggleClick}>
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
      {/* The kit's preview takes the panel's 20px padding down to 0 6px here;
          flow-root keeps the list's margins inside, so the measured height
          is the one that moves. */}
      <nav
        ref={panel}
        className="mk-toc flow-root px-1.5 py-0"
        aria-label={title}
      >
        <TocList headings={headings} active={active} onPick={onPick} />
      </nav>
    </details>
  );
}
