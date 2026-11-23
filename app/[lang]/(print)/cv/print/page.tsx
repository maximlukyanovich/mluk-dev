import type { Metadata } from "next";

import { CvPrint, getCv } from "@/features/cv";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";

// The sheet `pnpm cv:pdf` prints: no header or footer — the (print) group
// has no layout of its own — and kept out of search; the PDF is the page.
export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: dictionary.cv.title,
    robots: { index: false, follow: false },
  };
}

export default async function CvPrintRoute() {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  return <CvPrint cv={getCv(locale)} dictionary={dictionary} />;
}
