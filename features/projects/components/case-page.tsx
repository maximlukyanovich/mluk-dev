import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { cn } from "@/shared/lib/cn";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { JsonLd } from "@/shared/ui/json-ld";
import { PrevNext, type PrevNextItem } from "@/shared/ui/prev-next";

import { caseNeighbours, casePath } from "../lib/cases";
import { getProjects } from "../lib/content";
import { caseJsonLd } from "../lib/structured-data";
import type { Project } from "../lib/types";
import { CaseBody } from "./case-body";
import { CasePanel, CasePills } from "./case-facts";
import { projectNumber } from "./project-card";

type CasePageProps = {
  project: Project;
  locale: Locale;
  dictionary: Dictionary;
  /** The MDX elements of a post, from the route (`features/blog`). */
  components: MDXComponents;
};

/**
 * A project's case page, both chosen layouts in one markup and switched by
 * CSS at 1280px (`wide`), as the article is. Case-B, wider: the head across
 * the 1200px container, then a sticky 340px panel of facts 48px beside the
 * 740px text. Case-A and M-Case, narrower: one 740px column with the facts
 * as pills under the lead and nothing sticky. Under both: the neighbouring
 * cases in the projects page's order and "All projects →".
 */
export function CasePage({
  project,
  locale,
  dictionary,
  components,
}: CasePageProps) {
  const copy = dictionary.projects;
  const projects = localePath(locale, "/projects");
  const kind = (item: Project) =>
    `${copy.own[item.own]} · ${copy.type[item.type]}`;
  const facts = { ...copy, newTab: dictionary.site.newTab };

  const { previous, next } = caseNeighbours(getProjects(locale), project.slug);
  const neighbour = (item: Project): PrevNextItem => ({
    href: localePath(locale, casePath(item.slug)),
    title: item.name,
    meta: `${projectNumber(item.number)} · ${kind(item)}`,
  });

  return (
    <div className="mx-auto max-w-(--measure) wide:max-w-none">
      <JsonLd data={caseJsonLd(project, locale)} />
      <header className="flex flex-col gap-4.5 pt-14">
        <Breadcrumbs
          label={dictionary.article.breadcrumbs}
          trail={[
            { name: dictionary.article.home, href: localePath(locale, "/") },
            { name: dictionary.site.nav.projects, href: projects },
          ]}
          current={project.name}
        />
        <p className="mk-card-meta p-0">
          <span className="mk-card-no">{projectNumber(project.number)}</span>
          <span>{kind(project)}</span>
        </p>
        <h1 className="max-w-[980px] font-display text-display-title text-balance">
          {project.name}
        </h1>
        <p className="max-w-[720px] text-lead text-muted">
          {project.description}
        </p>
        <CasePills project={project} copy={facts} />
      </header>

      <div className="mt-10 wide:flex wide:gap-12">
        <CasePanel project={project} copy={facts} />
        <article className="mk-prose mk-prose-numbered min-w-0 wide:max-w-(--measure) wide:flex-1">
          {project.cover && (
            // The case's Open Graph picture too: at the top, eager, since it
            // is the first screen's image.
            <figure className="mk-figure mk-figure-cover">
              <span className="relative block aspect-[16/10]">
                <Image
                  src={project.cover}
                  alt={copy.case.coverAlt.replace("{name}", project.name)}
                  fill
                  className="object-cover"
                  sizes="(min-width: 790px) 740px, 100vw"
                  loading="eager"
                  fetchPriority="high"
                />
              </span>
            </figure>
          )}
          <CaseBody
            slug={project.slug}
            locale={locale}
            components={components}
          />
        </article>
      </div>

      <PrevNext
        label={copy.case.moreProjects}
        previous={previous && neighbour(previous)}
        next={next && neighbour(next)}
        previousLabel={copy.case.previous}
        nextLabel={copy.case.next}
      />
      {/* PrevNext brings its own 56px; without it the link keeps them. */}
      <div
        className={cn(
          "flex justify-center",
          previous || next ? "mt-6" : "mt-14",
        )}
      >
        <Link className="mk-link" href={projects}>
          {copy.allProjects} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
