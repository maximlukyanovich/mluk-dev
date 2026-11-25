"use client";

import { Check, LayoutGrid, Rows3 } from "lucide-react";
import { useReducer, useRef } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import { plural } from "@/shared/i18n/plural";
import { buttonVariants } from "@/shared/ui/button";
import { FilterMenu } from "@/shared/ui/filter-menu";

import { caseHref } from "../lib/case-path";
import { featuredFirst, filterProjects } from "../lib/filter";
import {
  owns,
  types,
  type Own,
  type Project,
  type ProjectFilter,
  type ProjectType,
} from "../lib/types";
import { setView, useView, type View } from "../lib/view-store";
import { ProjectCard } from "./project-card";

type State = ProjectFilter & {
  /** Counts every change, so the list's reveal runs again on each. */
  run: number;
};

type Action =
  | { kind: "own"; value: Own | "all" }
  | { kind: "type"; value: ProjectType | "all" }
  | { kind: "reset" }
  | { kind: "view" };

/** Every action bumps `run`: no change of the list can skip the reveal. */
function reduce(state: State, action: Action): State {
  const run = state.run + 1;
  switch (action.kind) {
    case "own":
      return { ...state, own: action.value, run };
    case "type":
      return { ...state, type: action.value, run };
    case "reset":
      return { own: "all", type: "all", run };
    case "view":
      return { ...state, run };
  }
}

type ProjectsViewProps = {
  projects: readonly Project[];
  locale: Locale;
  copy: Dictionary["projects"];
  newTab: string;
};

/**
 * The projects with their toolbar (canvas, Work-D and M-Work): Commercial /
 * Personal, the type — chips, on a phone the kit's Filter —, the count and
 * the view. Featured projects come first in any filter. Each change makes
 * the list rise again (`.mk-reveal`, `is-a` ⇄ `is-b`). The server renders
 * every project in the grid; the filter and the view survive the page
 * being hidden (`<Activity>`) — they are the visitor's choice, not
 * transient UI; only the Filter's list closes.
 */
export function ProjectsView({
  projects,
  locale,
  copy,
  newTab,
}: ProjectsViewProps) {
  const [state, dispatch] = useReducer(reduce, {
    own: "all",
    type: "all",
    run: 0,
  });
  const view = useView();
  const firstOwn = useRef<HTMLButtonElement>(null);

  const shown = featuredFirst(filterProjects(projects, state));
  const ownOptions: [Own | "all", string][] = [
    ["all", copy.all],
    ...owns.map((own): [Own, string] => [own, copy.filterOwn[own]]),
  ];
  const typeOptions: [ProjectType | "all", string][] = [
    ["all", copy.allTypes],
    ...types.map((type): [ProjectType, string] => [
      type,
      copy.filterType[type],
    ]),
  ];
  const typeValue = typeOptions.find(([value]) => value === state.type)![1];
  const views: [View, string, typeof LayoutGrid][] = [
    ["grid", copy.grid, LayoutGrid],
    ["rows", copy.rows, Rows3],
  ];

  const chooseView = (next: View) => {
    if (next === view) return;
    setView(next);
    dispatch({ kind: "view" });
  };
  const showAll = () => {
    dispatch({ kind: "reset" });
    // The button goes with the empty state; focus moves to "All".
    firstOwn.current?.focus();
  };

  const reveal = state.run % 2 ? "is-b" : "is-a";
  const cardCopy = { ...copy, newTab };

  return (
    <>
      <div className="mk-toolbar mt-8">
        <div className="mk-seg" role="group" aria-label={copy.ownLabel}>
          {ownOptions.map(([value, label], index) => (
            <button
              key={value}
              ref={index === 0 ? firstOwn : undefined}
              type="button"
              aria-pressed={state.own === value}
              onClick={() => dispatch({ kind: "own", value })}
            >
              {label}
            </button>
          ))}
        </div>
        <div
          className="mk-tags mk-filter-chips"
          role="group"
          aria-label={copy.typeLabel}
        >
          {typeOptions.map(([value, label]) => (
            <button
              key={value}
              type="button"
              className="mk-chip"
              aria-pressed={state.type === value}
              onClick={() => dispatch({ kind: "type", value })}
            >
              {label}
            </button>
          ))}
        </div>
        {/* On a phone: the segment and the view in the first line, the
            Filter in the second, its list as wide as the row, the count
            under it (canvas, M-Work). */}
        <FilterMenu
          as="group"
          label={copy.typeLabel}
          button={copy.typeButton}
          value={typeValue}
          className="order-3 basis-full"
        >
          {(choose) =>
            typeOptions.map(([value, label]) => (
              <li key={value}>
                <button
                  type="button"
                  aria-pressed={state.type === value}
                  onClick={() => {
                    dispatch({ kind: "type", value });
                    choose();
                  }}
                >
                  {label}
                  <Check
                    className="mk-filter-check"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              </li>
            ))
          }
        </FilterMenu>
        <div className="mk-toolbar-end max-sm:contents">
          <span
            className="mk-note max-sm:order-4 max-sm:basis-full"
            aria-live="polite"
          >
            {plural(locale, shown.length, copy.count)}
          </span>
          <div
            className="mk-seg mk-seg-quiet max-sm:order-2 max-sm:ml-auto"
            role="group"
            aria-label={copy.viewLabel}
          >
            {views.map(([value, label, Icon]) => (
              <button
                key={value}
                type="button"
                aria-pressed={view === value}
                aria-label={label}
                title={label}
                onClick={() => chooseView(value)}
              >
                <Icon strokeWidth={2} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="mk-empty mk-glass mt-8">
          <p>{copy.empty}</p>
          <button
            type="button"
            className={buttonVariants({ variant: "secondary", size: "sm" })}
            onClick={showAll}
          >
            {copy.showAll}
          </button>
        </div>
      ) : (
        <div
          className={
            view === "grid"
              ? `mk-cards mk-reveal mt-8 max-sm:mt-6 ${reveal}`
              : `mk-reveal mt-8 flex flex-col gap-6 max-sm:mt-6 max-sm:gap-3 ${reveal}`
          }
        >
          {shown.map((project, index) => (
            <ProjectCard
              key={project.slug}
              project={project}
              variant={view === "grid" ? "grid" : "row"}
              meta={`${copy.own[project.own]} · ${copy.type[project.type]}`}
              heading="h2"
              index={index}
              href={caseHref(locale, project)}
              // The grid's first row, or the first rows of the list.
              eager={index < 3}
              copy={cardCopy}
            />
          ))}
        </div>
      )}
    </>
  );
}
