import type { Experience } from "./types";

/**
 * The years of a job: "2020 — 2023", "2023 — NOW" while it goes on (`now`
 * comes from the dictionary), a single year when it began and ended in it.
 */
export function yearsLabel(
  { start, end }: Pick<Experience, "start" | "end">,
  now: string,
): string {
  if (end === start) return String(start);
  return `${start} — ${end ?? now}`;
}
