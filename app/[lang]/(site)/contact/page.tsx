import type { Metadata } from "next";

import { ContactPage } from "@/features/contact";
import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  return {
    title: dictionary.contact.title,
    description: dictionary.contact.description,
    alternates: alternates("/contact", locale),
  };
}

export default async function ContactRoute() {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  return <ContactPage locale={locale} dictionary={dictionary} />;
}
