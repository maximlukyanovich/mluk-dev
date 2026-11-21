import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import type { PathFallbacks } from "@/shared/i18n/switch-href";

import { FooterLanguages } from "./footer-languages";

type FooterProps = {
  locale: Locale;
  dictionary: Dictionary;
  /** Passed to the language switch: pages missing in the other locale. */
  fallbacks?: PathFallbacks;
};

/**
 * The kit's Footer: the copyright and, joined by " / " and " · ", the
 * languages, RSS and the sitemap. On a phone kit.css centres it with the
 * links on top, each 44px tall.
 */
export function Footer({ locale, dictionary, fallbacks }: FooterProps) {
  const { footer } = dictionary.site;
  const { locales } = dictionary;

  return (
    <footer className="mk-footer">
      <p>{footer.copyright}</p>
      <p className="mk-footer-links">
        <FooterLanguages
          locale={locale}
          names={{ en: locales.en.name, ru: locales.ru.name }}
          fallbacks={fallbacks}
        />
        {" · "}
        <a href={`/${locale}/feed.xml`}>{footer.rss}</a>
        {" · "}
        <a href="/sitemap.xml">{footer.sitemap}</a>
      </p>
    </footer>
  );
}
