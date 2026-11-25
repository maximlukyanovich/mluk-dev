import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { locales } from "@/shared/i18n/locales";
import { jsonShape } from "@/shared/lib/json-shape";

import {
  caseFile,
  casesDir,
  caseTemplateDir,
  getProjects,
  loadProjects,
  projectsContent,
} from "./content";
import type { ProjectSource } from "./types";

const publicDir = path.join(process.cwd(), "public");

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
        cover: project.cover,
        links: project.links,
        hasCase: project.hasCase,
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

  it("keeps each cover in public/projects/<slug>/, and the file exists", () => {
    for (const locale of locales) {
      for (const { slug, cover } of getProjects(locale)) {
        if (cover === null) continue;
        expect(cover).toMatch(new RegExp(`^/projects/${slug}/[^/]+$`));
        expect(existsSync(path.join(publicDir, cover)), cover).toBe(true);
      }
    }
  });
});

describe("the cases", () => {
  /** The case folders: every folder but `_template` and an editor's own. */
  const folders = readdirSync(casesDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !/^[_.]/.test(entry.name))
    .map((entry) => entry.name);

  it("are found by the loader, in every locale", () => {
    for (const locale of locales) {
      expect(
        getProjects(locale)
          .filter((project) => project.hasCase)
          .map((project) => project.slug)
          .toSorted(),
      ).toEqual(folders.toSorted());
    }
  });

  it("each name a project of the content", () => {
    const slugs = getProjects("en").map((project) => project.slug);
    for (const folder of folders) expect(slugs).toContain(folder);
  });

  it("are written in every locale or in none", () => {
    for (const folder of folders) {
      for (const locale of locales) {
        expect(
          existsSync(caseFile(folder, locale)),
          `${folder}/${locale}`,
        ).toBe(true);
      }
    }
  });

  it("do not count the template, which has every locale", () => {
    expect(folders).not.toContain("_template");
    for (const locale of locales) {
      expect(existsSync(path.join(caseTemplateDir, `${locale}.mdx`))).toBe(
        true,
      );
    }
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
    team: null,
    cover: null,
    links: { live: null, code: null },
    feat: null,
  };
  const noCase = () => false;

  it("numbers the projects by their position, from 1", () => {
    const projects = loadProjects(
      [source, { ...source, slug: "b", status: "live" }],
      noCase,
    );
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
    expect(() => loadProjects([{ ...source, ...patch }], noCase)).toThrow(
      message,
    );
  });

  it("keeps the team and the cover as written", () => {
    const [project] = loadProjects(
      [{ ...source, team: "3 people", cover: "/projects/a/cover.jpg" }],
      noCase,
    );
    expect(project.team).toBe("3 people");
    expect(project.cover).toBe("/projects/a/cover.jpg");
  });

  it("asks for each slug whether it has a case", () => {
    const asked: string[] = [];
    const projects = loadProjects(
      [source, { ...source, slug: "b" }],
      (slug) => {
        asked.push(slug);
        return slug === "b";
      },
    );
    expect(asked).toEqual(["a", "b"]);
    expect(projects.map((project) => project.hasCase)).toEqual([false, true]);
  });
});
