import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { mdxComponents } from "@/features/blog";
import {
  CasePage,
  caseLocales,
  casePath,
  generateCaseParams,
  getCase,
} from "@/features/projects";
import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";
import { localePath, ogLocale } from "@/shared/i18n/locales";
import { ogSize, siteImagePath } from "@/shared/ui/og-cover";

// Every case of the parent locale; none → a placeholder that is a 404.
export const generateStaticParams = generateCaseParams;

// As a post: the slug is read outside Suspense, so the whole case is in the
// prerendered HTML. An unknown slug, or a project without a case, gets the
// localized 404 page with noindex under a 200 — the shell is sent first.
export const instant = false;

type Props = PageProps<"/[lang]/projects/[slug]">;

/** The project of the case in the current locale, or a 404. */
async function load(params: Props["params"]) {
  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const project = getCase(locale, slug);
  if (!project) notFound();
  return { project, locale };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ project, locale }, { meta }] = await Promise.all([
    load(params),
    getDictionary(),
  ]);
  const path = casePath(project.slug);
  const available = caseLocales(project.slug);

  return {
    title: project.name,
    description: project.description,
    alternates: alternates(path, locale, available),
    // Replaces the layout's openGraph whole, as a post does, so the site's
    // fields come again. That drops the site's picture: the cover takes its
    // place, and a case without one links the site's picture again.
    openGraph: {
      type: "website",
      siteName: meta.siteName,
      title: project.name,
      description: project.description,
      url: localePath(locale, path),
      locale: ogLocale[locale],
      alternateLocale: available
        .filter((other) => other !== locale)
        .map((other) => ogLocale[other]),
      images: [
        project.cover
          ? { url: project.cover, alt: project.name }
          : { url: siteImagePath(locale), ...ogSize, alt: meta.ogTitle },
      ],
    },
  };
}

export default async function CaseRoute({ params }: Props) {
  const [{ project, locale }, dictionary] = await Promise.all([
    load(params),
    getDictionary(),
  ]);

  return (
    <CasePage
      project={project}
      locale={locale}
      dictionary={dictionary}
      components={mdxComponents(locale, dictionary)}
    />
  );
}
