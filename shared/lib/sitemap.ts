import type { MetadataRoute } from "next";

import {
  defaultLocale,
  localePath,
  locales,
  type Locale,
} from "@/shared/i18n/locales";

/** A locale-less path and the locales it exists in. */
export type SitemapPage = {
  path: string;
  versions: { locale: Locale; lastModified?: string }[];
};

/**
 * One sitemap entry per existing version of each page, each listing the
 * versions that exist as alternates plus `x-default` — the default locale
 * when the page has it, else the first it has, as `alternates()` does for
 * the page's own metadata.
 */
export function sitemapEntries(
  pages: readonly SitemapPage[],
  origin: string,
): MetadataRoute.Sitemap {
  return pages.flatMap(({ path, versions }) => {
    const present = locales.filter((locale) =>
      versions.some((version) => version.locale === locale),
    );
    const url = (locale: Locale) => origin + localePath(locale, path);
    const fallback = present.includes(defaultLocale)
      ? defaultLocale
      : present[0];
    const languages = {
      ...Object.fromEntries(present.map((locale) => [locale, url(locale)])),
      ...(fallback && { "x-default": url(fallback) }),
    };
    return present.map((locale) => {
      const { lastModified } = versions.find((v) => v.locale === locale)!;
      return {
        url: url(locale),
        ...(lastModified && { lastModified }),
        alternates: { languages },
      };
    });
  });
}
