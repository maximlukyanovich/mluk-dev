import { localePath, stripLocale, type Locale } from "./locales";

/**
 * Where the language switch sends a visitor: the same page in the target
 * locale, or — when the page has no version there — `fallback`, a
 * locale-less path (an untranslated post falls back to `/writing`).
 */
export function switchHref(
  pathname: string,
  target: Locale,
  fallback?: string,
): string {
  return localePath(target, fallback ?? stripLocale(pathname));
}
