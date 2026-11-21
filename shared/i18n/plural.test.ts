import { describe, expect, it } from "vitest";

import { plural } from "./plural";

const en = { one: "{n} post", other: "{n} posts" };
const ru = {
  one: "{n} пост",
  few: "{n} поста",
  many: "{n} постов",
  other: "{n} поста",
};

describe("plural", () => {
  it("uses one and other in English", () => {
    expect(plural("en", 1, en)).toBe("1 post");
    expect(plural("en", 0, en)).toBe("0 posts");
    expect(plural("en", 24, en)).toBe("24 posts");
  });

  it.each([
    [1, "1 пост"],
    [21, "21 пост"],
    [2, "2 поста"],
    [24, "24 поста"],
    [5, "5 постов"],
    [11, "11 постов"],
    [0, "0 постов"],
  ])("uses one, few and many in Russian: %i", (count, text) => {
    expect(plural("ru", count, ru)).toBe(text);
  });

  it("falls back to other when a form is missing", () => {
    expect(plural("ru", 5, { other: "{n} шт." })).toBe("5 шт.");
  });
});
