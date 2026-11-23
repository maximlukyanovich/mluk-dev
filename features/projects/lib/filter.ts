import type { Project, ProjectFilter } from "./types";

/** How many projects the home page's strip shows. */
export const homeProjectCount = 3;

/** The projects that match both parts of the filter, in the given order. */
export function filterProjects(
  projects: readonly Project[],
  { own, type }: ProjectFilter,
): Project[] {
  return projects.filter(
    (project) =>
      (own === "all" || project.own === own) &&
      (type === "all" || project.type === type),
  );
}

/** Featured projects first; the order within each group is kept. */
export function featuredFirst(projects: readonly Project[]): Project[] {
  return projects.toSorted((a, b) => Number(b.featured) - Number(a.featured));
}

/** The home page's projects: the first three, featured first. */
export function homeProjects(projects: readonly Project[]): Project[] {
  return featuredFirst(projects).slice(0, homeProjectCount);
}
