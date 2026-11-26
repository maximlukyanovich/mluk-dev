import { describe, expect, it } from "vitest";

import {
  headroom,
  headroomStart,
  type HeadroomInput,
  type HeadroomState,
} from "./headroom";

const page = { max: 5000, zone: 80, pinned: false, jumping: false };

/** Scrolls through `ys` from `state`, as one scroll frame each. */
function scroll(
  ys: number[],
  state: HeadroomState = headroomStart,
  input: Partial<Omit<HeadroomInput, "y">> = {},
): HeadroomState {
  return ys.reduce((s, y) => headroom(s, { ...page, ...input, y }), state);
}

const hiddenAt = (y: number): HeadroomState => ({ hidden: true, anchorY: y });
const shownAt = (y: number): HeadroomState => ({ hidden: false, anchorY: y });

describe("headroom", () => {
  it("stays shown while the page is within the header's own height", () => {
    expect(scroll([10, 40, 80]).hidden).toBe(false);
  });

  it("hides once the page moves 8px down past the turning point", () => {
    expect(scroll([207], shownAt(200)).hidden).toBe(false);
    expect(scroll([208], shownAt(200)).hidden).toBe(true);
    // leaving the header's zone counts from its edge
    expect(scroll([60, 87]).hidden).toBe(false);
    expect(scroll([60, 88]).hidden).toBe(true);
  });

  it("shows again once the page moves 8px up from the lowest point", () => {
    expect(scroll([900, 894], hiddenAt(900)).hidden).toBe(true);
    expect(scroll([1200, 1192], hiddenAt(900)).hidden).toBe(false);
  });

  it("ignores a jitter under 8px either way", () => {
    expect(scroll([1003, 998, 1004, 997], shownAt(1000))).toEqual(shownAt(997));
    expect(scroll([997, 1002, 996, 1001], hiddenAt(1000))).toEqual(
      hiddenAt(1002),
    );
  });

  it("clamps the iOS bounce, so neither end of the page flickers", () => {
    // past the bottom and back: the rubber band is no scroll up
    expect(scroll([5000, 5060, 5000], hiddenAt(4990))).toEqual(hiddenAt(5000));
    // above the top: shown, as at the top itself
    expect(scroll([-40], hiddenAt(300))).toEqual(shownAt(80));
  });

  it("stays shown while pinned — the menu open or the focus inside", () => {
    expect(scroll([400, 900, 2000], shownAt(300), { pinned: true })).toEqual(
      shownAt(2000),
    );
    expect(scroll([900], hiddenAt(900), { pinned: true }).hidden).toBe(false);
  });

  it("hides during an in-page jump, whichever way it goes", () => {
    expect(scroll([2400], shownAt(300), { jumping: true }).hidden).toBe(true);
    expect(scroll([600], shownAt(2400), { jumping: true }).hidden).toBe(true);
    // landing in the header's zone still shows it
    expect(scroll([0], hiddenAt(2400), { jumping: true }).hidden).toBe(false);
  });

  it("after a jump, follows the direction from where it landed", () => {
    const landed = scroll([600], shownAt(2400), { jumping: true });
    expect(scroll([592], landed).hidden).toBe(false);
    expect(scroll([620], landed).hidden).toBe(true);
  });

  it("returns the same object when nothing changed", () => {
    const state = shownAt(1000);
    expect(headroom(state, { ...page, y: 1003 })).toBe(state);
  });
});
