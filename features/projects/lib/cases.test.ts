import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  caseLocales,
  caseNeighbours,
  caseParams,
  generateCaseParams,
  getCase,
  noneParam,
} from "./cases";
import { getProjects } from "./content";
import { testProject } from "./test-projects";

vi.mock("./content", async (importOriginal) => {
  const original = await importOriginal<typeof import("./content")>();
  const getProjects = vi.fn();
  return {
    ...original,
    getProjects,
    getProject: (locale: "en" | "ru", slug: string) =>
      getProjects(locale).find(
        (project: { slug: string }) => project.slug === slug,
      ),
  };
});

/**
 * Six projects in content order, 03 and 05 featured; 01, 03, 04 and 05 have
 * a case. The projects page shows 03 05 01 02 04 06, so the cases go
 * 03 05 01 04.
 */
const projects = [
  testProject(1, "personal", "product", { hasCase: true }),
  testProject(2, "personal", "oss"),
  testProject(3, "commercial", "site", { featured: true, hasCase: true }),
  testProject(4, "commercial", "product", { hasCase: true }),
  testProject(5, "commercial", "site", { featured: true, hasCase: true }),
  testProject(6, "personal", "oss"),
];

const neighbours = (slug: string) => {
  const { previous, next } = caseNeighbours(projects, slug);
  return [previous?.number, next?.number];
};

describe("caseNeighbours", () => {
  it("takes the cases around it in the order of the projects page", () => {
    expect(neighbours("project-5")).toEqual([3, 1]);
    expect(neighbours("project-1")).toEqual([5, 4]);
  });

  it("gives the first no previous and the last no next", () => {
    expect(neighbours("project-3")).toEqual([undefined, 5]);
    expect(neighbours("project-4")).toEqual([1, undefined]);
  });

  it("skips a project without a case", () => {
    // 02 sits between 01 and 04 on the projects page.
    expect(neighbours("project-1")[1]).toBe(4);
  });

  it("gives a single case no neighbours", () => {
    expect(
      caseNeighbours(
        [
          testProject(1, "personal", "oss", { hasCase: true }),
          testProject(2, "personal", "oss"),
        ],
        "project-1",
      ),
    ).toEqual({ previous: undefined, next: undefined });
  });

  it("gives none to a project without a case", () => {
    expect(caseNeighbours(projects, "project-2")).toEqual({});
  });
});

describe("caseParams", () => {
  it("lists the slugs with a case", () => {
    expect(
      caseParams(projects)
        .map(({ slug }) => slug)
        .toSorted(),
    ).toEqual(["project-1", "project-3", "project-4", "project-5"]);
  });

  it("returns the placeholder when no project has a case", () => {
    expect(caseParams([testProject(1, "personal", "oss")])).toEqual([
      { slug: noneParam },
    ]);
    expect(caseParams([])).toEqual([{ slug: noneParam }]);
  });
});

describe("by locale", () => {
  beforeEach(() => {
    vi.mocked(getProjects).mockReset();
    vi.mocked(getProjects).mockImplementation((locale) =>
      locale === "en"
        ? projects
        : [testProject(1, "personal", "product", { hasCase: true })],
    );
  });

  it("generates the params of the locale it is given", () => {
    expect(generateCaseParams({ params: { lang: "ru" } })).toEqual([
      { slug: "project-1" },
    ]);
    expect(getProjects).toHaveBeenCalledWith("ru");
  });

  it("generates the placeholder for an unknown locale", () => {
    expect(generateCaseParams({ params: { lang: "de" } })).toEqual([
      { slug: noneParam },
    ]);
  });

  it("finds a case only where the project has one", () => {
    expect(getCase("en", "project-3")?.number).toBe(3);
    expect(getCase("en", "project-2")).toBeUndefined();
    expect(getCase("en", "unknown")).toBeUndefined();
    expect(getCase("ru", "project-3")).toBeUndefined();
  });

  it("lists the locales a case is written in", () => {
    expect(caseLocales("project-1")).toEqual(["en", "ru"]);
    expect(caseLocales("project-3")).toEqual(["en"]);
    expect(caseLocales("project-2")).toEqual([]);
  });
});
