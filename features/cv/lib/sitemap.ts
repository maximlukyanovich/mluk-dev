import { locales } from "@/shared/i18n/locales";
import type { SitemapPage } from "@/shared/lib/sitemap";

import { getCv } from "./content";

/** The CV page in every locale, dated by that locale's last change. */
export function getCvPages(): SitemapPage[] {
  return [
    {
      path: "/cv",
      versions: locales.map((locale) => ({
        locale,
        lastModified: getCv(locale).updated,
      })),
    },
  ];
}
