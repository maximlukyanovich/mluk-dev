import { describe, expect, it } from "vitest";

import { featuredFirst, filterProjects, homeProjects } from "./filter";
import { demoProjects, numbers, testProject } from "./test-projects";
import type { ProjectFilter } from "./types";

describe("filterProjects", () => {
  it.each<[ProjectFilter, number[]]>([
    [{ own: "all", type: "all" }, [1, 2, 3, 4, 5, 6]],
    [{ own: "all", type: "product" }, [1, 4]],
    [{ own: "all", type: "site" }, [3, 5]],
    [{ own: "all", type: "oss" }, [2, 6]],
    [{ own: "commercial", type: "all" }, [3, 4, 5]],
    [{ own: "commercial", type: "product" }, [4]],
    [{ own: "commercial", type: "site" }, [3, 5]],
    [{ own: "commercial", type: "oss" }, []],
    [{ own: "personal", type: "all" }, [1, 2, 6]],
    [{ own: "personal", type: "product" }, [1]],
    [{ own: "personal", type: "site" }, []],
    [{ own: "personal", type: "oss" }, [2, 6]],
  ])("%o keeps %o", (filter, expected) => {
    expect(numbers(filterProjects(demoProjects, filter))).toEqual(expected);
  });
});

describe("featuredFirst", () => {
  it("moves the featured up and keeps the order within each group", () => {
    expect(numbers(featuredFirst(demoProjects))).toEqual([1, 3, 2, 4, 5, 6]);
  });

  it("puts the featured first in a filtered list too", () => {
    const commercial = filterProjects(demoProjects, {
      own: "commercial",
      type: "all",
    });
    expect(numbers(featuredFirst(commercial.toReversed()))).toEqual([3, 5, 4]);
  });

  it("leaves its argument as it was", () => {
    const list = [...demoProjects];
    featuredFirst(list);
    expect(list).toEqual(demoProjects);
  });
});

describe("homeProjects", () => {
  it("takes three, featured first", () => {
    expect(numbers(homeProjects(demoProjects))).toEqual([1, 3, 2]);
  });

  it("takes the first three featured when more are starred", () => {
    const starred = demoProjects.map((project) => ({
      ...project,
      featured: project.number > 1,
    }));
    expect(numbers(homeProjects(starred))).toEqual([2, 3, 4]);
  });

  it("shows what there is when there are fewer than three", () => {
    const two = [
      testProject(1, "personal", "oss"),
      testProject(2, "personal", "oss", { featured: true }),
    ];
    expect(numbers(homeProjects(two))).toEqual([2, 1]);
    expect(homeProjects([])).toEqual([]);
  });
});
