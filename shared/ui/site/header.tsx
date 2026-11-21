import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import type { PathFallbacks } from "@/shared/i18n/switch-href";

import { LangSwitch } from "./lang-switch";
import { Nav } from "./nav";
import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./wordmark";

type HeaderProps = {
  locale: Locale;
  dictionary: Dictionary;
  /** Passed to the language switch: pages missing in the other locale. */
  fallbacks?: PathFallbacks;
};

/** The kit's Header: wordmark, navigation, language switch, theme toggle. */
export function Header({ locale, dictionary, fallbacks }: HeaderProps) {
  const { site, locales } = dictionary;

  return (
    <header className="mk-header mk-glass">
      <Wordmark href={localePath(locale, "/")} />
      <Nav locale={locale} label={site.navLabel} names={site.nav} />
      <div className="mk-header-tools">
        <LangSwitch
          locale={locale}
          label={site.langLabel}
          names={{ en: locales.en.short, ru: locales.ru.short }}
          fallbacks={fallbacks}
        />
        <ThemeToggle toLight={site.theme.toLight} toDark={site.theme.toDark} />
      </div>
    </header>
  );
}
