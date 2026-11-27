import type { Metadata, Viewport } from "next";

import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { locales, ogLocale } from "@/shared/i18n/locales";
import { manifestPath } from "@/shared/lib/manifest";
import { siteUrl } from "@/shared/lib/site";
import { fontVariables } from "@/shared/ui/fonts";
import { themeColor } from "@/shared/ui/theme-color";
import { ThemeProvider } from "@/shared/ui/theme-provider";

import "./globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = { themeColor };

export async function generateMetadata(): Promise<Metadata> {
  const [locale, { meta }] = await Promise.all([getLocale(), getDictionary()]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: meta.siteName, template: `%s · ${meta.siteName}` },
    description: meta.description,
    manifest: manifestPath(locale),
    openGraph: {
      siteName: meta.siteName,
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => ogLocale[other]),
    },
    // Next fills the title, description and image from openGraph, on every
    // page that does not set its own.
    twitter: { card: "summary_large_image" },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  // Before anything streams: an unknown locale must answer 404, not 200.
  const locale = await getLocale();

  return (
    // next-themes sets data-theme on <html> before hydration.
    <html
      lang={locale}
      className={fontVariables}
      // Next turns web.css's smooth scrolling off during a route change.
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="mk-ground min-h-svh">
        {/* The kit's buttons and tags have 150ms transitions; without
            disableTransitionOnChange a theme switch would ripple through them. */}
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
