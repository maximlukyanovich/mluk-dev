import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import en from "@/shared/i18n/dictionaries/en.json";

import { testProject } from "../lib/test-projects";
import type { Project } from "../lib/types";
import { ProjectCard } from "./project-card";

const copy = { ...en.projects, newTab: en.site.newTab };

const render = (
  project: Project,
  href: string | null,
  variant: "grid" | "row" = "grid",
  eager?: boolean,
) =>
  renderToStaticMarkup(
    <ProjectCard
      project={project}
      variant={variant}
      meta="Personal · Product"
      heading="h2"
      index={0}
      href={href}
      eager={eager}
      copy={copy}
    />,
  );

const anchors = (html: string) => html.match(/<a [^>]*>/g) ?? [];

describe("ProjectCard", () => {
  it("makes the title a stretched link only with a case page", () => {
    const project = testProject(1, "personal", "product");
    const linked = render(project, "/en/projects/project-1");
    expect(linked).toMatch(
      /<h2 class="mk-card-title"><a class="mk-stretch" href="\/en\/projects\/project-1">Project 1<\/a><\/h2>/,
    );

    const plain = render(project, null);
    expect(plain).toContain('<h2 class="mk-card-title">Project 1</h2>');
    expect(plain).not.toContain("mk-stretch");
  });

  it("shows the cover in place of the placeholder", () => {
    const placeholder = render(testProject(1, "personal", "product"), null);
    expect(placeholder).not.toContain("<img");
    expect(placeholder).toContain(en.projects.screenshot);

    for (const variant of ["grid", "row"] as const) {
      const html = render(
        testProject(1, "personal", "product", {
          cover: "/projects/project-1/cover.jpg",
        }),
        null,
        variant,
      );
      expect(html).toMatch(/<img [^>]*alt=""/);
      expect(html).toContain("cover.jpg");
      expect(html).not.toContain(en.projects.screenshot);
    }
  });

  it("loads the cover lazily unless the card is in the first screen", () => {
    const project = testProject(1, "personal", "product", {
      cover: "/projects/project-1/cover.jpg",
    });
    expect(render(project, null)).toContain('loading="lazy"');
    expect(render(project, null, "grid", true)).not.toContain('loading="lazy"');
  });

  it("keeps the co-author and the buttons links of their own", () => {
    const project = testProject(1, "personal", "product", {
      links: { live: "https://example.com", code: "https://github.com/x/y" },
      feat: { name: "Ann", href: "https://ann.example", avatar: null },
    });
    const html = render(project, "/en/projects/project-1", "row");
    const links = anchors(html);
    expect(links).toHaveLength(4);
    expect(links.filter((a) => a.includes("mk-stretch"))).toHaveLength(1);
    // Every other link sits in a block the kit lifts above the stretched one.
    expect(html).toMatch(/class="mk-feat"[^]*href="https:\/\/ann\.example"/);
    expect(html).toMatch(
      /class="mk-card-above"[^]*href="https:\/\/example\.com"[^]*href="https:\/\/github\.com\/x\/y"/,
    );
  });
});
