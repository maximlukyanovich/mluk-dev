import type { Locale } from "./locales";

/**
 * A dictionary entry with one string per plural category of a language:
 * `{ "one": "{n} post", "other": "{n} posts" }` in English, `one`, `few`,
 * `many` and `other` in Russian. `other` is always there.
 */
export type PluralForms = Partial<Record<Intl.LDMLPluralRule, string>> & {
  other: string;
};

const rules = new Map<Locale, Intl.PluralRules>();

/** The form of `forms` for `count` in `locale`, with `{n}` replaced. */
export function plural(
  locale: Locale,
  count: number,
  forms: PluralForms,
): string {
  let rule = rules.get(locale);
  if (!rule) {
    rule = new Intl.PluralRules(locale);
    rules.set(locale, rule);
  }
  return (forms[rule.select(count)] ?? forms.other).replace(
    "{n}",
    String(count),
  );
}
