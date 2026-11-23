import { locales } from "@/shared/i18n/locales";
import type { SitemapPage } from "@/shared/lib/sitemap";

/** The projects page in every locale; undated, like the home page. */
export function getProjectsPages(): SitemapPage[] {
  return [
    { path: "/projects", versions: locales.map((locale) => ({ locale })) },
  ];
}
