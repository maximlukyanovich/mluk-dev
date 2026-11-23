import { describe, expect, it } from "vitest";

import { cvContent } from "./content";
import { getCvPages } from "./sitemap";

describe("getCvPages", () => {
  it("lists /cv in every locale, dated by its own update", () => {
    expect(getCvPages()).toEqual([
      {
        path: "/cv",
        versions: [
          { locale: "en", lastModified: cvContent.en.updated },
          { locale: "ru", lastModified: cvContent.ru.updated },
        ],
      },
    ]);
  });
});
