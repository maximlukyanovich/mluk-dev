import type { Metadata } from "next";

import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { locales } from "@/shared/i18n/locales";
import { fontVariables } from "@/shared/ui/fonts";

import "./globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = await getDictionary();
  return {
    title: { default: meta.siteName, template: `%s · ${meta.siteName}` },
    description: meta.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  // Before anything streams: an unknown locale must answer 404, not 200.
  const locale = await getLocale();

  return (
    <html lang={locale} className={fontVariables}>
      <body className="mk-ground min-h-svh">{children}</body>
    </html>
  );
}
