import { localePath, type Locale } from "@/shared/i18n/locales";
import { personId, profileLinks, siteUrl } from "@/shared/lib/site";

import type { CvContent, Profile } from "./types";

/**
 * The site owner as a schema.org Person — one entity by `@id` on the home
 * page, the CV and as every post's author.
 */
function person(profile: Profile, locale: Locale) {
  return {
    "@type": "Person",
    "@id": personId,
    name: `${profile.name.first} ${profile.name.last}`,
    jobTitle: profile.role,
    url: siteUrl + localePath(locale, "/"),
    sameAs: profileLinks,
  };
}

/** The Person as a JSON-LD block of its own (the home page). */
export function personJsonLd(profile: Profile, locale: Locale) {
  return { "@context": "https://schema.org", ...person(profile, locale) };
}

/** The CV page as a schema.org ProfilePage about the same Person. */
export function profilePageJsonLd(cv: CvContent, locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: siteUrl + localePath(locale, "/cv"),
    inLanguage: locale,
    dateModified: cv.updated,
    mainEntity: person(cv.profile, locale),
  };
}
