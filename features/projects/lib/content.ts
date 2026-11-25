import { existsSync } from "node:fs";
import path from "node:path";

import en from "@/content/projects/en.json";
import ru from "@/content/projects/ru.json";
import { locales, type Locale } from "@/shared/i18n/locales";

import {
  owns,
  statuses,
  types,
  type Project,
  type ProjectSource,
} from "./types";

/** `content/projects/<slug>/<locale>.mdx` — a project's case, if it has one. */
export const casesDir = path.join(process.cwd(), "content", "projects");

/**
 * The starting point for a new case, copied to `content/projects/<slug>/`.
 * It is no case: no project is named `_template`. It keeps the case page's
 * `import()` resolvable when no case exists, as `content/posts/_template`
 * does for posts.
 */
export const caseTemplateDir = path.join(casesDir, "_template");

export function caseFile(slug: string, locale: Locale): string {
  return path.join(casesDir, slug, `${locale}.mdx`);
}

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
 * Checks the closed sets of the content, numbers the projects by their
 * position and asks `hasCase` whether each slug has a case in this locale.
 * An unknown value throws, so the build fails instead of showing an empty
 * label.
 */
export function loadProjects(
  source: readonly ProjectSource[],
  hasCase: (slug: string) => boolean,
): Project[] {
  return source.map((project, index) => ({
    ...project,
    number: index + 1,
    own: oneOf(owns, project.own, `own of ${project.slug}`),
    type: oneOf(types, project.type, `type of ${project.slug}`),
    status:
      project.status === null
        ? null
        : oneOf(statuses, project.status, `status of ${project.slug}`),
    hasCase: hasCase(project.slug),
  }));
}

/** Both locales' raw content, for the tests that read the real data. */
export const projectsContent: Record<Locale, { projects: ProjectSource[] }> = {
  en,
  ru,
};

let cache: Record<Locale, Project[]> | undefined;

/**
 * Every locale's projects. Read once per build; `next dev` looks for the case
 * files again on each call, so a new case shows without a restart.
 */
function allProjects(): Record<Locale, Project[]> {
  if (!cache || process.env.NODE_ENV === "development") {
    cache = Object.fromEntries(
      locales.map((locale) => [
        locale,
        loadProjects(projectsContent[locale].projects, (slug) =>
          existsSync(caseFile(slug, locale)),
        ),
      ]),
    ) as Record<Locale, Project[]>;
  }
  return cache;
}

/** The projects of `locale` in the content's order. */
export function getProjects(locale: Locale): Project[] {
  return allProjects()[locale];
}

export function getProject(locale: Locale, slug: string): Project | undefined {
  return getProjects(locale).find((project) => project.slug === slug);
}
