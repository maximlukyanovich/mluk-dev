"use client";

import {
  useEffect,
  useCallback,
  useLayoutEffect,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
} from "react";

import { cn } from "@/shared/lib/cn";

import type { Heading } from "../lib/types";
import { animateHeight, baseDuration, stopHeight } from "./animate-height";
import { sectionNumber, TocList } from "./toc-list";
import { useActiveHeading } from "./use-active-heading";

/** Where the side panel takes over (`wide` in theme.css). */
const wideQuery = "(min-width: 90rem)";

/**
 * Keeps the text under the bar where it is while the list grows or shrinks
 * by `from` → `to` px: a bottom margin of minus the list's height, moving in
 * step with `animateHeight` (same duration and easing).
 */
function overlay(bar: HTMLElement, from: number, to: number) {
  bar.style.marginBottom = to ? `${-to}px` : "";
  const duration = baseDuration();
  if (!duration || from === to) return;
  bar.animate([{ marginBottom: `${-from}px` }, { marginBottom: `${-to}px` }], {
    duration,
    easing: "ease",
  });
}

type TocBarProps = {
  headings: readonly Heading[];
  title: string;
  className?: string;
};

/**
 * The kit's Toc as a sticky bar, below 1440px: closed, it shows the current
 * section; open, the list. The list opens and closes smoothly, as the kit's
 * `.mk-drop` — height and opacity over 200ms (owner, 2026-11-21); without
 * scripts the native `<details>` toggles at once. Open, the bar lies over
 * the text instead of pushing it down (owner, 2026-11-21): a negative bottom
 * margin as tall as the list, moving with it. Picking a section closes it
 * and moves focus to the heading; Escape closes it back onto the summary;
 * so does a press outside it, and the window growing past 1440px, where it
 * is hidden.
 */
export function TocBar({ headings, title, className }: TocBarProps) {
  const active = useActiveHeading(headings.map((heading) => heading.id));
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const panel = useRef<HTMLElement>(null);
  // The latest open or close: a close that finishes after a newer open
  // must not shut the bar.
  const motion = useRef(0);
  // Where the bar is going. During a close `details.open` is still true
  // until the list has shrunk: a press then reopens the bar instead of
  // closing it twice.
  const opening = useRef(false);
  const index = headings.findIndex((heading) => heading.id === active);

  // Reads refs only: stable, so the effect below can hold it.
  const setOpen = useCallback((open: boolean) => {
    const bar = details.current;
    const list = panel.current;
    if (!bar || !list) return;
    const turn = ++motion.current;
    opening.current = open;
    // A move under way starts the next one from where it is.
    const start = bar.open ? stopHeight(list) : { height: 0, opacity: 0 };
    const from = start.height;
    const fade = { from: start.opacity };
    if (open) {
      bar.open = true;
      const height = list.getBoundingClientRect().height;
      overlay(bar, from, height);
      animateHeight(list, from, height, fade);
      return;
    }
    overlay(bar, from, 0);
    animateHeight(list, from, 0, fade).then(() => {
      if (turn === motion.current) bar.open = false;
    });
  }, []);

  // The browser may open the bar itself — find-in-page expands a
  // `<details>` holding a match, before the page's scripts run too: it is
  // then open as if pressed, lying over the text, so the next press, Escape
  // or a press outside closes it.
  const adoptOpen = useCallback(() => {
    const bar = details.current;
    const list = panel.current;
    if (!bar?.open || !list || opening.current) return;
    opening.current = true;
    const height = list.getBoundingClientRect().height;
    overlay(bar, height, height);
  }, []);

  // A page Next hides after a navigation (`<Activity>`) keeps its DOM: the
  // bar is closed at once, so coming back finds it closed.
  useLayoutEffect(() => {
    const bar = details.current;
    adoptOpen();
    return () => {
      opening.current = false;
      if (!bar) return;
      bar.open = false;
      bar.style.marginBottom = "";
    };
  }, [adoptOpen]);

  useEffect(() => {
    const wide = window.matchMedia(wideQuery);
    const close = () => {
      if (!wide.matches || !details.current) return;
      opening.current = false;
      details.current.open = false;
      details.current.style.marginBottom = "";
    };
    // The open bar covers the text: a press anywhere else closes it.
    const outside = (event: PointerEvent) => {
      const bar = details.current;
      if (opening.current && bar && !bar.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    wide.addEventListener("change", close);
    document.addEventListener("pointerdown", outside);
    return () => {
      wide.removeEventListener("change", close);
      document.removeEventListener("pointerdown", outside);
    };
  }, [setOpen]);

  const onToggleClick = (event: MouseEvent) => {
    event.preventDefault();
    setOpen(!opening.current);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !opening.current) return;
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
      onToggle={adoptOpen}
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
          is the one that moves. A list taller than the window scrolls inside
          the sticky bar, whose top sits 12px down (kit). */}
      <nav
        ref={panel}
        className="mk-toc flow-root max-h-[calc(100svh-6rem)] overflow-y-auto px-1.5 py-0"
        aria-label={title}
      >
        <TocList headings={headings} active={active} onPick={onPick} />
      </nav>
    </details>
  );
}
