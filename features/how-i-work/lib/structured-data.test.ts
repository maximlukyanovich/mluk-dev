import { describe, expect, it } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { howIWorkJsonLd } from "./structured-data";

describe("howIWorkJsonLd", () => {
  it("describes the page in its locale, about the site's Person", () => {
    const copy = dictionaryFor("ru").howIWork;
    expect(howIWorkJsonLd("ru", copy)).toEqual({
      "@context": "https://schema.org",
      "@type": "WebPage",
      url: "https://mluk.dev/ru/how-i-work",
      inLanguage: "ru",
      name: copy.title,
      description: copy.description,
      about: { "@id": "https://mluk.dev/#person" },
    });
  });
});
