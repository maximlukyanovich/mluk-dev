/**
 * Whether the sticky header is hidden, from the scroll position and what pins
 * it. One pure step per scroll frame or event, so every rule lives here and
 * "the menu is open but the header is hidden" cannot be expressed.
 */
export type HeadroomState = {
  hidden: boolean;
  /**
   * The turning point: the lowest `y` while shown, the highest while hidden.
   * The header changes only once the page moves `headroomStep` past it.
   */
  anchorY: number;
};

export type HeadroomInput = {
  /** `window.scrollY`; iOS reports it beyond `[0, max]` while it bounces. */
  y: number;
  /** The largest scroll position: the page's height less the window's. */
  max: number;
  /** The header's bottom in the page flow: above it the header is always shown. */
  zone: number;
  /** The menu is open or the focus is inside the header. */
  pinned: boolean;
  /** An in-page jump (a table of contents or footnote link) is under way. */
  jumping: boolean;
};

/** How far the page moves against the turning point before the header follows. */
export const headroomStep = 8;

export const headroomStart: HeadroomState = { hidden: false, anchorY: 0 };

export function headroom(
  state: HeadroomState,
  { y: rawY, max, zone, pinned, jumping }: HeadroomInput,
): HeadroomState {
  const y = Math.min(Math.max(rawY, 0), Math.max(max, 0));

  // Within the header's zone the turning point is the zone's edge: the
  // header leaves 8px after its own height has scrolled away.
  if (y <= zone) return next(state, false, zone);
  if (pinned) return next(state, false, y);
  if (jumping) return next(state, true, y);

  if (state.hidden) {
    if (y > state.anchorY) return next(state, true, y);
    return state.anchorY - y >= headroomStep ? next(state, false, y) : state;
  }
  if (y < state.anchorY) return next(state, false, y);
  return y - state.anchorY >= headroomStep ? next(state, true, y) : state;
}

/** The same object when nothing changed, so a state setter skips the render. */
function next(
  state: HeadroomState,
  hidden: boolean,
  anchorY: number,
): HeadroomState {
  return state.hidden === hidden && state.anchorY === anchorY
    ? state
    : { hidden, anchorY };
}
