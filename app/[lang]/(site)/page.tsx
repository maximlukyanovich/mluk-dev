import type { Metadata } from "next";

import { RecentPosts } from "@/features/blog";
import { getProfile, Intro, ProfileCard } from "@/features/cv";
import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { localePath } from "@/shared/i18n/locales";
import { personId, profileLinks, siteUrl } from "@/shared/lib/site";
import { JsonLd } from "@/shared/ui/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return { alternates: alternates("/", await getLocale()) };
}

export default async function Home() {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  const profile = getProfile(locale);
  const url = siteUrl + localePath(locale, "/");
  const name = `${profile.name.first} ${profile.name.last}`;

  // Person and WebSite for search engines.
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      name,
      jobTitle: profile.role,
      url,
      sameAs: profileLinks,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: dictionary.meta.siteName,
      url,
      inLanguage: locale,
    },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <section className="flex flex-wrap items-center gap-8 pt-16 pb-10">
        <div className="min-w-0 flex-[3_1_520px]">
          <Intro locale={locale} profile={profile} copy={dictionary.home} />
        </div>
        <div className="min-w-0 flex-[2_1_340px]">
          <ProfileCard profile={profile} copy={dictionary.home} />
        </div>
      </section>
      <RecentPosts locale={locale} dictionary={dictionary} />
    </>
  );
}
