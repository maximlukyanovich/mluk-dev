import { hasLocale, locales, type Locale } from "@/shared/i18n/locales";

import { getProject, getProjects } from "./content";
import { featuredFirst } from "./filter";
import type { Project } from "./types";

/**
 * With Cache Components an empty `generateStaticParams` fails the build, so
 * a locale with no case returns this slug, which its page turns into
 * `notFound()` — no project is `__none__`. The blog's placeholder has the same
 * value; features do not import each other.
 */
export const noneParam = "__none__";

/** The projects with a case, in the order of the projects page. */
export function caseProjects(projects: readonly Project[]): Project[] {
  return featuredFirst(projects).filter((project) => project.hasCase);
}

/**
 * The cases before and after `slug`'s in the order of the projects page; the
 * first has no previous and the last no next — the list does not wrap.
 */
export function caseNeighbours(
  projects: readonly Project[],
  slug: string,
): { previous?: Project; next?: Project } {
  const cases = caseProjects(projects);
  const index = cases.findIndex((project) => project.slug === slug);
  if (index < 0) return {};
  return { previous: cases[index - 1], next: cases[index + 1] };
}

/** `{ slug }` of each case of `projects`, or the placeholder when none has one. */
export function caseParams(projects: readonly Project[]): { slug: string }[] {
  const params = caseProjects(projects).map(({ slug }) => ({ slug }));
  return params.length ? params : [{ slug: noneParam }];
}

/**
 * The case page's `generateStaticParams`. Next hands it only the root
 * layout's `lang`.
 */
export const generateCaseParams = ({ params }: { params: { lang: string } }) =>
  caseParams(hasLocale(params.lang) ? getProjects(params.lang) : []);

/** The project of a case page, when it exists and has a case in `locale`. */
export function getCase(locale: Locale, slug: string): Project | undefined {
  const project = getProject(locale, slug);
  return project?.hasCase ? project : undefined;
}

/** The locales a case is written in, in the site's order. */
export function caseLocales(slug: string): Locale[] {
  return locales.filter((locale) => getCase(locale, slug));
}
