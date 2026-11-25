import { describe, expect, it } from "vitest";

import { featuredFirst } from "./filter";
import { caseJsonLd, projectsJsonLd } from "./structured-data";
import { demoProjects, testProject } from "./test-projects";

describe("projectsJsonLd", () => {
  it("describes the projects page of the locale", () => {
    expect(projectsJsonLd([], "ru")).toEqual({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      url: "https://mluk.dev/ru/projects",
      inLanguage: "ru",
      mainEntity: { "@type": "ItemList", itemListElement: [] },
    });
  });

  it("lists the works in the order of the page", () => {
    const { itemListElement } = projectsJsonLd(
      featuredFirst(demoProjects),
      "en",
    ).mainEntity;
    expect(
      itemListElement.map(({ position, item }) => [position, item.name]),
    ).toEqual([
      [1, "Project 1"],
      [2, "Project 3"],
      [3, "Project 2"],
      [4, "Project 4"],
      [5, "Project 5"],
      [6, "Project 6"],
    ]);
  });

  it("is a work by the site's Person, without a URL when it has no link", () => {
    const [{ item }] = projectsJsonLd([testProject(1, "personal", "oss")], "en")
      .mainEntity.itemListElement;
    expect(item).toEqual({
      "@type": "CreativeWork",
      name: "Project 1",
      description: "About project 1.",
      author: { "@id": "https://mluk.dev/#person" },
    });
  });

  it("takes the live site for the URL, else the code", () => {
    const urls = projectsJsonLd(
      [
        testProject(1, "personal", "oss", {
          links: { live: "https://a.dev", code: "https://github.com/a" },
        }),
        testProject(2, "personal", "oss", {
          links: { live: null, code: "https://github.com/b" },
        }),
      ],
      "en",
    ).mainEntity.itemListElement.map(({ item }) => item.url);
    expect(urls).toEqual(["https://a.dev", "https://github.com/b"]);
  });

  it("takes the code when the live site is an empty string", () => {
    const [{ item }] = projectsJsonLd(
      [
        testProject(1, "personal", "oss", {
          links: { live: "", code: "https://github.com/c" },
        }),
      ],
      "en",
    ).mainEntity.itemListElement;
    expect(item.url).toBe("https://github.com/c");
  });

  it("names the collaborator, with their page only when it is given", () => {
    const contributors = projectsJsonLd(
      [
        testProject(1, "commercial", "site", {
          feat: { name: "Ann", href: "https://ann.dev", avatar: null },
        }),
        testProject(2, "commercial", "site", {
          feat: { name: "Bob", href: null, avatar: "/projects/people/b.jpg" },
        }),
      ],
      "en",
    ).mainEntity.itemListElement.map(({ item }) => item.contributor);
    expect(contributors).toEqual([
      { "@type": "Person", name: "Ann", url: "https://ann.dev" },
      { "@type": "Person", name: "Bob" },
    ]);
  });
});

describe("caseJsonLd", () => {
  it("is the project's work, on its case page in the locale", () => {
    expect(
      caseJsonLd(
        testProject(2, "personal", "oss", {
          links: { live: "https://a.dev", code: null },
        }),
        "ru",
      ),
    ).toEqual({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: "Project 2",
      description: "About project 2.",
      url: "https://a.dev",
      author: { "@id": "https://mluk.dev/#person" },
      inLanguage: "ru",
      mainEntityOfPage: "https://mluk.dev/ru/projects/project-2",
    });
  });

  it("takes the cover as its image, by an absolute URL", () => {
    const { image } = caseJsonLd(
      testProject(1, "personal", "oss", {
        cover: "/projects/project-1/cover.jpg",
      }),
      "en",
    );
    expect(image).toBe("https://mluk.dev/projects/project-1/cover.jpg");
  });

  it("names the collaborator, as on the projects page", () => {
    const { contributor } = caseJsonLd(
      testProject(1, "commercial", "site", {
        feat: { name: "Ann", href: null, avatar: null },
      }),
      "en",
    );
    expect(contributor).toEqual({ "@type": "Person", name: "Ann" });
  });
});
