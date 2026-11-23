import type { Metadata } from "next";

import { ProjectsPage } from "@/features/projects";
import { alternates } from "@/shared/i18n/alternates";
import { getDictionary, getLocale } from "@/shared/i18n/get-dictionary";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  return {
    title: dictionary.projects.title,
    description: dictionary.projects.description,
    alternates: alternates("/projects", locale),
  };
}

export default async function ProjectsRoute() {
  const [locale, dictionary] = await Promise.all([
    getLocale(),
    getDictionary(),
  ]);
  return <ProjectsPage locale={locale} dictionary={dictionary} />;
}
