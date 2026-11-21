import { describe, expect, it } from "vitest";

import { alternates } from "./alternates";

describe("alternates", () => {
  it("links every locale and points x-default at the default one", () => {
    expect(alternates("/cv", "ru")).toEqual({
      canonical: "/ru/cv",
      languages: { en: "/en/cv", ru: "/ru/cv", "x-default": "/en/cv" },
    });
  });

  it("links only the translations that exist", () => {
    expect(alternates("/writing/ru-only", "ru", ["ru"])).toEqual({
      canonical: "/ru/writing/ru-only",
      languages: {
        ru: "/ru/writing/ru-only",
        "x-default": "/ru/writing/ru-only",
      },
    });
  });

  it("maps the locale root without a trailing slash", () => {
    expect(alternates("/", "en").languages).toMatchObject({
      en: "/en",
      ru: "/ru",
    });
  });
});
