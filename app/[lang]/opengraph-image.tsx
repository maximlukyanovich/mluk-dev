import { ImageResponse } from "next/og";

import { dictionaryFor } from "@/shared/i18n/dictionaries";
import { hasLocale, locales } from "@/shared/i18n/locales";
import { OgCover, ogFonts, ogSize, siteImageId } from "@/shared/ui/og-cover";

// A route handler: next/root-params throws here, so the locale comes from
// params, and the file lists its own locales.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const contentType = "image/png";

export function generateImageMetadata({
  params,
}: {
  params: { lang: string };
}) {
  const locale = hasLocale(params.lang) ? params.lang : locales[0];
  return [
    {
      id: siteImageId,
      alt: dictionaryFor(locale).meta.ogTitle,
      size: ogSize,
      contentType,
    },
  ];
}

export default async function Image({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : locales[0];
  const { meta } = dictionaryFor(locale);

  return new ImageResponse(
    <OgCover
      title={meta.ogTitle}
      meta={`${meta.siteName} · ${dictionaryFor(locale).locales[locale].short}`}
    />,
    { ...ogSize, fonts: ogFonts() },
  );
}
