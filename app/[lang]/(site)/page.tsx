import type { Metadata } from "next";

import { RecentPosts } from "@/features/blog";
import { getProfile, Intro, ProfileCard } from "@/features/cv";
import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { localePath } from "@/shared/i18n/locales";
import { siteUrl } from "@/shared/lib/site";

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

  // Person and WebSite for search engines; `<` is escaped so the JSON can
  // never close the script element.
  const jsonLd = JSON.stringify([
    {
      "@context": "https://schema.org",
      "@type": "Person",
      name,
      jobTitle: profile.role,
      url,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: dictionary.meta.siteName,
      url,
      inLanguage: locale,
    },
  ]).replace(/</g, "\\u003c");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
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
