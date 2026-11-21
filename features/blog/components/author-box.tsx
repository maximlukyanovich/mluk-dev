import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";

import { Avatar, type AuthorPhoto } from "./avatar";

export type Author = {
  name: string;
  /** "[Role] in [City]", from the CV. */
  line: string;
  photo: AuthorPhoto;
  href: string;
};

type AuthorBoxProps = {
  author: Author;
  feed: string;
  copy: Dictionary["article"];
};

/** The kit's AuthorBox at the end of the text: photo, name, a line, links. */
export function AuthorBox({ author, feed, copy }: AuthorBoxProps) {
  return (
    <aside className="mk-author mk-glass" aria-label={copy.aboutAuthor}>
      <Avatar photo={author.photo} />
      <p>
        <strong>{author.name}</strong> — {author.line}.{" "}
        <Link href={author.href}>{copy.aboutMe}</Link> ·{" "}
        <a href={feed}>{copy.rss}</a>
      </p>
    </aside>
  );
}
