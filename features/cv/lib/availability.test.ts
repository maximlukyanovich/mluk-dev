import { describe, expect, it } from "vitest";

import { availability } from "./availability";

const words = { openToWork: "Open to work" };

describe("availability", () => {
  it("puts the status before the city while open to work", () => {
    expect(availability({ openToWork: true, city: "Minsk" }, words)).toBe(
      "Open to work · Minsk",
    );
  });

  it("shows the city alone otherwise", () => {
    expect(availability({ openToWork: false, city: "Minsk" }, words)).toBe(
      "Minsk",
    );
  });
});
