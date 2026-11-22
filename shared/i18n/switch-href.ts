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

/**
 * Fallbacks for pages that exist in one locale only:
 * target → { locale-less path → fallback path }.
 */
export type PathFallbacks = Partial<
  Record<Locale, Readonly<Record<string, string>>>
>;

/** `switchHref` with the fallback looked up in `fallbacks`. */
export function switchHrefIn(
  pathname: string,
  target: Locale,
  fallbacks?: PathFallbacks,
): string {
  return switchHref(
    pathname,
    target,
    fallbacks?.[target]?.[stripLocale(pathname)],
  );
}
