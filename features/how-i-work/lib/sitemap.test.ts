import { describe, expect, it } from "vitest";

import { getHowIWorkPages } from "./sitemap";

describe("getHowIWorkPages", () => {
  it("lists the page in every locale, undated", () => {
    expect(getHowIWorkPages()).toEqual([
      { path: "/how-i-work", versions: [{ locale: "en" }, { locale: "ru" }] },
    ]);
  });
});
