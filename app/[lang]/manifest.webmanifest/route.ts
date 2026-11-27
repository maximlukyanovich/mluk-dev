import { notFound } from "next/navigation";

import { hasLocale, locales } from "@/shared/i18n/locales";
import { manifestFor } from "@/shared/lib/manifest";

// A route handler: next/root-params throws here, so the locale comes from
// params, and the file lists its own locales. The root layout links each
// page to its locale's manifest.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** The locale's web app manifest. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string }> },
) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return new Response(JSON.stringify(manifestFor(lang)), {
    headers: { "Content-Type": "application/manifest+json; charset=utf-8" },
  });
}
