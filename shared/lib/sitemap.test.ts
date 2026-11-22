import { describe, expect, it } from "vitest";

import { sitemapEntries } from "./sitemap";

const origin = "https://mluk.dev";

describe("sitemapEntries", () => {
  it("lists every version with all of them and x-default as alternates", () => {
    const entries = sitemapEntries(
      [{ path: "/", versions: [{ locale: "ru" }, { locale: "en" }] }],
      origin,
    );
    const languages = {
      en: "https://mluk.dev/en",
      ru: "https://mluk.dev/ru",
      "x-default": "https://mluk.dev/en",
    };
    expect(entries).toEqual([
      { url: "https://mluk.dev/en", alternates: { languages } },
      { url: "https://mluk.dev/ru", alternates: { languages } },
    ]);
  });

  it("offers only the translations that exist, x-default among them", () => {
    const [entry, ...rest] = sitemapEntries(
      [
        {
          path: "/writing/ru-only",
          versions: [{ locale: "ru", lastModified: "2026-11-20" }],
        },
      ],
      origin,
    );
    expect(rest).toEqual([]);
    expect(entry).toEqual({
      url: "https://mluk.dev/ru/writing/ru-only",
      lastModified: "2026-11-20",
      alternates: {
        languages: {
          ru: "https://mluk.dev/ru/writing/ru-only",
          "x-default": "https://mluk.dev/ru/writing/ru-only",
        },
      },
    });
  });
});
