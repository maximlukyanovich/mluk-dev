import { hasLocale, locales } from "@/shared/i18n/locales";

import { getPosts } from "./posts";
import {
  routeParams,
  writingRoutes,
  type ParamKind,
  type RouteParams,
} from "./routes";
import type { Post } from "./types";

/**
 * With Cache Components an empty `generateStaticParams` fails the build, so
 * a locale with nothing to list returns one placeholder that its page turns
 * into `notFound()` — no slug, tag or page number is `__none__`: deleting
 * the last post never breaks the build.
 */
export const noneParam = "__none__";

const placeholder: RouteParams = {
  listPage: { n: noneParam },
  tag: { tag: noneParam },
  tagPage: { tag: noneParam, n: noneParam },
  post: { slug: noneParam },
};

/** The params of every `kind` page a locale with `posts` has (`routes.ts`). */
export function staticParams<K extends ParamKind>(
  posts: readonly Post[],
  kind: K,
): RouteParams[K][] {
  const params = routeParams(writingRoutes(posts), kind);
  return params.length ? params : [placeholder[kind]];
}

/** The parent segment a child `generateStaticParams` receives: the root layout's. */
type Parent = { params: { lang: string } };

function postsOf(lang: string): Post[] {
  return hasLocale(lang) ? getPosts(lang) : [];
}

// The generators for the routes under app/[lang]/(site)/writing/. Only
// `[lang]` has a layout above them, so each returns every segment below it:
// a sibling page's generator (tag/[tag]/page.tsx) is no parent of
// tag/[tag]/page/[n].

export const generatePostParams = ({ params }: Parent) =>
  staticParams(postsOf(params.lang), "post");

export const generateListPageParams = ({ params }: Parent) =>
  staticParams(postsOf(params.lang), "listPage");

export const generateTagParams = ({ params }: Parent) =>
  staticParams(postsOf(params.lang), "tag");

export const generateTagPageParams = ({ params }: Parent) =>
  staticParams(postsOf(params.lang), "tagPage");

/**
 * `{ lang, slug }` for a post's cover, a route handler, which lists its own
 * locales: next/root-params throws there, and its generator gets no parent.
 */
export const generatePostCoverParams = () =>
  locales.flatMap((lang) =>
    staticParams(postsOf(lang), "post").map(({ slug }) => ({ lang, slug })),
  );
