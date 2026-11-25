import type { Own, Project, ProjectType } from "./types";

/** A project for a test; what it asserts is set in `overrides`. */
export function testProject(
  number: number,
  own: Own,
  type: ProjectType,
  overrides: Partial<Project> = {},
): Project {
  return {
    number,
    slug: `project-${number}`,
    name: `Project ${number}`,
    featured: false,
    own,
    type,
    status: null,
    stack: [],
    description: `About project ${number}.`,
    year: "2026",
    role: "Developer",
    team: null,
    cover: null,
    links: { live: null, code: null },
    feat: null,
    hasCase: false,
    ...overrides,
  };
}

/** The six projects of the Work-D frame: 01 and 03 featured. */
export const demoProjects: Project[] = [
  testProject(1, "personal", "product", { featured: true }),
  testProject(2, "personal", "oss"),
  testProject(3, "commercial", "site", { featured: true }),
  testProject(4, "commercial", "product"),
  testProject(5, "commercial", "site"),
  testProject(6, "personal", "oss"),
];

export const numbers = (projects: readonly Project[]) =>
  projects.map((project) => project.number);
