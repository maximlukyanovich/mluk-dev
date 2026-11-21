import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { Footer } from "@/shared/ui/site/footer";
import { Header } from "@/shared/ui/site/header";

export default async function SiteLayout({ children }: LayoutProps<"/[lang]">) {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <div className="mx-auto max-w-(--container) px-4 pt-5 pb-16 sm:px-5">
      <a
        href="#content"
        className="mk-btn mk-btn-primary sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
      >
        {dictionary.site.skipLink}
      </a>
      <Header locale={locale} dictionary={dictionary} />
      <main id="content" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer locale={locale} dictionary={dictionary} />
    </div>
  );
}
