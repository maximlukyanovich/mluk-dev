import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";

import type { Post } from "../lib/types";
import { Avatar, type AuthorPhoto } from "./avatar";

export type Translation = { locale: Locale; name: string; href: string };

type PostMetaProps = {
  post: Post;
  author: { name: string; href: string; photo: AuthorPhoto };
  /** The post in the other locales it is written in. */
  translations: readonly Translation[];
  copy: Dictionary["article"];
};

/** The kit's ArticleMeta: author, dates, read time, the other language. */
export function PostMeta({ post, author, translations, copy }: PostMetaProps) {
  return (
    <div className="mk-meta">
      <Link className="mk-pill mk-pill-author" href={author.href}>
        <Avatar photo={author.photo} small />
        {author.name}
      </Link>
      <span className="mk-pill">
        <span className="mk-pill-key">{copy.published}</span>{" "}
        <time dateTime={post.date}>{post.date}</time>
      </span>
      {post.updated && post.updated !== post.date && (
        <span className="mk-pill">
          <span className="mk-pill-key">{copy.updated}</span>{" "}
          <time dateTime={post.updated}>{post.updated}</time>
        </span>
      )}
      <span className="mk-pill mk-pill-accent">
        {copy.readingTime.replace("{n}", String(post.readingTime))}
      </span>
      {/* Another root layout: a plain anchor, as in the language switch. */}
      {translations.map(({ locale, name, href }) => (
        <a
          key={locale}
          className="mk-pill"
          href={href}
          hrefLang={locale}
          lang={locale}
        >
          {name} <span aria-hidden="true">↗</span>
        </a>
      ))}
    </div>
  );
}
