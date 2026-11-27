import type { MetadataRoute } from "next";

import { dictionaryFor } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { pageBackground } from "@/shared/ui/theme-color";

/** Where a locale's manifest is served (app/[lang]/manifest.webmanifest). */
export function manifestPath(locale: Locale): string {
  return localePath(locale, "/manifest.webmanifest");
}

/**
 * The app icons in public/icons, drawn from assets/favicon: the kit's tab
 * icon (Wordmark) in its dark-theme values.
 */
export const manifestIcons: MetadataRoute.Manifest["icons"] = [
  { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
  { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
  {
    src: "/icons/icon-maskable-512.png",
    sizes: "512x512",
    type: "image/png",
    purpose: "maskable",
  },
];

/**
 * A locale's web app manifest. One `id` for both locales: an installed site
 * stays one app whichever language it was installed from. The colours are
 * the dark theme's, as the icons are.
 */
export function manifestFor(locale: Locale): MetadataRoute.Manifest {
  const { meta } = dictionaryFor(locale);
  return {
    id: "/",
    name: meta.siteName,
    short_name: meta.siteName,
    description: meta.description,
    lang: locale,
    dir: "ltr",
    start_url: localePath(locale, "/"),
    scope: "/",
    display: "standalone",
    background_color: pageBackground.dark,
    theme_color: pageBackground.dark,
    icons: manifestIcons,
  };
}
