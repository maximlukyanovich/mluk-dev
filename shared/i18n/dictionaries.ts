import en from "./dictionaries/en.json";
import ru from "./dictionaries/ru.json";
import type { Locale } from "./locales";

/** The shape every locale's dictionary has: the English one is the reference. */
export type Dictionary = typeof en;

// The annotation makes `tsc` reject a Russian dictionary that lacks a key the
// English one has; the mluk-fe locale-parity hook catches the reverse.
const dictionaries: Record<Locale, Dictionary> = { en, ru };

/**
 * The dictionary of an explicit locale — for code that has no root
 * parameter to read (`global-not-found`, route handlers, tests). Pages and
 * layouts call `getDictionary()` instead.
 */
export function dictionaryFor(locale: Locale): Dictionary {
  return dictionaries[locale];
}
