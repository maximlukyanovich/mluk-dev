import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { testProject } from "../lib/test-projects";
import { ProjectBadge, ProjectRibbon } from "./project-ribbon";

const withCase = testProject(1, "personal", "site", {
  slug: "with-case",
  name: "With case",
  status: "live",
  cover: "/projects/with-case/cover.jpg",
  hasCase: true,
});
const withoutCase = testProject(2, "personal", "product", {
  slug: "without-case",
  name: "Without case",
});

vi.mock("../lib/content", () => ({
  getProject: (_locale: string, slug: string) =>
    [withCase, withoutCase].find((project) => project.slug === slug),
}));

const ribbon = (slugs: string[]) =>
  renderToStaticMarkup(
    <ProjectRibbon
      locale="en"
      slugs={slugs}
      label="Done this way"
      dictionary={dictionaryFor("en")}
    />,
  );
const badge = (slug: string) =>
  renderToStaticMarkup(<ProjectBadge locale="en" slug={slug} />);

const hrefs = (html: string) =>
  [...html.matchAll(/<a [^>]*href="([^"]*)"/g)].map((match) => match[1]);

describe("ProjectRibbon", () => {
  it("links a project to its case, and one without a case to Projects", () => {
    expect(hrefs(ribbon(["with-case", "without-case"]))).toEqual([
      "/en/projects/with-case",
      "/en/projects",
    ]);
  });

  it("shows the type and the status, the type alone without a status", () => {
    const html = ribbon(["with-case", "without-case"]);
    expect(html).toContain('<span class="mk-mini-meta">Website · Live</span>');
    expect(html).toContain('<span class="mk-mini-meta">Product</span>');
  });

  it("shows the cover only when the project has one", () => {
    expect(ribbon(["with-case"])).toMatch(/<img [^>]*alt=""/);
    expect(ribbon(["without-case"])).not.toContain("<img");
  });

  it("refuses an unknown project", () => {
    expect(() => ribbon(["nope"])).toThrow('Unknown project "nope"');
  });
});

describe("ProjectBadge", () => {
  it("links like the ribbon", () => {
    expect(hrefs(badge("with-case"))).toEqual(["/en/projects/with-case"]);
    expect(hrefs(badge("without-case"))).toEqual(["/en/projects"]);
  });

  it("refuses an unknown project", () => {
    expect(() => badge("nope")).toThrow('Unknown project "nope"');
  });
});
