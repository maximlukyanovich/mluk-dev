import {
  defaultLocale,
  hasLocale,
  localePath,
  pathLocale,
  type Locale,
} from "./locales";

export type LocaleRequest = {
  /** The request path, e.g. `/writing` or `/ru/cv`. */
  pathname: string;
  /** The query string with its `?`, or empty. */
  search?: string;
  /** The value of the `locale` cookie, if any. */
  cookie?: string;
  /** The raw `Accept-Language` header, if any. */
  acceptLanguage?: string | null;
};

export type LocaleDecision =
  /** Send the visitor to the same path under a locale (307). */
  | { redirect: string }
  /** Serve the path; remember its locale when the cookie says otherwise. */
  | { next: true; setCookie?: Locale };

/**
 * What the proxy does with a request. A path with a locale prefix is served
 * and its locale becomes the remembered one; a path without one is redirected
 * under the remembered locale, else the best `Accept-Language` match, else
 * the default.
 */
export function decideLocale({
  pathname,
  search = "",
  cookie,
  acceptLanguage,
}: LocaleRequest): LocaleDecision {
  const prefixed = pathLocale(pathname);
  if (prefixed) {
    return prefixed === cookie
      ? { next: true }
      : { next: true, setCookie: prefixed };
  }

  const locale = hasLocale(cookie)
    ? cookie
    : (negotiate(acceptLanguage) ?? defaultLocale);
  return { redirect: localePath(locale, pathname) + search };
}

/**
 * The supported locale an `Accept-Language` header prefers most: entries by
 * descending `q` (ties keep header order), matched by primary subtag
 * (`ru-RU` → `ru`); `q=0` and `*` never match.
 */
export function negotiate(
  header: string | null | undefined,
): Locale | undefined {
  if (!header) return undefined;

  const ranges = header
    .split(",")
    .map((entry, index) => {
      const [tag = "", ...params] = entry.trim().split(";");
      const q = params
        .map((param) => param.trim().match(/^q=([0-9.]+)$/i))
        .find(Boolean);
      return {
        primary: tag.trim().toLowerCase().split("-")[0],
        q: q ? Number(q[1]) : 1,
        index,
      };
    })
    .filter(({ q }) => Number.isFinite(q) && q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  return ranges.map(({ primary }) => primary).find(hasLocale);
}
