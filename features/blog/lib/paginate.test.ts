import { describe, expect, it } from "vitest";

import {
  pageCount,
  pageItems,
  pageSize,
  pageWindow,
  parsePage,
} from "./paginate";

describe("pageCount and pageItems", () => {
  it("counts pages, an empty list being one page", () => {
    expect(pageCount(0)).toBe(1);
    expect(pageCount(pageSize)).toBe(1);
    expect(pageCount(pageSize + 1)).toBe(2);
    expect(pageCount(25)).toBe(3);
  });

  it("slices a page", () => {
    const items = Array.from({ length: 25 }, (_, i) => i + 1);
    expect(pageItems(items, 1)).toEqual(items.slice(0, 10));
    expect(pageItems(items, 3)).toEqual([21, 22, 23, 24, 25]);
  });
});

describe("parsePage", () => {
  it("accepts 2…N", () => {
    expect(parsePage("2", 3)).toBe(2);
    expect(parsePage("3", 3)).toBe(3);
  });

  it.each([
    ["1", "the first page lives at the list's own URL"],
    ["0", "zero"],
    ["02", "a leading zero"],
    ["2a", "not a number"],
    ["-2", "negative"],
    ["4", "past the last page"],
    ["", "empty"],
  ])("rejects %j: %s", (raw) => {
    expect(parsePage(raw, 3)).toBeNull();
  });
});

describe("pageWindow", () => {
  it("shows the ends, the current page and its neighbours", () => {
    expect(pageWindow(5, 10)).toEqual([1, "gap", 4, 5, 6, "gap", 10]);
  });

  it("near an end", () => {
    expect(pageWindow(1, 10)).toEqual([1, 2, "gap", 10]);
    expect(pageWindow(10, 10)).toEqual([1, "gap", 9, 10]);
  });

  it("never hides a single page behind a gap", () => {
    expect(pageWindow(4, 10)).toEqual([1, 2, 3, 4, 5, "gap", 10]);
    expect(pageWindow(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("is short for few pages", () => {
    expect(pageWindow(1, 1)).toEqual([1]);
    expect(pageWindow(2, 2)).toEqual([1, 2]);
  });
});
