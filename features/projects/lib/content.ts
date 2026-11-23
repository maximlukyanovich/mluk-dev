import en from "@/content/projects/en.json";
import ru from "@/content/projects/ru.json";
import type { Locale } from "@/shared/i18n/locales";

import {
  owns,
  statuses,
  types,
  type Project,
  type ProjectSource,
} from "./types";

function oneOf<T extends string>(
  set: readonly T[],
  value: string,
  what: string,
): T {
  if ((set as readonly string[]).includes(value)) return value as T;
  throw new Error(
    `Unknown project ${what} "${value}"; expected one of ${set.join(", ")}`,
  );
}

/**
 * Checks the closed sets of the content and numbers the projects by their
 * position. An unknown value throws, so the build fails instead of showing
 * an empty label.
 */
export function loadProjects(source: readonly ProjectSource[]): Project[] {
  return source.map((project, index) => ({
    ...project,
    number: index + 1,
    own: oneOf(owns, project.own, `own of ${project.slug}`),
    type: oneOf(types, project.type, `type of ${project.slug}`),
    status:
      project.status === null
        ? null
        : oneOf(statuses, project.status, `status of ${project.slug}`),
  }));
}

const content: Record<Locale, Project[]> = {
  en: loadProjects(en.projects),
  ru: loadProjects(ru.projects),
};

/** The projects of `locale` in the content's order. */
export function getProjects(locale: Locale): Project[] {
  return content[locale];
}

/** Both locales' raw content, for the tests that read the real data. */
export const projectsContent = { en, ru };
