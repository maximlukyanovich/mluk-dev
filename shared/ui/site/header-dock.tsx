"use client";

import { usePathname } from "next/navigation";
import { useEffect, useEffectEvent, useRef, type ReactNode } from "react";

import { useMenuOpen } from "./header-menu";
import { headroom, headroomStart, startsJump } from "./headroom";

/**
 * A scroll the page makes itself — an in-page jump, or the scroll a new page
 * restores — is over at `scrollend`, where the browser has it. Safari has
 * none: there the page has to rest `moveRest` — a busy main thread can pause
 * a smooth scroll for longer, so `scrollend` comes first. One that has not
 * started `moveStart` after it was due — the target was in place — is over
 * too: a smooth scroll can start a few frames late.
 */
const moveRest = 150;
const moveStart = 500;

/** The gap between the docked header and what sticks under it. */
const offsetGap = 8;

/** Links that scroll within the page: the table of contents, footnotes, the skip link. */
const jumpLinks = 'a[href^="#"]';

/**
 * Tells the sticky parts of a page (the table of contents, a case's facts)
 * how far down the header reaches: `--header-offset` on <html>, the dock's
 * height and the gap while it is shown, 0 while hidden. Unset — no script —
 * they keep their own top. `--header-reach` is the same height and gap
 * whether shown or not: the room keyboard focus keeps above itself on the
 * way up, where the header comes back (web.css).
 */
function writeOffset(hidden: boolean, height: number) {
  const style = document.documentElement.style;
  style.setProperty(
    "--header-offset",
    hidden ? "0px" : `${height + offsetGap}px`,
  );
  style.setProperty("--header-reach", `${height + offsetGap}px`);
}

/**
 * The header's sticky dock: it hides while the page scrolls down and comes
 * back on a scroll up (owner, 2026-11-25), by the `headroom` rule. Pinned
 * while the menu is open or the keyboard focus is inside — a click on the
 * theme toggle does not pin it; hidden during an in-page jump, so the target
 * heading is not under it; shown on a change of page until the scroll it
 * restores is over, so a Back to the middle of a page does not hide it. The dock lives in the
 * layout, which Next keeps across navigations, so its listeners do too.
 * Without scripts the kit's `.mk-header-dock` is static, as the header was
 * before.
 */
export function HeaderDock({ children }: { children: ReactNode }) {
  const open = useMenuOpen();
  const pathname = usePathname();
  const dock = useRef<HTMLDivElement>(null);
  const live = useRef({
    state: headroomStart,
    focused: false,
    /** A scroll the page makes itself: an in-page jump, or a new page's. */
    moving: null as "jump" | "arrive" | null,
    /** The timer that ends `moving` without `scrollend`. */
    rest: 0,
    /** The dock's height. */
    height: 0,
    /** The header's bottom in the page flow. */
    zone: 0,
  });

  const apply = useEffectEvent((hidden: boolean) => {
    const el = dock.current;
    if (!el) return;
    el.toggleAttribute("data-hidden", hidden);
    writeOffset(hidden, live.current.height);
  });

  const step = useEffectEvent(() => {
    const now = live.current;
    const next = headroom(now.state, {
      y: window.scrollY,
      max: document.documentElement.scrollHeight - window.innerHeight,
      zone: now.zone,
      pinned: open || now.focused || now.moving === "arrive",
      jumping: now.moving === "jump",
    });
    if (next === now.state) return;
    const turned = next.hidden !== now.state.hidden;
    now.state = next;
    if (turned) apply(next.hidden);
  });

  // The last frame counts as part of the move: the turning point is where it
  // landed, so the header keeps its state until the reader scrolls.
  const endMove = useEffectEvent(() => {
    const now = live.current;
    window.clearTimeout(now.rest);
    if (!now.moving) return;
    step();
    now.moving = null;
  });

  const settle = useEffectEvent((wait: number) => {
    const now = live.current;
    window.clearTimeout(now.rest);
    now.rest = window.setTimeout(() => endMove(), wait);
  });

  const startMove = useEffectEvent((kind: "jump" | "arrive") => {
    live.current.moving = kind;
    settle(moveStart);
    step();
  });

  useEffect(() => {
    const el = dock.current;
    if (!el) return;
    const now = live.current;
    let frame = 0;
    const hasScrollEnd = "onscrollend" in window;

    const measure = () => {
      now.height = el.offsetHeight;
      // The dock is sticky, so its own top moves: the zone is measured from
      // the top of the box it sits in, which does not.
      const box = el.parentElement;
      const top = box
        ? box.getBoundingClientRect().top +
          window.scrollY +
          parseFloat(getComputedStyle(box).paddingTop)
        : 0;
      now.zone = top + now.height;
      writeOffset(now.state.hidden, now.height);
    };
    const onScroll = () => {
      if (now.moving) {
        if (hasScrollEnd) window.clearTimeout(now.rest);
        else settle(moveRest);
      }
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          step();
        });
      }
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (
        startsJump(event) &&
        target instanceof Element &&
        target.closest(jumpLinks)
      ) {
        startMove("jump");
      }
    };
    const onScrollEnd = () => endMove();
    // Back and Forward restore the scroll before Next renders the page, so
    // the new path comes too late: the history step itself starts the move.
    // A `#` link's own navigation fires one too, right after its click
    // (Chromium): that is the jump already under way, not a new page.
    const onPopState = () => {
      if (now.moving !== "jump") startMove("arrive");
    };
    // A click focuses a button without `:focus-visible`; only the keyboard
    // pins the header, so the theme toggle does not keep it on screen.
    const onFocusIn = (event: FocusEvent) => {
      now.focused =
        event.target instanceof Element &&
        event.target.matches(":focus-visible");
      step();
    };
    const onFocusOut = () => {
      now.focused = false;
      step();
    };

    // The menu panel changes the dock's height; the first call measures.
    const resize = new ResizeObserver(measure);
    resize.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scrollend", onScrollEnd);
    window.addEventListener("popstate", onPopState);
    document.addEventListener("click", onClick);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(now.rest);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scrollend", onScrollEnd);
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("click", onClick);
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      document.documentElement.style.removeProperty("--header-offset");
      document.documentElement.style.removeProperty("--header-reach");
    };
  }, []);

  // Opening the menu pins the header; closing it lets the page decide.
  useEffect(() => {
    step();
  }, [open]);

  // A new page shows the header, and keeps it while the page restores its
  // scroll: a Back to the middle of a page scrolls down — smoothly, by
  // web.css — without the reader.
  useEffect(() => {
    startMove("arrive");
  }, [pathname]);

  return (
    <div ref={dock} className="mk-header-dock">
      {children}
    </div>
  );
}
