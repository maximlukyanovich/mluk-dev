import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { cn } from "@/shared/lib/cn";

import { cvPdfPath } from "../lib/pdf";
import type { Experience } from "../lib/types";
import { yearsLabel } from "../lib/years";

/** Jobs the home page shows (canvas, Main and M-Home). */
const stripCount = 3;

type ExperienceStripProps = {
  locale: Locale;
  experience: readonly Experience[];
  copy: Dictionary["cv"];
};

/**
 * Experience on the home page (canvas, Main and M-Home): the section title
 * with "Full CV →" and "PDF ↓", then the first jobs on a lime line — across
 * the page from `sm` up, down the left edge below it, as on the CV. A dot
 * per job, filled with lime years for the one that goes on. No jobs, no
 * section.
 */
export function ExperienceStrip({
  locale,
  experience,
  copy,
}: ExperienceStripProps) {
  const jobs = experience.slice(0, stripCount);
  if (!jobs.length) return null;

  return (
    <section className="pt-14 sm:pt-18" aria-labelledby="home-experience-h">
      <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
        <h2
          className="font-display text-display-section"
          id="home-experience-h"
        >
          {copy.experience}
        </h2>
        <span className="flex flex-wrap gap-x-5 gap-y-2">
          <Link className="mk-link" href={localePath(locale, "/cv")}>
            {copy.fullCv} <span aria-hidden="true">→</span>
          </Link>
          <a className="mk-link" href={cvPdfPath(locale)} download>
            {copy.pdf} <span aria-hidden="true">↓</span>
          </a>
        </span>
      </div>
      <ol className="ml-1.5 grid grid-cols-[minmax(0,1fr)] gap-6 border-l-[1.5px] border-lime sm:ml-0 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] sm:gap-0 sm:border-t-[1.5px] sm:border-l-0">
        {jobs.map((job) => {
          const now = job.end === null;
          return (
            <li
              key={`${job.start}-${job.company}-${job.role}`}
              data-now={now || undefined}
              className="relative pl-6 before:absolute before:top-1.25 before:-left-1.75 before:size-3 before:rounded-full before:border-[1.5px] before:border-lime before:bg-bg data-now:before:bg-lime sm:pt-5.5 sm:pr-4 sm:pl-0 sm:before:-top-1.75 sm:before:left-0"
            >
              <span
                className={cn(
                  "block font-mono text-xs/[1.6]",
                  now ? "text-lime" : "text-muted",
                )}
              >
                {yearsLabel(job, copy.now)}
              </span>
              <h3 className="mt-1.5 font-display text-display-card">
                {job.role}
              </h3>
              <p className="text-muted">{job.company}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
