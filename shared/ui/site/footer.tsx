import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";

import { FooterLanguages } from "./footer-languages";
import { footerLink } from "./footer-link";

type FooterProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/** Copyright on the left; languages, RSS and the sitemap on the right. */
export function Footer({ locale, dictionary }: FooterProps) {
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
