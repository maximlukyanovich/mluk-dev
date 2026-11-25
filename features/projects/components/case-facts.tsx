import type { Dictionary } from "@/shared/i18n/dictionaries";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { ExternalLink } from "@/shared/ui/external-link";

import type { Project } from "../lib/types";

export type CaseFactsCopy = Pick<
  Dictionary["projects"],
  "status" | "role" | "stack" | "when" | "live" | "code" | "case"
> & { newTab: string };

type Variant = "primary" | "secondary";

type CaseFactsProps = {
  project: Project;
  copy: CaseFactsCopy;
};

/**
 * Live (primary) and Code (secondary), each only when the project has the
 * link; in a row under the title, a column in the panel.
 */
function CaseLinks({
  project,
  copy,
  className,
}: CaseFactsProps & { className?: string }) {
  // An empty string is no link, as on the card.
  const links = [
    { href: project.links.live, label: copy.live, variant: "primary" },
    { href: project.links.code, label: copy.code, variant: "secondary" },
  ].filter(
    (link): link is { href: string; label: string; variant: Variant } =>
      !!link.href,
  );
  if (!links.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2.5", className)}>
      {links.map((link) => (
        <ExternalLink
          key={link.label}
          className={buttonVariants({ variant: link.variant })}
          href={link.href}
          newTab={copy.newTab}
        >
          {link.label}
        </ExternalLink>
      ))}
    </div>
  );
}

const stackLine = (project: Project) => project.stack.join(" · ");

/**
 * Case-A and M-Case, below 1280px: the facts as the kit's meta pills under
 * the lead — the status with its dot, then When, Role and Team — the stack
 * as a peri line, then the buttons. A fact the project lacks has no pill.
 */
export function CasePills({ project, copy }: CaseFactsProps) {
  const pills = [
    { key: copy.when, value: project.year },
    { key: copy.role, value: project.role },
    { key: copy.case.team, value: project.team },
  ].filter((pill) => pill.value);
  const stack = stackLine(project);

  return (
    <>
      {(project.status || pills.length > 0) && (
        <div className="mk-meta mt-2 wide:hidden">
          {project.status && (
            <span className="mk-pill">
              <span className="mk-dot" aria-hidden="true" />
              {copy.status[project.status]}
            </span>
          )}
          {pills.map((pill) => (
            <span key={pill.key} className="mk-pill">
              <span className="mk-pill-key">{pill.key}</span> {pill.value}
            </span>
          ))}
        </div>
      )}
      {stack && <p className="mk-card-stack p-0 wide:hidden">{stack}</p>}
      <CaseLinks project={project} copy={copy} className="mt-2 wide:hidden" />
    </>
  );
}

/**
 * Case-B, from 1280px: a sticky 340px glass panel beside the text — the
 * facts (Status, Role, Team, When, Stack in peri) over the buttons in a
 * column. A fact the project lacks has no row.
 */
export function CasePanel({ project, copy }: CaseFactsProps) {
  const stack = stackLine(project);

  return (
    <aside
      aria-label={copy.case.aboutProject}
      className="mk-glass sticky top-3 hidden w-85 shrink-0 flex-col gap-5.5 self-start rounded-panel p-6 wide:flex"
    >
      <dl className="mk-facts gap-x-5 gap-y-3">
        {project.status && (
          <>
            <dt>{copy.case.status}</dt>
            <dd className="inline-flex items-center gap-2">
              <span className="mk-dot" aria-hidden="true" />
              {copy.status[project.status]}
            </dd>
          </>
        )}
        {project.role && (
          <>
            <dt>{copy.role}</dt>
            <dd>{project.role}</dd>
          </>
        )}
        {project.team && (
          <>
            <dt>{copy.case.team}</dt>
            <dd>{project.team}</dd>
          </>
        )}
        {project.year && (
          <>
            <dt>{copy.when}</dt>
            <dd>{project.year}</dd>
          </>
        )}
        {stack && (
          <>
            <dt>{copy.stack}</dt>
            <dd className="text-peri">{stack}</dd>
          </>
        )}
      </dl>
      <CaseLinks project={project} copy={copy} className="flex-col" />
    </aside>
  );
}
