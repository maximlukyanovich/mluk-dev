import type { MDXComponents, MDXContent } from "mdx/types";
import type { ComponentProps } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";

import { codeFigure } from "./code-block";
import { mediaComponents } from "./post-media";

/**
 * What a post's elements render as. Handed to the MDX content as a prop, so
 * the root mdx-components.tsx stays empty and never imports a feature; a
 * route hands the same set to another section's MDX.
 */
export function mdxComponents(
  locale: Locale,
  dictionary: Dictionary,
): MDXComponents {
  return {
    ...mediaComponents(dictionary.media, dictionary.site.newTab),
    figure: codeFigure(locale, dictionary.code),
    // A table of contents moves focus to the section it jumps to.
    h2: (props: ComponentProps<"h2">) => <h2 {...props} tabIndex={-1} />,
  };
}

type PostBodyProps = {
  slug: string;
  locale: Locale;
  dictionary: Dictionary;
};

/** The post's MDX, compiled at build time by @next/mdx (features/blog/mdx). */
export async function PostBody({ slug, locale, dictionary }: PostBodyProps) {
  const { default: Content }: { default: MDXContent } = await import(
    `@/content/posts/${slug}/${locale}.mdx`
  );
  return <Content components={mdxComponents(locale, dictionary)} />;
}
