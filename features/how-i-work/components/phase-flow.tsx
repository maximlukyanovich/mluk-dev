import { Check, RefreshCw } from "lucide-react";

import type { Dictionary } from "@/shared/i18n/dictionaries";

import { twoDigits } from "../lib/number";
import type { Column, FlowLane, Phase } from "../lib/types";
import { Lane } from "./lane";

/*
 * Literal classes, so Tailwind sees every one: a lane from column `from` to
 * column `to` takes `start[from]` and `end[to]`. Below `split` every lane
 * spans the one column.
 */
const start: Record<Column, string> = {
  1: "split:col-start-1",
  2: "split:col-start-2",
  3: "split:col-start-3",
  4: "split:col-start-4",
};
const end: Record<Column, string> = {
  1: "split:col-end-2",
  2: "split:col-end-3",
  3: "split:col-end-4",
  4: "split:col-end-5",
};

type PhaseFlowProps = {
  phases: Phase[];
  lanes: FlowLane[];
  copy: Dictionary["howIWork"];
};

/**
 * The phases as one flow (How-K2, `.pf`): four nodes with what repeats in
 * each and what each hands on, and under them the work that runs beside
 * them. On a phone (M-How) the nodes stand in a column with arrows down.
 * The loop and the outcome wrap inside a node, unlike the kit's one-line
 * pills: a four-column node is narrower than a loop (owner, 2026-11-27).
 */
export function PhaseFlow({ phases, lanes, copy }: PhaseFlowProps) {
  return (
    <div>
      <ol className="grid gap-3 split:grid-cols-4">
        {phases.map((phase) => (
          <li
            key={phase.id}
            className="mk-glass relative flex flex-col gap-2.5 rounded-card px-4.5 pt-4.5 pb-4 not-first:before:absolute not-first:before:-top-3.5 not-first:before:left-1/2 not-first:before:-translate-x-1/2 not-first:before:font-mono not-first:before:text-muted not-first:before:content-['↓'_/_''] split:not-first:before:top-6.5 split:not-first:before:-left-3 split:not-first:before:content-['→'_/_'']"
          >
            <span className="mk-card-meta p-0">
              <span className="mk-card-no">{twoDigits(phase.number)}</span>
              {phase.loop && (
                <span className="mk-loop">
                  <RefreshCw aria-hidden="true" strokeWidth={1.8} />
                  {copy.repeats}
                </span>
              )}
            </span>
            <span className="font-display text-display-card">
              {phase.title}
            </span>
            <span className="text-meta text-muted">
              {phase.steps.map((step) => step.title).join(" · ")}
            </span>
            {phase.loop && (
              <span className="mk-loop whitespace-normal">
                <RefreshCw aria-hidden="true" strokeWidth={1.8} />
                {phase.loop}
              </span>
            )}
            <span className="mk-done self-start whitespace-normal">
              <Check aria-hidden="true" strokeWidth={1.8} />
              <span className="sr-only">{`${copy.outcome}: `}</span>
              {phase.outcome}
            </span>
          </li>
        ))}
      </ol>
      <ul className="mt-2.5 grid gap-x-3 gap-y-1.5 split:grid-cols-4">
        {lanes.map((lane, index) => (
          <Lane
            key={lane.label}
            label={lane.label}
            prefix={copy.inParallel}
            showPrefix={index === 0}
            className={`col-span-full ${start[lane.from]} ${end[lane.to]}`}
          />
        ))}
      </ul>
    </div>
  );
}
