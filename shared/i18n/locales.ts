/** The site's locales, in the order the language switch lists them. */
export const locales = ["en", "ru"] as const;

export type Locale = (typeof locales)[number];

/** The locale for a visitor who expressed no preference we support. */
export const defaultLocale: Locale = "en";

/** The cookie that remembers the last locale a visitor chose. */
export const localeCookie = "locale";

export function hasLocale(value: string | undefined): value is Locale {
  return (locales as readonly string[]).includes(value ?? "");
}

/**
 * The locale a path starts with (`/ru`, `/ru/cv`), or undefined when its
 * first segment is not one of ours (`/`, `/writing`, `/english`).
 */
export function pathLocale(pathname: string): Locale | undefined {
  const first = pathname.split("/")[1];
  return hasLocale(first) ? first : undefined;
}

/** The path without its locale prefix: `/ru/cv` → `/cv`, `/ru` → `/`. */
export function stripLocale(pathname: string): string {
  const locale = pathLocale(pathname);
  if (!locale) return pathname;
  return pathname.slice(locale.length + 1) || "/";
}

/** A locale-less path under a locale: (`ru`, `/cv`) → `/ru/cv`, (`ru`, `/`) → `/ru`. */
export function localePath(locale: Locale, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
