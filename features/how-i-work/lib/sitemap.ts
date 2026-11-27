import { locales } from "@/shared/i18n/locales";
import type { SitemapPage } from "@/shared/lib/sitemap";

/** The How I work page in every locale; undated, like the contact page. */
export function getHowIWorkPages(): SitemapPage[] {
  return [
    { path: "/how-i-work", versions: locales.map((locale) => ({ locale })) },
  ];
}
