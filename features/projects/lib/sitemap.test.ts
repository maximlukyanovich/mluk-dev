import { describe, expect, it } from "vitest";

import { projectsPages } from "./sitemap";
import { testProject } from "./test-projects";

describe("projectsPages", () => {
  it("lists the projects page in every locale, with no case", () => {
    expect(
      projectsPages({ en: [testProject(1, "personal", "oss")], ru: [] }),
    ).toEqual([
      { path: "/projects", versions: [{ locale: "en" }, { locale: "ru" }] },
    ]);
  });

  it("adds each case page in the locales that have it", () => {
    const withCase = (number: number) =>
      testProject(number, "personal", "oss", { hasCase: true });
    expect(
      projectsPages({
        en: [withCase(1), testProject(2, "personal", "oss"), withCase(3)],
        ru: [withCase(1), testProject(2, "personal", "oss")],
      }).slice(1),
    ).toEqual([
      {
        path: "/projects/project-1",
        versions: [{ locale: "en" }, { locale: "ru" }],
      },
      { path: "/projects/project-3", versions: [{ locale: "en" }] },
    ]);
  });
});
