import type { Metadata } from "next";

import { CvPage } from "@/features/cv";
import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  return {
    title: dictionary.cv.title,
    description: dictionary.cv.description,
    alternates: alternates("/cv", locale),
  };
}

export default async function CvRoute() {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  return <CvPage locale={locale} dictionary={dictionary} />;
}
