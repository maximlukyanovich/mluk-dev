import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Article,
  coverPath,
  generatePostParams,
  getPost,
  postLocales,
} from "@/features/blog";
import { getProfile } from "@/features/cv";
import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { localePath, ogLocale } from "@/shared/i18n/locales";
import { ogSize } from "@/shared/ui/og-cover";

// Every post of the parent locale; none → a placeholder that is a 404.
export const generateStaticParams = generatePostParams;

// The slug is read outside Suspense, so the whole post is in the prerendered
// HTML and readable without scripts; a client navigation waits for it
// instead of showing a skeleton (owner, 2026-11-21). An unknown slug still
// gets the localized 404 page with noindex, under a 200: with Cache
// Components the shell is sent before the check runs.
export const instant = false;

type Props = PageProps<"/[lang]/writing/[slug]">;

/** The post in the current locale, or a 404. */
async function load(params: Props["params"]) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const post = getPost(locale, slug);
  if (!post) notFound();
  return { post, locale };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ post, locale }, { meta }] = await Promise.all([
    load(params),
    getDictionary(),
  ]);
  const path = `/writing/${post.slug}`;
  const available = postLocales(post.slug);

  return {
    title: post.title,
    description: post.description,
    alternates: alternates(path, locale, available),
    // Replaces the layout's openGraph whole, so the site's fields come again.
    openGraph: {
      type: "article",
      siteName: meta.siteName,
      title: post.title,
      description: post.description,
      url: localePath(locale, path),
      locale: ogLocale[locale],
      alternateLocale: available
        .filter((other) => other !== locale)
        .map((other) => ogLocale[other]),
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      tags: post.tags,
      // Replacing openGraph drops the layout's image; the post's cover
      // takes its place.
      images: [
        {
          url: coverPath(locale, post.slug),
          ...ogSize,
          alt: post.title,
        },
      ],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const [{ post, locale }, dictionary] = await Promise.all([
    load(params),
    getDictionary(),
  ]);
  const profile = getProfile(locale);

  return (
    <Article
      post={post}
      locale={locale}
      dictionary={dictionary}
      author={{
        name: `${profile.name.first} ${profile.name.last}`,
        line: dictionary.article.authorLine
          .replace("{role}", profile.role)
          .replace("{city}", profile.city),
        photo: profile.photo,
      }}
    />
  );
}
