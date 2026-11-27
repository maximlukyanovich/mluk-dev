import Image from "next/image";
import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";

import { caseHref } from "../lib/case-path";
import { getProject } from "../lib/content";
import type { Project } from "../lib/types";

/** A project another page names; an unknown slug fails the build. */
function mentioned(locale: Locale, slug: string): Project {
  const project = getProject(locale, slug);
  if (!project) throw new Error(`Unknown project "${slug}"`);
  return project;
}

/** Its case page, or Projects for a project without one. */
const mentionHref = (locale: Locale, project: Project): string =>
  caseHref(locale, project) ?? localePath(locale, "/projects");

type ProjectRibbonProps = {
  locale: Locale;
  slugs: readonly string[];
  /** The ribbon's `aria-label`. */
  label: string;
  dictionary: Dictionary;
};

/**
 * Projects in a row of the kit's Mini pills ("Done this way" on How-K2 and
 * M-How): the cover, the name, the type and the status. Wider than its
 * column, the kit's `.mk-ribbon` scrolls sideways inside itself.
 */
export function ProjectRibbon({
  locale,
  slugs,
  label,
  dictionary,
}: ProjectRibbonProps) {
  const copy = dictionary.projects;

  return (
    <ul className="mk-ribbon" aria-label={label}>
      {slugs.map((slug) => {
        const project = mentioned(locale, slug);
        const meta = [
          copy.type[project.type],
          project.status && copy.status[project.status],
        ]
          .filter(Boolean)
          .join(" · ");
        return (
          <li key={slug}>
            <Link className="mk-mini" href={mentionHref(locale, project)}>
              <span className="mk-mini-media" aria-hidden="true">
                {project.cover && (
                  <Image src={project.cover} alt="" width={56} height={36} />
                )}
              </span>
              <span>
                <span className="mk-mini-title">{project.name}</span>
                <span className="mk-mini-meta">{meta}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A project named inside a sentence — the kit's Badge, with a round
 * thumbnail. It links inside the site, so it has no new-tab sign.
 */
export function ProjectBadge({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const project = mentioned(locale, slug);

  return (
    <Link className="mk-badge" href={mentionHref(locale, project)}>
      <span className="mk-badge-thumb" aria-hidden="true">
        {/*
          The kit draws it at 16px; 32 asks for 32w and 64w. A landscape
          cover cropped to the square is held by its height, and 16 gave one
          32w candidate, upscaled on a 2x screen.
        */}
        {project.cover && (
          <Image src={project.cover} alt="" width={32} height={32} />
        )}
      </span>
      {project.name}
    </Link>
  );
}
