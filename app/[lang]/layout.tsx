import type { Metadata } from "next";

import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { locales, ogLocale } from "@/shared/i18n/locales";
import { siteUrl } from "@/shared/lib/site";
import { fontVariables } from "@/shared/ui/fonts";
import { ThemeProvider } from "@/shared/ui/theme-provider";

import "./globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const [locale, { meta }] = await Promise.all([getLocale(), getDictionary()]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: meta.siteName, template: `%s · ${meta.siteName}` },
    description: meta.description,
    openGraph: {
      siteName: meta.siteName,
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: locales
        .filter((other) => other !== locale)
        .map((other) => ogLocale[other]),
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  // Before anything streams: an unknown locale must answer 404, not 200.
  const locale = await getLocale();

  return (
    // next-themes sets data-theme on <html> before hydration.
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
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
