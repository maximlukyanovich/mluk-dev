import type { MetadataRoute } from "next";

import { localePath, locales } from "@/shared/i18n/locales";
import { siteUrl } from "@/shared/lib/site";

/** Locale-less paths of the pages that exist; each section adds its own. */
const paths = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [locale, siteUrl + localePath(locale, path)]),
    );
    return locales.map((locale) => ({
      url: languages[locale],
      alternates: { languages },
    }));
  });
}
