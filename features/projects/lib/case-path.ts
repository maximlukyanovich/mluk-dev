import { localePath, type Locale } from "@/shared/i18n/locales";

import type { Project } from "./types";

/**
 * A case page's locale-less path. Apart from `cases.ts`, which reads the
 * content from disk, so the client's project list can link a card too.
 */
export const casePath = (slug: string) => `/projects/${slug}`;

/** The link of a project's card: its case page, or none without a case. */
export const caseHref = (locale: Locale, project: Project): string | null =>
  project.hasCase ? localePath(locale, casePath(project.slug)) : null;
