import type { MDXComponents, MDXContent } from "mdx/types";

import type { Locale } from "@/shared/i18n/locales";

type CaseBodyProps = {
  slug: string;
  locale: Locale;
  /**
   * What the case's elements render as — the blog's set, handed over by the
   * route, since a feature never imports another.
   */
  components: MDXComponents;
};

/**
 * The case's MDX, `content/projects/<slug>/<locale>.mdx`, compiled at build
 * time by @next/mdx with the posts' plugins. `content/projects/_template`
 * keeps the import resolvable when no case exists.
 */
export async function CaseBody({ slug, locale, components }: CaseBodyProps) {
  const { default: Content }: { default: MDXContent } = await import(
    `@/content/projects/${slug}/${locale}.mdx`
  );
  return <Content components={components} />;
}
