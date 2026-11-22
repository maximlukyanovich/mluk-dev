"use client";

import { useEffect, useState } from "react";

/**
 * The line a section heading crosses to become current: just below the
 * sticky table-of-contents bar, where an anchor jump puts it
 * (`scroll-margin-top: 88px` in the kit's Prose).
 */
const currentLine = 96;

/** The id of the section being read, given the headings in page order. */
function currentSection(headings: readonly HTMLElement[]): string | null {
  const root = document.documentElement;
  // At the end of the page a short last section can never bring its heading
  // up to the line; there the last heading in view is the current one.
  const atEnd = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
  let current: string | null = null;
  for (const heading of headings) {
    const top = heading.getBoundingClientRect().top;
    if (top > currentLine && !(atEnd && top < window.innerHeight)) break;
    current = heading.id;
  }
  return current;
}

/**
 * The id of the section being read: the last heading whose top has passed
 * `currentLine`, or null above the first one; both tables of contents call
 * this hook. It follows every scroll and resize, at most once a frame (a
 * passive listener and `requestAnimationFrame`), rather than an
 * IntersectionObserver: that reports only when a heading crosses an edge, so
 * it cannot see the end of the page, and its first report waits for its own
 * delivery.
 */
export function useActiveHeading(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(" ");

  useEffect(() => {
    const headings = key
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((heading): heading is HTMLElement => heading !== null);
    if (!headings.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setActive(currentSection(headings));
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // The first frame sets the section a reload or a deep link lands in.
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [key]);

  return active;
}
