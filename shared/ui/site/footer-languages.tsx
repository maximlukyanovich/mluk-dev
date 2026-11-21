"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { locales, type Locale } from "@/shared/i18n/locales";
import { switchHrefIn, type PathFallbacks } from "@/shared/i18n/switch-href";

type FooterLanguagesProps = {
  locale: Locale;
  /** Each locale's name in its own language (`English`, `Русский`). */
  names: Record<Locale, string>;
  /** Where a page missing in the other locale sends the visitor instead. */
  fallbacks?: PathFallbacks;
};

/**
 * «English / Русский»: the current locale as text, the other as a link. No
 * wrapper: the kit makes each link of `.mk-footer-links` a 44px target on a
 * phone, so both names sit right in it.
 */
export function FooterLanguages({
  locale,
  names,
  fallbacks,
}: FooterLanguagesProps) {
  const pathname = usePathname();

  return (
    <>
      {locales.map((target, index) => (
        <Fragment key={target}>
          {index > 0 && " / "}
          {target === locale ? (
            <span aria-current="true">{names[target]}</span>
          ) : (
            <a
              href={switchHrefIn(pathname, target, fallbacks)}
              hrefLang={target}
              lang={target}
            >
              {names[target]}
            </a>
          )}
        </Fragment>
      ))}
    </>
  );
}
