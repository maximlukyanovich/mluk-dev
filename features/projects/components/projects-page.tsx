import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import { JsonLd } from "@/shared/ui/json-ld";

import { getProjects } from "../lib/content";
import { featuredFirst } from "../lib/filter";
import { projectsJsonLd } from "../lib/structured-data";
import { ProjectsView } from "./projects-view";

type ProjectsPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * The projects page (canvas, Work-D and M-Work): the title and lead, then
 * the filterable list; the CollectionPage for search engines lists the
 * projects in the order the server renders them.
 */
export function ProjectsPage({ locale, dictionary }: ProjectsPageProps) {
  const projects = getProjects(locale);
  const copy = dictionary.projects;

  return (
    <>
      <JsonLd data={projectsJsonLd(featuredFirst(projects), locale)} />
      <header className="pt-9 sm:pt-14">
        <h1 className="max-w-[980px] font-display text-display-title text-balance">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-[720px] text-lead text-muted">{copy.lead}</p>
      </header>
      <ProjectsView
        projects={projects}
        locale={locale}
        copy={copy}
        newTab={dictionary.site.newTab}
      />
    </>
  );
}
