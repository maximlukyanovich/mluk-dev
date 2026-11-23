import { locales } from "@/shared/i18n/locales";
import type { SitemapPage } from "@/shared/lib/sitemap";

/** The contact page in every locale; undated, like the home page. */
export function getContactPages(): SitemapPage[] {
  return [
    { path: "/contact", versions: locales.map((locale) => ({ locale })) },
  ];
}
