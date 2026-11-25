import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { ogSize } from "@/shared/ui/og-cover";
import { PrevNext } from "@/shared/ui/prev-next";

import Image from "next/image";

import { coverPath } from "../lib/cover";
import { getPosts, postLocales } from "../lib/posts";
import type { Post } from "../lib/types";
import { AuthorBox, type Author } from "./author-box";
import { PostBody } from "./post-body";
import { PostMeta } from "./post-meta";
import { PostTags } from "./post-tags";
import { TocBar } from "./toc-bar";
import { TocSide } from "./toc-side";

/** Fewer sections than this get no table of contents (kit Toc). */
const tocFrom = 3;

type ArticleProps = {
  post: Post;
  locale: Locale;
  dictionary: Dictionary;
  /** From the CV; the article links to it. */
  author: Omit<Author, "href">;
};

/**
 * A post page, both chosen layouts in one markup and switched by CSS at
 * 1280px (`wide`): Article-W puts the table of contents and the tags in a
 * sticky 300px column beside the 740px text, 72px apart, with the title
 * above the text; Article-B keeps one 740px column with the contents as a
 * sticky bar and the tags after the text.
 */
export async function Article({
  post,
  locale,
  dictionary,
  author,
}: ArticleProps) {
  const copy = dictionary.article;
  const writing = localePath(locale, "/writing");
  const withHref = { ...author, href: localePath(locale, "/cv") };

  // Newest first: the older post is the previous one.
  const posts = getPosts(locale);
  const index = posts.findIndex(({ slug }) => slug === post.slug);
  const previous: Post | undefined = posts[index + 1];
  const next: Post | undefined = index > 0 ? posts[index - 1] : undefined;

  const neighbour = ({ slug, title }: Post) => ({
    href: localePath(locale, `/writing/${slug}`),
    title,
  });

  const translations = postLocales(post.slug)
    .filter((other) => other !== locale)
    .map((other) => ({
      locale: other,
      name: dictionary.locales[other].name,
      href: localePath(other, `/writing/${post.slug}`),
    }));
  const toc = post.headings.length >= tocFrom ? post.headings : undefined;

  return (
    <>
      <article className="mx-auto max-w-(--measure) wide:grid wide:max-w-none wide:grid-cols-[300px_minmax(0,var(--measure))] wide:justify-center wide:gap-x-18">
        <header className="pt-14 wide:col-start-2">
          <Breadcrumbs
            label={copy.breadcrumbs}
            trail={[
              { name: copy.home, href: localePath(locale, "/") },
              { name: dictionary.site.nav.writing, href: writing },
            ]}
            current={post.title}
          />
          <h1 className="mt-4.5 max-w-[980px] font-display text-display-title text-balance">
            {post.title}
          </h1>
          <p className="mt-4.5 max-w-[720px] text-lead text-muted">
            {post.description}
          </p>
          <div className="mt-6.5">
            <PostMeta
              post={post}
              author={withHref}
              translations={translations}
              copy={copy}
            />
          </div>
        </header>

        <aside className="sticky top-6 mt-10 hidden flex-col gap-3 self-start wide:col-start-1 wide:row-start-2 wide:flex">
          {toc && <TocSide headings={toc} title={copy.onThisPage} />}
          <PostTags tags={post.tags} locale={locale} label={copy.tags} />
        </aside>

        {toc && (
          <TocBar
            headings={toc}
            title={copy.onThisPage}
            className="mt-7 wide:hidden"
          />
        )}

        <div className="mt-9 wide:col-start-2 wide:row-start-2 wide:mt-10">
          <div className="mk-prose mk-prose-numbered">
            {/* The cover is the post's Open Graph picture (kit Figure, OgCover):
                at the top, eager, since it is the first screen's image. */}
            <figure className="mk-figure mk-figure-cover">
              <Image
                src={coverPath(locale, post.slug)}
                alt={post.title}
                width={ogSize.width}
                height={ogSize.height}
                sizes="(min-width: 790px) 740px, 100vw"
                loading="eager"
                fetchPriority="high"
              />
            </figure>
            <PostBody
              slug={post.slug}
              locale={locale}
              dictionary={dictionary}
            />
          </div>
          <PostTags
            tags={post.tags}
            locale={locale}
            label={copy.tags}
            className="mt-9 wide:hidden"
          />
          {/* In a prose box, as the kit shows it: links in peri. The box is
              the prose's first child, whose margin the kit resets, so the
              author box's 48px sits on the wrapper. */}
          <div className="mk-prose mt-12">
            <AuthorBox
              author={withHref}
              feed={localePath(locale, "/feed.xml")}
              copy={copy}
            />
          </div>
        </div>
      </article>
      <PrevNext
        label={copy.morePosts}
        previous={previous && neighbour(previous)}
        next={next && neighbour(next)}
        previousLabel={copy.previous}
        nextLabel={copy.next}
      />
    </>
  );
}
