import { hasLocale } from "@/shared/i18n/locales";

import { pageCount } from "./paginate";
import { countTags, getPosts } from "./posts";
import type { Post } from "./types";

/**
 * With Cache Components an empty `generateStaticParams` fails the build, so
 * a locale with nothing to list returns one placeholder that its page turns
 * into `notFound()`: deleting the last post never breaks the build.
 */
export const noneParam = "__none__";

export function slugParams(posts: readonly Post[]): { slug: string }[] {
  return posts.length
    ? posts.map(({ slug }) => ({ slug }))
    : [{ slug: noneParam }];
}

/** Pages 2…N of a list; page 1 is the list's own route. */
export function pageParams(total: number): { n: string }[] {
  const pages = pageCount(total);
  if (pages < 2) return [{ n: "2" }]; // parsePage("2", 1) is null → 404
  return Array.from({ length: pages - 1 }, (_, i) => ({ n: String(i + 2) }));
}

export function tagParams(posts: readonly Post[]): { tag: string }[] {
  const tags = countTags(posts);
  return tags.length ? tags.map(({ tag }) => ({ tag })) : [{ tag: noneParam }];
}

export function tagPageParams(
  posts: readonly Post[],
  tag: string,
): { n: string }[] {
  return pageParams(posts.filter((post) => post.tags.includes(tag)).length);
}

/** The parent segments a child `generateStaticParams` receives. */
type Parent<T = object> = { params: { lang: string } & T };

function postsOf(lang: string): Post[] {
  return hasLocale(lang) ? getPosts(lang) : [];
}

// The generators for the routes under app/[lang]/(site)/writing/.

export const generatePostParams = ({ params }: Parent) =>
  slugParams(postsOf(params.lang));

export const generateListPageParams = ({ params }: Parent) =>
  pageParams(postsOf(params.lang).length);

export const generateTagParams = ({ params }: Parent) =>
  tagParams(postsOf(params.lang));

export const generateTagPageParams = ({ params }: Parent<{ tag: string }>) =>
  tagPageParams(postsOf(params.lang), params.tag);
