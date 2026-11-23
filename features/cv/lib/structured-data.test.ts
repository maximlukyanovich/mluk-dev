import { describe, expect, it } from "vitest";

import { personId } from "@/shared/lib/site";

import { getCv } from "./content";
import { personJsonLd, profilePageJsonLd } from "./structured-data";
import type { CvContent } from "./types";

// The real data gives the shape; the name and role a test asserts are set here.
const withPerson = (cv: CvContent): CvContent => ({
  ...cv,
  profile: {
    ...cv.profile,
    name: { first: "Ада", last: "Лавлейс" },
    role: "Инженер",
  },
});

describe("personJsonLd", () => {
  it("is the Person the home page had before", () => {
    expect(personJsonLd(withPerson(getCv("ru")).profile, "ru")).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": "https://mluk.dev/#person",
      name: "Ада Лавлейс",
      jobTitle: "Инженер",
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
  const cv = { ...withPerson(getCv("en")), updated: "2026-12-01" };
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
      name: "Ада Лавлейс",
    });
    expect(page.mainEntity).not.toHaveProperty("@context");
  });
});
