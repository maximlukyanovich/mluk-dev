"use client";

import { usePathname } from "next/navigation";
import { Fragment } from "react";

import { locales, type Locale } from "@/shared/i18n/locales";
import { switchHref } from "@/shared/i18n/switch-href";

import { footerLink } from "./footer-link";

type FooterLanguagesProps = {
  locale: Locale;
  label: string;
  /** Each locale's name in its own language (`English`, `Русский`). */
  names: Record<Locale, string>;
};

/** «English / Русский»: the current locale as text, the other as a link. */
export function FooterLanguages({
  locale,
  label,
  names,
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
              href={switchHref(pathname, target)}
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
