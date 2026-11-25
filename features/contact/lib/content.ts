import en from "@/content/contact/en.json";
import ru from "@/content/contact/ru.json";
import type { Locale } from "@/shared/i18n/locales";

import type { ContactContent } from "./types";

const content: Record<Locale, ContactContent> = { en, ru };

/** The contact page's content of `locale`. */
export function getContact(locale: Locale): ContactContent {
  return content[locale];
}

/** Both locales' raw content, for the tests that read the real data. */
export const contactContent = { en, ru };
