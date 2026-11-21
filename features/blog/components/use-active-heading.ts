"use client";

import { useEffect, useState } from "react";

/**
 * The line a section heading crosses to become current: just below the
 * sticky table-of-contents bar, where an anchor jump puts it
 * (`scroll-margin-top: 88px` in the kit's Prose).
 */
const currentLine = 96;

/**
 * The id of the section being read: the last heading whose top has passed
 * `currentLine`, or null above the first one. One IntersectionObserver with
 * its root's top moved down to that line tells when a heading crosses it;
 * both tables of contents call this hook.
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

    // The observer reports every heading once when it starts, so the first
    // call also sets the section a reload or a deep link lands in.
    const observer = new IntersectionObserver(
      () => {
        let current: string | null = null;
        for (const heading of headings) {
          if (heading.getBoundingClientRect().top > currentLine) break;
          current = heading.id;
        }
        setActive(current);
      },
      { rootMargin: `-${currentLine}px 0px 0px 0px`, threshold: [0, 1] },
    );
    for (const heading of headings) observer.observe(heading);
    return () => observer.disconnect();
  }, [key]);

  return active;
}
