/**
 * The kit's `duration-base` (200ms) in milliseconds, or 0 under reduced
 * motion: a block that opens or closes in place moves for that long, as the
 * kit's `.mk-drop` does.
 */
export function baseDuration(): number {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return 0;
  // The browser may hand the token back normalised: `200ms` reads `.2s`.
  const token = getComputedStyle(document.documentElement)
    .getPropertyValue("--duration-base")
    .trim();
  const value = Number.parseFloat(token);
  if (!value) return 200;
  return token.endsWith("ms") ? value : value * 1000;
}

/** Where a move starts: the height and the opacity an element shows. */
export type Shown = { height: number; opacity: number };

/**
 * The height and opacity an element shows now, a move under way included,
 * and that move stopped: the start of the next one. Read after the stop, the
 * element would show its end state instead — a toggle within the 200ms would
 * run to the wrong end, then snap, or fade in again from nothing.
 */
export function stopHeight(element: HTMLElement): Shown {
  const height = element.getBoundingClientRect().height;
  const opacity = Number(getComputedStyle(element).opacity);
  for (const running of element.getAnimations()) running.cancel();
  return { height, opacity };
}

/**
 * Moves an element from one height to another — the FLIP way: the caller
 * takes the start with `stopHeight`, puts the block in its final state,
 * measures the end and calls this, so the layout is already right and only
 * the picture travels.
 * Content is clipped while it moves; `fade` also takes opacity along, from
 * the opacity it gives to 1 when opening, to 0 when closing. Resolves when
 * the move ends,
 * at once under reduced motion; a newer animation on the element cancels
 * this one, which then resolves too.
 */
export function animateHeight(
  element: HTMLElement,
  from: number,
  to: number,
  fade?: { from: number },
): Promise<void> {
  const duration = baseDuration();
  if (!duration || from === to) return Promise.resolve();

  for (const running of element.getAnimations()) running.cancel();
  // Heights are measured with getBoundingClientRect, padding included.
  const frame = (height: number, opacity: number) => ({
    boxSizing: "border-box",
    height: `${height}px`,
    maxHeight: "none",
    overflow: "hidden",
    ...(fade && { opacity }),
  });
  const opening = to > from;
  const animation = element.animate(
    [frame(from, fade?.from ?? 1), frame(to, opening ? 1 : 0)],
    { duration, easing: "ease" },
  );
  return animation.finished.then(
    () => undefined,
    () => undefined,
  );
}
