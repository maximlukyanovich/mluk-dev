import { cn } from "@/shared/lib/cn";

import type { Experience } from "../lib/types";
import { yearsLabel } from "../lib/years";

type ExperienceTimelineProps = {
  experience: readonly Experience[];
  copy: { title: string; now: string };
};

/**
 * Experience on the CV (canvas, CV-A and M-CV): a lime line on the left, a
 * dot per job — filled, with lime years, for the one that goes on — years in
 * a column beside the role, above it on a phone. No jobs, no section.
 */
export function ExperienceTimeline({
  experience,
  copy,
}: ExperienceTimelineProps) {
  if (!experience.length) return null;

  return (
    <section className="pt-14 sm:pt-18" aria-labelledby="experience-h">
      <h2 className="mb-6 font-display text-display-section" id="experience-h">
        {copy.title}
      </h2>
      <ol className="flex flex-col gap-9 border-l-[1.5px] border-lime">
        {experience.map((job) => {
          const now = job.end === null;
          return (
            <li
              key={`${job.start}-${job.company}-${job.role}`}
              data-now={now || undefined}
              className="relative grid gap-x-8 gap-y-1.5 pl-7 before:absolute before:top-1.5 before:-left-1.75 before:size-3 before:rounded-full before:border-[1.5px] before:border-lime before:bg-bg data-now:before:bg-lime sm:grid-cols-[150px_minmax(0,1fr)]"
            >
              <span
                className={cn(
                  "pt-0.75 font-mono text-xs/[1.6]",
                  now ? "text-lime" : "text-muted",
                )}
              >
                {yearsLabel(job, copy.now)}
              </span>
              <div>
                <h3 className="font-display text-display-card">
                  {job.role}{" "}
                  <span className="font-sans font-semibold text-muted">
                    · {job.company}
                  </span>
                </h3>
                <p className="mt-1.5 text-muted">{job.summary}</p>
                {job.stack.length > 0 && (
                  <ul className="mk-tags mt-2.5">
                    {job.stack.map((item, index) => (
                      <li key={`${item}-${index}`} className="mk-tag">
                        <span className="mk-hash">#</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
