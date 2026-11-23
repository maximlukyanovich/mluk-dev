import { localePath, type Locale } from "@/shared/i18n/locales";
import {
  channels,
  personId,
  profileLinks,
  siteUrl,
  type Channel,
  type ChannelId,
} from "@/shared/lib/site";

// Widened: `channels` holds the literal `null` until the address is chosen.
const known: Readonly<Record<ChannelId, Channel>> = channels;

/** The owner's address for JSON-LD: none while it is a placeholder. */
const ownerAddress = known.email.href?.replace(/^mailto:/, "") ?? null;

/**
 * The contact page as a schema.org ContactPage about the site's Person — by
 * the same `@id` as the home page and the CV, with the profiles elsewhere,
 * and the email once there is a real address. The name and job title stay
 * with the full Person on the home page and the CV.
 */
export function contactPageJsonLd(
  locale: Locale,
  email: string | null = ownerAddress,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: siteUrl + localePath(locale, "/contact"),
    inLanguage: locale,
    mainEntity: {
      "@type": "Person",
      "@id": personId,
      sameAs: profileLinks,
      ...(email && { email }),
    },
  };
}
