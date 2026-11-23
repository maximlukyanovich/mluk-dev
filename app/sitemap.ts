import type { MetadataRoute } from "next";

import { getWritingPages } from "@/features/blog";
import { getCvPages } from "@/features/cv";
import { getProjectsPages } from "@/features/projects";
import { locales } from "@/shared/i18n/locales";
import { siteUrl } from "@/shared/lib/site";
import { sitemapEntries, type SitemapPage } from "@/shared/lib/sitemap";

/** Pages that exist in every locale; each section adds its own. */
const sitePages: SitemapPage[] = [
  { path: "/", versions: locales.map((locale) => ({ locale })) },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries(
    [
      ...sitePages,
      ...getWritingPages(),
      ...getCvPages(),
      ...getProjectsPages(),
    ],
    siteUrl,
  );
}
