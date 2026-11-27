import Link from "next/link";
import { Fragment, type ReactNode } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import type { ChannelId } from "@/shared/lib/site";
import { buttonVariants } from "@/shared/ui/button";
import { JsonLd } from "@/shared/ui/json-ld";

import { getHowIWork } from "../lib/content";
import { howIWorkJsonLd } from "../lib/structured-data";
import type { HowIWorkContent } from "../lib/types";
import { Offer } from "./offer";
import { CanvasIllustration } from "./phase-illustration";
import { PhaseFlow } from "./phase-flow";
import { PhaseSection } from "./phase-section";
import { StepIcon } from "./step-icon";

/**
 * What the page shows from other sections. The route fills them: a feature
 * imports no other feature. Functions pass between server components only.
 */
export type HowIWorkSlots = {
  /** The hero's status line — the CV's availability. */
  eyebrow: string;
  /** The projects done this way, as a ribbon of small cards. */
  ribbon: (slugs: readonly string[]) => ReactNode;
  /** A project named inside a sentence. */
  projectBadge: (slug: string) => ReactNode;
  /** A post's badge, or null while the post does not exist in the locale. */
  post: (slug: string) => ReactNode | null;
  contacts: {
    /** The tiles of `ids` with an address, or null when none has one. */
    tiles: (ids: readonly ChannelId[], className: string) => ReactNode | null;
    /** The contact page's reply time. */
    replies: string;
  };
};

type HowIWorkPageProps = {
  locale: Locale;
  dictionary: Dictionary;
  slots: HowIWorkSlots;
};

const section = "pt-14 sm:pt-18";
const sectionTitle = "font-display text-display-section";

function Hero({
  locale,
  eyebrow,
  lead,
  copy,
}: {
  locale: Locale;
  eyebrow: string;
  lead: string;
  copy: Dictionary["howIWork"];
}) {
  return (
    <header className="pt-9 sm:pt-16">
      <p className="mk-eyebrow">
        <span className="mk-dot" aria-hidden="true" />
        {eyebrow}
      </p>
      <h1 className="mt-4.5 max-w-[980px] font-display text-display-title text-balance">
        {copy.title}
      </h1>
      <p className="mt-4.5 max-w-[720px] text-[18px]/[1.5] text-muted sm:text-lead">
        {lead}
      </p>
      <div className="mt-6.5 flex flex-wrap gap-2.5">
        <Link
          className={buttonVariants({ variant: "primary" })}
          href={localePath(locale, "/contact")}
        >
          {copy.startProject} <span aria-hidden="true">↗</span>
        </Link>
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href={localePath(locale, "/projects")}
        >
          {copy.seeProjects}
        </Link>
      </div>
    </header>
  );
}

function Canvas({ canvas }: { canvas: HowIWorkContent["canvas"] }) {
  return (
    <section className="flex flex-wrap items-center gap-8 pt-12">
      <div className="min-w-0 flex-[1_1_420px]">
        <h2 className={sectionTitle}>{canvas.title}</h2>
        <p className="mt-3.5 max-w-[520px] text-muted">{canvas.text}</p>
      </div>
      <CanvasIllustration label={canvas.label} />
    </section>
  );
}

function Command({
  command,
  badge,
}: {
  command: HowIWorkContent["command"];
  badge: ReactNode;
}) {
  return (
    <section className={section}>
      <div className="mk-callout mt-0 flex-wrap items-center gap-x-8 gap-y-5 rounded-panel p-7">
        <StepIcon
          icon="terminal"
          className="size-14 text-lime [&>svg]:size-6.5"
        />
        <div className="flex-[1_1_420px]">
          <h2 className="font-display text-[21px]/[1.3] font-semibold tracking-[-0.01em]">
            {command.title}
          </h2>
          <p className="mt-2 text-muted">{command.text}</p>
        </div>
        {badge}
      </div>
    </section>
  );
}

function Tools({ tools }: { tools: HowIWorkContent["tools"] }) {
  return (
    <section className={section}>
      <h2 className={sectionTitle}>{tools.title}</h2>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-6">
        {tools.groups.map((group) => (
          <div key={group.label}>
            <h3 className="mb-3 font-mono text-caption text-muted uppercase">
              {group.label}
            </h3>
            <ul className="mk-tags m-0 list-none p-0">
              {group.items.map((item) => (
                <li key={item} className="mk-tag">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Registered({
  registered,
}: {
  registered: HowIWorkContent["registered"];
}) {
  return (
    <section className={`${section} flex flex-wrap items-start gap-8`}>
      <div className="min-w-0 flex-[1_1_420px]">
        <h2 className={sectionTitle}>{registered.title}</h2>
        <p className="mt-3.5 max-w-[520px] text-muted">{registered.text}</p>
      </div>
      <dl className="mk-facts mk-glass min-w-0 flex-[1_1_420px] rounded-panel p-6 text-[14px]">
        {registered.facts.map((fact) => (
          <Fragment key={fact.term}>
            <dt>{fact.term}</dt>
            <dd>{fact.value}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}

/**
 * How I work (canvas, How-K2 and M-How): the hero, the phases as one flow,
 * a section per phase, how the choice is made on a canvas, the start in one
 * command, the tools, the terms of the work, a link to the blog and the
 * offer with the contacts.
 */
export function HowIWorkPage({ locale, dictionary, slots }: HowIWorkPageProps) {
  const content = getHowIWork(locale);
  const copy = dictionary.howIWork;

  return (
    <>
      <JsonLd data={howIWorkJsonLd(locale, copy)} />
      <Hero
        locale={locale}
        eyebrow={slots.eyebrow}
        lead={content.hero.lead}
        copy={copy}
      />
      <div className={section}>
        <PhaseFlow
          phases={content.phases}
          lanes={content.flow.lanes}
          copy={copy}
        />
      </div>
      <div className="mt-12">
        {content.phases.map((phase) => (
          <PhaseSection
            key={phase.id}
            phase={phase}
            copy={copy}
            ribbon={slots.ribbon}
            post={slots.post}
          />
        ))}
      </div>
      <Canvas canvas={content.canvas} />
      <Command
        command={content.command}
        badge={slots.projectBadge(content.command.project)}
      />
      <Tools tools={content.tools} />
      <Registered registered={content.registered} />
      <div className={section}>
        <p className="m-0">
          <Link className="mk-link" href={localePath(locale, "/writing")}>
            {copy.blog} <span aria-hidden="true">→</span>
          </Link>
        </p>
        <Offer
          locale={locale}
          offer={content.offer}
          copy={copy}
          tiles={slots.contacts.tiles}
          replies={slots.contacts.replies}
        />
      </div>
    </>
  );
}
