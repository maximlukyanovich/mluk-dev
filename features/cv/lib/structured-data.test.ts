import { describe, expect, it } from "vitest";

import { personId } from "@/shared/lib/site";

import { getCv } from "./content";
import { personJsonLd, profilePageJsonLd } from "./structured-data";

describe("personJsonLd", () => {
  it("is the Person the home page had before", () => {
    expect(personJsonLd(getCv("ru").profile, "ru")).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://mluk.dev/#person",
      name: "Максим Лукьянович",
      jobTitle: "[Роль]",
      url: "https://mluk.dev/ru",
      sameAs: [
        "https://github.com/maximlukyanovich",
        "https://www.linkedin.com/in/mlukyanovich",
        "https://t.me/MaximLukyanovich",
      ],
    });
  });
});

describe("profilePageJsonLd", () => {
  const cv = { ...getCv("en"), updated: "2026-12-01" };
  const page = profilePageJsonLd(cv, "en");

  it("describes the CV page of the locale", () => {
    expect(page).toMatchObject({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      url: "https://mluk.dev/en/cv",
      inLanguage: "en",
      dateModified: "2026-12-01",
    });
  });

  it("is about the site's Person, by the same @id", () => {
    expect(page.mainEntity).toMatchObject({
      "@type": "Person",
      "@id": personId,
      name: "Maxim Lukyanovich",
    });
    expect(page.mainEntity).not.toHaveProperty("@context");
  });
});
