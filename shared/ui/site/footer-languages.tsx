"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { locales, type Locale } from "@/shared/i18n/locales";
import { switchHrefIn, type PathFallbacks } from "@/shared/i18n/switch-href";

import { footerLink } from "./footer-link";

type FooterLanguagesProps = {
  locale: Locale;
  label: string;
  /** Each locale's name in its own language (`English`, `Русский`). */
  names: Record<Locale, string>;
  /** Where a page missing in the other locale sends the visitor instead. */
  fallbacks?: PathFallbacks;
};

/** «English / Русский»: the current locale as text, the other as a link. */
export function FooterLanguages({
  locale,
  label,
  names,
  fallbacks,
}: FooterLanguagesProps) {
  const pathname = usePathname();

  return (
    <span role="group" aria-label={label}>
      {locales.map((target, index) => (
        <Fragment key={target}>
          {index > 0 && " / "}
          {target === locale ? (
            <span aria-current="true">{names[target]}</span>
          ) : (
            <a
              className={footerLink}
              href={switchHrefIn(pathname, target, fallbacks)}
              hrefLang={target}
              lang={target}
            >
              {names[target]}
            </a>
          )}
        </Fragment>
      ))}
    </span>
  );
}
