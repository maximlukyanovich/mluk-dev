import en from "@/content/cv/en.json";
import ru from "@/content/cv/ru.json";
import type { Locale } from "@/shared/i18n/locales";

import type { CvContent, Profile } from "./types";

const content: Record<Locale, CvContent> = { en, ru };

export function getProfile(locale: Locale): Profile {
  return content[locale].profile;
}

/** Both locales' raw content, for the parity test. */
export const cvContent = content;
