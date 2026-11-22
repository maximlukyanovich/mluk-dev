import { listPagePath, listPath } from "./list";
import { pageCount } from "./paginate";
import { countTags } from "./posts";
import type { Post } from "./types";

/** The dynamic segments under `app/[lang]/(site)/writing/` of each kind of page. */
export type RouteParams = {
  listPage: { n: string };
  tag: { tag: string };
  tagPage: { tag: string; n: string };
  post: { slug: string };
};

export type ParamKind = keyof RouteParams;

/**
 * One blog page in one locale: its `params`; the `posts` of its list — the
 * whole list's on each of its pages, the post itself on a post's; and the
 * `parent` the language switch falls back to when the target locale lacks
 * it. The list has no segments and exists in every locale, its empty state
 * included.
 */
export type WritingRoute =
  | { kind: "list"; path: string; posts: readonly Post[] }
  | {
      [K in ParamKind]: {
        kind: K;
        path: string;
        posts: readonly Post[];
        parent: string;
        params: RouteParams[K];
      };
    }[ParamKind];

/**
 * Every blog page a locale with `posts` has, as locale-less paths: the list
 * and its pages 2…N, each tag and its pages, each post. The one rule the
 * sitemap, the language switch's fallbacks and `generateStaticParams` read.
 */
export function writingRoutes(posts: readonly Post[]): WritingRoute[] {
  const list = listPath();
  const routes: WritingRoute[] = [{ kind: "list", path: list, posts }];
  for (let n = 2; n <= pageCount(posts.length); n++) {
    routes.push({
      kind: "listPage",
      path: listPagePath(list, n),
      posts,
      parent: list,
      params: { n: String(n) },
    });
  }
  for (const { tag } of countTags(posts)) {
    const tagged = posts.filter((post) => post.tags.includes(tag));
    const tagPath = listPath(tag);
    routes.push({
      kind: "tag",
      path: tagPath,
      posts: tagged,
      parent: list,
      params: { tag },
    });
    for (let n = 2; n <= pageCount(tagged.length); n++) {
      routes.push({
        kind: "tagPage",
        path: listPagePath(tagPath, n),
        posts: tagged,
        parent: tagPath,
        params: { tag, n: String(n) },
      });
    }
  }
  for (const post of posts) {
    routes.push({
      kind: "post",
      path: `${list}/${post.slug}`,
      posts: [post],
      parent: list,
      params: { slug: post.slug },
    });
  }
  return routes;
}

/** The `params` of the routes of one kind. */
export function routeParams<K extends ParamKind>(
  routes: readonly WritingRoute[],
  kind: K,
): RouteParams[K][] {
  const params: RouteParams[K][] = [];
  for (const route of routes) {
    if (route.kind === kind && "params" in route) {
      params.push(route.params as RouteParams[K]);
    }
  }
  return params;
}
