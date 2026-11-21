"use client";

import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/shared/i18n/locales";
import { switchHrefIn, type PathFallbacks } from "@/shared/i18n/switch-href";

type LangSwitchProps = {
  locale: Locale;
  label: string;
  /** The short name of each locale (`EN`, `RU`). */
  names: Record<Locale, string>;
  /** Where a page missing in the other locale sends the visitor instead. */
  fallbacks?: PathFallbacks;
};

/**
 * EN / RU: the current locale is a lime segment, the other links to the same
 * page there. A plain anchor: the other locale has another root layout, so
 * the navigation is a full page load anyway.
 */
export function LangSwitch({
  locale,
  label,
  names,
  fallbacks,
}: LangSwitchProps) {
  const pathname = usePathname();

  return (
    <nav className="mk-lang" aria-label={label}>
      {locales.map((target) =>
        target === locale ? (
          <span key={target} aria-current="true">
            {names[target]}
          </span>
        ) : (
          <a
            key={target}
            href={switchHrefIn(pathname, target, fallbacks)}
            hrefLang={target}
            lang={target}
          >
            {names[target]}
          </a>
        ),
      )}
    </nav>
  );
}
