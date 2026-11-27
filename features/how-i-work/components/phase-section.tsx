import { Check, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";

import { twoDigits } from "../lib/number";
import type { Phase } from "../lib/types";
import { Lane } from "./lane";
import { PhaseIllustration } from "./phase-illustration";
import { StepIcon } from "./step-icon";

type PhaseSectionProps = {
  phase: Phase;
  copy: Dictionary["howIWork"];
  /** The projects done this way, for a phase with examples. */
  ribbon: (slugs: readonly string[]) => ReactNode;
  /** The post's badge, or null while it does not exist in the locale. */
  post: (slug: string) => ReactNode | null;
};

/** The sentence around the post's badge — none without the badge. */
function PostLine({ text, badge }: { text: string; badge: ReactNode }) {
  const [before, after] = text.split("{post}");
  return (
    <p className="m-0 text-muted">
      {before}
      {badge}
      {after}
    </p>
  );
}

/**
 * One phase (How-K2, `.ph-sec`): the number, title, loop and outcome on the
 * left — pinned under the header from `split` on, moving with it as the
 * header hides and comes back — and on the right the drawing, the steps, the
 * parallel work, the projects and the post. On a phone (M-How) it is one
 * column and nothing is pinned.
 */
export function PhaseSection({ phase, copy, ribbon, post }: PhaseSectionProps) {
  const badge = phase.post ? post(phase.post.slug) : null;

  return (
    <section
      id={phase.id}
      aria-labelledby={`${phase.id}-title`}
      className="grid gap-x-12 gap-y-6 border-t border-line py-12 split:grid-cols-[280px_minmax(0,1fr)]"
    >
      <header className="self-start transition-[top] duration-(--duration-base) ease-[ease] split:sticky split:top-[calc(--spacing(6)+var(--header-offset,0px))]">
        <span
          className="inline-flex size-10 items-center justify-center rounded-full bg-lime font-mono text-meta font-semibold text-on-lime"
          aria-hidden="true"
        >
          {twoDigits(phase.number)}
        </span>
        <h2
          id={`${phase.id}-title`}
          className="mt-3.5 font-display text-[30px]/[1.1] font-semibold tracking-[-0.02em]"
        >
          {phase.title}
        </h2>
        <p className="mt-2.5 text-muted">{phase.summary}</p>
        <div className="mt-3.5 flex flex-col items-start gap-2">
          {phase.loop && (
            <span className="mk-loop">
              <RefreshCw aria-hidden="true" strokeWidth={1.8} />
              <span className="sr-only">{`${copy.repeats}: `}</span>
              {phase.loop}
            </span>
          )}
          <span className="mk-done">
            <Check aria-hidden="true" strokeWidth={1.8} />
            <span className="sr-only">{`${copy.outcome}: `}</span>
            {phase.outcome}
          </span>
        </div>
      </header>
      <div className="flex min-w-0 flex-col gap-6">
        <PhaseIllustration illustration={phase.illustration} />
        <ul className="mk-steps">
          {phase.steps.map((step) => (
            <li key={step.title}>
              <StepIcon icon={step.icon} />
              <div>
                <h3 className="mk-step-title">{step.title}</h3>
                <p className="mk-step-text">{step.text}</p>
              </div>
            </li>
          ))}
        </ul>
        {phase.lanes.length > 0 && (
          <ul className="mk-tags m-0 list-none p-0">
            {phase.lanes.map((lane) => (
              <Lane key={lane} label={lane} prefix={copy.inParallel} />
            ))}
          </ul>
        )}
        {phase.examples && ribbon(phase.examples)}
        {phase.post && badge && (
          <PostLine text={phase.post.text} badge={badge} />
        )}
      </div>
    </section>
  );
}
