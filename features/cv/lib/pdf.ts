import type { Locale } from "@/shared/i18n/locales";

/** The CV as a PDF under `public/`, written by `pnpm cv:pdf`. */
export function cvPdfPath(locale: Locale): string {
  return `/cv/mluk-cv-${locale}.pdf`;
}
