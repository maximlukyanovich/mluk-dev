import type { Metadata } from "next";

import { getPost, PostBadge } from "@/features/blog";
import {
  ContactTiles,
  pickChannels,
  replyTime,
  visibleChannels,
} from "@/features/contact";
import { availability, getProfile } from "@/features/cv";
import { HowIWorkPage } from "@/features/how-i-work";
import { ProjectBadge, ProjectRibbon } from "@/features/projects";
import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  return {
    title: dictionary.howIWork.title,
    description: dictionary.howIWork.description,
    alternates: alternates("/how-i-work", locale),
  };
}

export default async function HowIWorkRoute() {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);

  return (
    <HowIWorkPage
      locale={locale}
      dictionary={dictionary}
      slots={{
        eyebrow: availability(getProfile(locale), dictionary.home),
        ribbon: (slugs) => (
          <ProjectRibbon
            locale={locale}
            slugs={slugs}
            label={dictionary.howIWork.doneThisWay}
            dictionary={dictionary}
          />
        ),
        projectBadge: (slug) => <ProjectBadge locale={locale} slug={slug} />,
        post: (slug) => {
          const post = getPost(locale, slug);
          return post ? <PostBadge post={post} /> : null;
        },
        contacts: {
          tiles: (ids, className) => {
            const shown = pickChannels(visibleChannels(locale), ids);
            return shown.length > 0 ? (
              <ContactTiles
                className={className}
                channels={shown}
                label={dictionary.contact.channels}
                newTab={dictionary.site.newTab}
              />
            ) : null;
          },
          replies: replyTime(locale),
        },
      }}
    />
  );
}
