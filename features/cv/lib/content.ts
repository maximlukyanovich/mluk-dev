import en from "@/content/cv/en.json";
import ru from "@/content/cv/ru.json";
import type { Locale } from "@/shared/i18n/locales";

import type { CvContent, Profile } from "./types";

const content: Record<Locale, CvContent> = { en, ru };

export function getCv(locale: Locale): CvContent {
  return content[locale];
}

export function getProfile(locale: Locale): Profile {
  return content[locale].profile;
}

/** Both locales' raw content, for the tests that read the real data. */
export const cvContent = content;
