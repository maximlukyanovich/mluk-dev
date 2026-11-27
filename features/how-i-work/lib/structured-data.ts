import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { personId, siteUrl } from "@/shared/lib/site";

/**
 * The How I work page as a schema.org WebPage about the site's Person — by
 * the same `@id` as the home page, the CV and the contact page. The terms of
 * the work wait for real values before they become a Service with an Offer.
 */
export function howIWorkJsonLd(
  locale: Locale,
  copy: Pick<Dictionary["howIWork"], "title" | "description">,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url: siteUrl + localePath(locale, "/how-i-work"),
    inLanguage: locale,
    name: copy.title,
    description: copy.description,
    about: { "@id": personId },
  };
}
