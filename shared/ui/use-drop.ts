"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type RefObject } from "react";

/** The kit's phone breakpoint: the header menu and the filter list live below it. */
export const phoneQuery = "(max-width: 640px)";

/**
 * The open state of a panel that opens in place under its button (the
 * kit's `.mk-drop`: the header menu, a filter list). It is open on the path
 * it was opened on, so any navigation closes it without an effect. Escape
 * closes it and returns focus to the button; a window that stops matching
 * `query`, where the panel is hidden, closes it too. A panel that lies over
 * the page passes its `container`: a press outside it closes the panel.
 */
export function useDrop({
  query = phoneQuery,
  container,
}: {
  query?: string;
  container?: RefObject<HTMLElement | null>;
} = {}) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const media = window.matchMedia(query);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenOn(null);
      buttonRef.current?.focus();
    };
    const onChange = () => {
      if (!media.matches) setOpenOn(null);
    };
    const onPress = (event: PointerEvent) => {
      const box = container?.current;
      if (box && !box.contains(event.target as Node)) setOpenOn(null);
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
    toggle: () => setOpenOn(open ? null : pathname),
    close: () => setOpenOn(null),
  };
}
