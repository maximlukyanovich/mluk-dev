import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { buttonVariants } from "@/shared/ui/button";
import { ExternalLink } from "@/shared/ui/external-link";

import type { Collaborator, Project } from "../lib/types";

export type ProjectCardCopy = Pick<
  Dictionary["projects"],
  | "featured"
  | "screenshot"
  | "role"
  | "stack"
  | "when"
  | "live"
  | "code"
  | "feat"
> & { newTab: string };

type ProjectCardProps = {
  project: Project;
  /** `row`: the kit's rows view, a compact list on a phone. */
  variant: "grid" | "row";
  /** The right side of the meta row: "Personal · Product", or the status. */
  meta: string;
  /** `h2` on the projects page, `h3` under the home page's section title. */
  heading: "h2" | "h3";
  /** The card's place in the list, for the reveal's stagger. */
  index: number;
  /** The case page; null leaves the card without a link. */
  href: string | null;
  /**
   * The card is in the first screen (the projects page's first row): its
   * cover can be the Largest Contentful Paint, so it is not lazy.
   */
  eager?: boolean;
  copy: ProjectCardCopy;
};

/**
 * The picture's rendered width, measured: a column of the grid — three from
 * 1004px (370px in the 1200px container), two from 680px, one below; in the
 * rows view the kit's 440px slot, a 104px thumbnail in the phone's compact
 * row.
 */
const coverSizes = {
  grid: "(min-width: 1256px) 370px, (min-width: 1004px) 30vw, (min-width: 680px) 46vw, 100vw",
  row: "(max-width: 640px) 104px, 440px",
};

/** A project's position as the card shows it: "01". */
export const projectNumber = (n: number) => String(n).padStart(2, "0");

function Feat({ feat, copy }: { feat: Collaborator; copy: ProjectCardCopy }) {
  const person = (
    <>
      {feat.avatar && (
        <Image
          className="mk-avatar"
          src={feat.avatar}
          alt=""
          width={20}
          height={20}
        />
      )}
      {feat.name}
    </>
  );
  return (
    <span className="mk-feat">
      {copy.feat}{" "}
      {feat.href ? (
        <ExternalLink href={feat.href} newTab={copy.newTab}>
          {person}
        </ExternalLink>
      ) : (
        <span className="inline-flex items-center gap-1.5">{person}</span>
      )}
    </span>
  );
}

/**
 * A project in the kit's Card (canvas, Work-D, M-Work and Main): the number
 * with the featured star, the meta, the screenshot placeholder, the title,
 * the description, the stack and the co-author. The rows view adds the
 * facts and the Live / Code buttons, and on a phone becomes the kit's
 * compact row. With a case page the title is the kit's stretched link over
 * the whole card — the co-author and the buttons stay links of their own
 * above it; without one the title is text and the kit keeps the hover marks
 * off the card. The cover replaces the placeholder; its `alt` is empty, as
 * the title beside it names the project.
 */
export function ProjectCard({
  project,
  variant,
  meta,
  heading: Heading,
  index,
  href,
  eager = false,
  copy,
}: ProjectCardProps) {
  const row = variant === "row";
  const stack = project.stack.join(" · ");
  const links = [
    { href: project.links.live, label: copy.live },
    { href: project.links.code, label: copy.code },
  ].filter((link): link is { href: string; label: string } => !!link.href);

  const metaRow = (
    <span className="mk-card-meta">
      <span className="inline-flex items-center gap-2">
        <span className="mk-card-no">{projectNumber(project.number)}</span>
        {project.featured && (
          <span className="mk-star">
            <Star fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
            <span className="mk-sr">{copy.featured}</span>
          </span>
        )}
      </span>
      <span>{meta}</span>
    </span>
  );
  const media = project.cover ? (
    <span className="mk-card-media relative overflow-hidden">
      <Image
        src={project.cover}
        alt=""
        fill
        className="object-cover"
        sizes={coverSizes[variant]}
        loading={eager ? "eager" : "lazy"}
      />
    </span>
  ) : (
    <span className="mk-card-media text-center" aria-hidden="true">
      {copy.screenshot}
    </span>
  );
  const title = (
    <Heading className="mk-card-title">
      {href ? (
        <Link className="mk-stretch" href={href}>
          {project.name}
        </Link>
      ) : (
        project.name
      )}
    </Heading>
  );
  const text = <p className="mk-card-text">{project.description}</p>;
  // The stagger index is per card: no utility can carry it.
  const style = { "--i": index } as CSSProperties;

  if (!row) {
    return (
      <article className="mk-card mk-glass" style={style}>
        {metaRow}
        {media}
        {title}
        {text}
        <span className="mk-card-stack">{stack}</span>
        {project.feat && <Feat feat={project.feat} copy={copy} />}
      </article>
    );
  }

  return (
    <article className="mk-card mk-glass mk-card-row" style={style}>
      {media}
      <div className="mk-card-body">
        {metaRow}
        {title}
        {text}
        <dl className="mk-facts">
          <dt>{copy.role}</dt>
          <dd>{project.role}</dd>
          <dt>{copy.stack}</dt>
          <dd className="text-peri">{stack}</dd>
          <dt>{copy.when}</dt>
          <dd>{project.year}</dd>
        </dl>
        {/* The compact row on a phone shows the stack instead of the facts. */}
        <span className="mk-card-stack sm:hidden">{stack}</span>
        {project.feat && <Feat feat={project.feat} copy={copy} />}
        {links.length > 0 && (
          // The kit hides `.mk-card-above` in the compact row: a display
          // utility on it would bring the buttons back, so the row is inside.
          <div className="mk-card-above">
            <div className="flex flex-wrap gap-2.5">
              {links.map((link) => (
                <ExternalLink
                  key={link.label}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                  })}
                  href={link.href}
                  newTab={copy.newTab}
                >
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
