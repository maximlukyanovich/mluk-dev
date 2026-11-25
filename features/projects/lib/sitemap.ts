import { locales, type Locale } from "@/shared/i18n/locales";
import type { SitemapPage } from "@/shared/lib/sitemap";

import { casePath } from "./cases";
import { getProjects } from "./content";
import type { Project } from "./types";

/**
 * The projects page in every locale and each case page in the locales it is
 * written in; undated, like the home page.
 */
export function projectsPages(
  projectsByLocale: Record<Locale, readonly Project[]>,
): SitemapPage[] {
  const cases = new Map<string, SitemapPage["versions"]>();
  for (const locale of locales) {
    for (const { slug, hasCase } of projectsByLocale[locale]) {
      if (!hasCase) continue;
      const path = casePath(slug);
      cases.set(path, [...(cases.get(path) ?? []), { locale }]);
    }
  }
  return [
    { path: "/projects", versions: locales.map((locale) => ({ locale })) },
    ...[...cases].map(([path, versions]) => ({ path, versions })),
  ];
}

export function getProjectsPages(): SitemapPage[] {
  const projectsByLocale = Object.fromEntries(
    locales.map((locale) => [locale, getProjects(locale)]),
  ) as Record<Locale, Project[]>;
  return projectsPages(projectsByLocale);
}
