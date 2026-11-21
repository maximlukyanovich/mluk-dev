"use client";

import { usePathname } from "next/navigation";

import { locales, type Locale } from "@/shared/i18n/locales";
import { switchHref } from "@/shared/i18n/switch-href";

type LangSwitchProps = {
  locale: Locale;
  label: string;
  /** The short name of each locale (`EN`, `RU`). */
  names: Record<Locale, string>;
};

/**
 * EN / RU: the current locale is a lime segment, the other links to the same
 * page there. A plain anchor: the other locale has another root layout, so
 * the navigation is a full page load anyway.
 */
export function LangSwitch({ locale, label, names }: LangSwitchProps) {
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
            href={switchHref(pathname, target)}
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
