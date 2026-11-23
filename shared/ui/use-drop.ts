"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

/** The kit's phone breakpoint: the header menu and the filter list live below it. */
export const phoneQuery = "(max-width: 640px)";

/**
 * The open state of a panel that opens in place under its button (the
 * kit's `.mk-drop`: the header menu, a filter list). Any navigation closes
 * it, and coming back finds it closed: a change of path closes it during
 * render — the header lives in the layout, which stays — and so does the
 * page being hidden, which Next does instead of unmounting it (`<Activity>`;
 * node_modules/next/dist/docs/01-app/02-guides/preserving-ui-state.md). A
 * link to the page already shown changes no path: the panel's links call
 * `close`. Escape closes it and returns focus to the button; a window that
 * stops matching `query`, where the panel is hidden, closes it too. A panel
 * that lies over the page passes its `container`: a press outside it closes
 * the panel. A row that chooses in place, with no navigation, calls
 * `closeToButton`, so focus does not stay in the hidden panel.
 */
export function useDrop({
  query = phoneQuery,
  container,
}: {
  query?: string;
  container?: RefObject<HTMLElement | null>;
} = {}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [shownOn, setShownOn] = useState(pathname);
  if (shownOn !== pathname) {
    setShownOn(pathname);
    setOpen(false);
  }
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeToButton = () => {
    setOpen(false);
    buttonRef.current?.focus();
  };

  // Runs when the page is hidden, before the browser paints it.
  useLayoutEffect(() => () => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia(query);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeToButton();
    };
    const onChange = () => {
      if (!media.matches) setOpen(false);
    };
    const onPress = (event: PointerEvent) => {
      const box = container?.current;
      if (box && !box.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPress);
    media.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPress);
      media.removeEventListener("change", onChange);
    };
  }, [open, query, container]);

  return {
    open,
    buttonRef,
    toggle: () => setOpen(!open),
    close: () => setOpen(false),
    closeToButton,
  };
}
