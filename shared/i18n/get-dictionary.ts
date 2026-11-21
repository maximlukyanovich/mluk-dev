import { notFound } from "next/navigation";
import { lang } from "next/root-params";

import { dictionaryFor, type Dictionary } from "./dictionaries";
import { hasLocale, type Locale } from "./locales";

/**
 * The current locale, read from the `[lang]` root parameter. A value that is
 * not one of ours is a 404. Server Components only: route handlers read
 * `params` instead, `next/root-params` throws there.
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!hasLocale(value)) notFound();
  return value;
}

/** The current locale's dictionary. */
export async function getDictionary(): Promise<Dictionary> {
  return dictionaryFor(await getLocale());
}
