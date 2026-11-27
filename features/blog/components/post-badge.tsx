import Image from "next/image";
import Link from "next/link";

import { localePath } from "@/shared/i18n/locales";

import { coverPath } from "../lib/cover";
import type { Post } from "../lib/types";

/**
 * A post named inside a sentence — the kit's Badge with a square thumbnail:
 * the post's cover, cropped. The page that holds the sentence leaves it out
 * while the post does not exist in the locale, so this takes a post, not a
 * slug.
 */
export function PostBadge({ post }: { post: Post }) {
  return (
    <Link
      className="mk-badge mk-badge-post"
      href={localePath(post.locale, `/writing/${post.slug}`)}
    >
      <span className="mk-badge-thumb" aria-hidden="true">
        <Image
          src={coverPath(post.locale, post.slug)}
          alt=""
          width={16}
          height={16}
        />
      </span>
      {post.title}
    </Link>
  );
}
