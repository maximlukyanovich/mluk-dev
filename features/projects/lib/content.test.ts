import { describe, expect, it } from "vitest";

import { jsonShape } from "@/shared/lib/json-shape";

import { getProjects, loadProjects, projectsContent } from "./content";
import type { ProjectSource } from "./types";

describe("the content", () => {
  it("has the same structure in en and ru", () => {
    expect(jsonShape(projectsContent.ru)).toEqual(
      jsonShape(projectsContent.en),
    );
  });

  it("agrees between en and ru on everything that is not language", () => {
    const fixed = (locale: "en" | "ru") =>
      getProjects(locale).map((project) => ({
        number: project.number,
        slug: project.slug,
        featured: project.featured,
        own: project.own,
        type: project.type,
        status: project.status,
        links: project.links,
        feat: project.feat && {
          href: project.feat.href,
          avatar: project.feat.avatar,
        },
      }));
    expect(fixed("ru")).toEqual(fixed("en"));
  });

  it("gives every project its own slug", () => {
    const slugs = getProjects("en").map((project) => project.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("loadProjects", () => {
  const source: ProjectSource = {
    slug: "a",
    name: "A",
    featured: false,
    own: "personal",
    type: "oss",
    status: null,
    stack: [],
    description: "About A.",
    year: "2026",
    role: "Developer",
    links: { live: null, code: null },
    feat: null,
  };

  it("numbers the projects by their position, from 1", () => {
    const projects = loadProjects([
      source,
      { ...source, slug: "b", status: "live" },
    ]);
    expect(projects.map(({ slug, number }) => [slug, number])).toEqual([
      ["a", 1],
      ["b", 2],
    ]);
    expect(projects[1].status).toBe("live");
  });

  it.each([
    [{ own: "freelance" }, /own of a "freelance"/],
    [{ type: "app" }, /type of a "app"/],
    [{ status: "archived" }, /status of a "archived"/],
  ])("refuses an unknown value: %o", (patch, message) => {
    expect(() => loadProjects([{ ...source, ...patch }])).toThrow(message);
  });
});
