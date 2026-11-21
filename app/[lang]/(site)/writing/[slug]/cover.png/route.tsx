import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";

import { coverMeta, generatePostCoverParams, getPost } from "@/features/blog";
import { hasLocale } from "@/shared/i18n/locales";
import { OgCover, ogFonts, ogSize } from "@/shared/ui/og-cover";

// The post's cover, /<lang>/writing/<slug>/cover.png: the article shows it
// and its metadata gives it as the Open Graph image. A route handler of our
// own rather than opengraph-image.tsx, whose URL under a dynamic segment
// carries a generated suffix (`opengraph-image-<hash>/…`) the page could not
// link to. next/root-params throws here, so the locale and the slug come
// from params, and the file lists its own pairs.
export const generateStaticParams = generatePostCoverParams;

/** The kit's OgCover for a post: its first tag, title, date, read time. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; slug: string }> },
) {
  const { lang, slug } = await params;
  const post = hasLocale(lang) ? getPost(lang, slug) : undefined;
  if (!post) notFound();

  return new ImageResponse(
    <OgCover
      title={post.title}
      meta={coverMeta(post)}
      tag={post.tags[0] && `#${post.tags[0]}`}
    />,
    { ...ogSize, fonts: ogFonts() },
  );
}
