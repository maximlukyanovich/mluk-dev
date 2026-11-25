import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";

import { caseHref } from "../lib/case-path";
import { getProjects } from "../lib/content";
import { homeProjects } from "../lib/filter";
import { ProjectCard } from "./project-card";

type ProjectsStripProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Projects on the home page (canvas, Main and M-Home): the section title
 * with "All projects →", then three cards, featured first, their meta the
 * status. A locale with no projects has no section.
 */
export function ProjectsStrip({ locale, dictionary }: ProjectsStripProps) {
  const projects = homeProjects(getProjects(locale));
  if (!projects.length) return null;
  const copy = dictionary.projects;
  const cardCopy = { ...copy, newTab: dictionary.site.newTab };

  return (
    <section className="pt-14 sm:pt-18" aria-labelledby="home-projects-h">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-display-section" id="home-projects-h">
          {copy.title}
        </h2>
        <Link className="mk-link" href={localePath(locale, "/projects")}>
          {copy.allProjects} <span aria-hidden="true">→</span>
        </Link>
      </div>
      <div className="mk-cards">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            project={project}
            variant="grid"
            meta={project.status ? copy.status[project.status] : ""}
            heading="h3"
            index={index}
            href={caseHref(locale, project)}
            copy={cardCopy}
          />
        ))}
      </div>
    </section>
  );
}
