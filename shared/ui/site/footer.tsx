import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import type { PathFallbacks } from "@/shared/i18n/switch-href";

import { FooterLanguages } from "./footer-languages";
import { footerLink } from "./footer-link";

type FooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  /** Passed to the language switch: pages missing in the other locale. */
  fallbacks?: PathFallbacks;
};

/** Copyright on the left; languages, RSS and the sitemap on the right. */
export function Footer({ locale, dictionary, fallbacks }: FooterProps) {
  const { footer } = dictionary.site;
  const { locales } = dictionary;

  return (
    <footer className="mt-12 flex flex-wrap justify-between gap-3 px-2 font-mono text-xs/normal text-muted">
      <span>{footer.copyright}</span>
      <span>
        <FooterLanguages
          locale={locale}
          label={footer.languagesLabel}
          names={{ en: locales.en.name, ru: locales.ru.name }}
          fallbacks={fallbacks}
        />
        {" · "}
        <a className={footerLink} href={`/${locale}/feed.xml`}>
          {footer.rss}
        </a>
        {" · "}
        <a className={footerLink} href="/sitemap.xml">
          {footer.sitemap}
        </a>
      </span>
    </footer>
  );
}
