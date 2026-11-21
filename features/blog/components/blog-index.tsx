import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { localePath } from "@/shared/i18n/locales";

import { listPage, listPagePath, listTitle } from "../lib/list";
import { getPosts } from "../lib/posts";
import { writingPageLocales } from "../lib/sitemap";
import { LatestCard } from "./latest-card";
import { Pager } from "./pager";
import { PostList } from "./post-list";
import { TagFilter } from "./tag-filter";

/** Which list page a route shows: its tag and its `page/<n>` segment. */
export type WritingQuery = { tag?: string; raw?: string };

/** The list page of the current locale, or a 404. */
async function load(query: WritingQuery) {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  const list = listPage(getPosts(locale), query);
  if (!list) notFound();
  return { locale, dictionary, list };
}

/** Title, description and the locales the page exists in. */
export async function writingListMetadata(
  query: WritingQuery = {},
): Promise<Metadata> {
  const { locale, dictionary, list } = await load(query);
  const path = listPagePath(list.base, list.page);
  return {
    title: listTitle(list, dictionary.writing),
    description: dictionary.writing.lead,
    alternates: alternates(path, locale, writingPageLocales(path)),
  };
}

/**
 * Writing and its tag pages (canvas, Blog-B3 and M-Blog): the title and
 * lead, the newest post large on the first page of Writing, the tag filter
 * with the RSS feed, the post list and the pager. A locale with no posts
 * shows one line instead, with the feed.
 */
export async function BlogIndex({ query = {} }: { query?: WritingQuery }) {
  const { locale, dictionary, list } = await load(query);
  const words = dictionary.writing;
  const [beforeRss, afterRss] = words.empty.split("{rss}");

  return (
    <>
      <header className="pt-9 sm:pt-14">
        <h1 className="max-w-[980px] font-display text-display-title text-balance">
          {words.title}
        </h1>
        <p className="mt-4 max-w-[720px] text-lead text-muted">{words.lead}</p>
      </header>

      {list.total ? (
        <>
          {list.latest && (
            <LatestCard
              post={list.latest}
              locale={locale}
              copy={{ ...dictionary.article, ...words }}
            />
          )}
          <TagFilter
            tags={list.tags}
            current={list.tag}
            locale={locale}
            copy={words}
          />
          <PostList
            posts={list.rows}
            locale={locale}
            copy={dictionary.article}
          />
          <Pager
            page={list.page}
            pages={list.pages}
            total={list.total}
            base={list.base}
            locale={locale}
            copy={dictionary.pager}
          />
        </>
      ) : (
        <p className="mt-10 text-muted">
          {beforeRss}
          <a
            className="mk-link"
            href={localePath(locale, "/feed.xml")}
            type="application/rss+xml"
          >
            {words.emptyRss}
          </a>
          {afterRss}
        </p>
      )}
    </>
  );
}
