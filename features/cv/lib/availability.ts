import type { Dictionary } from "@/shared/i18n/dictionaries";

import type { Profile } from "./types";

/**
 * The status eyebrow over a page's title: "Open to work · Minsk", or the
 * city alone while the profile is not open to work. One source for the CV
 * page and How I work.
 */
export function availability(
  profile: Pick<Profile, "openToWork" | "city">,
  words: Pick<Dictionary["home"], "openToWork">,
): string {
  return profile.openToWork
    ? `${words.openToWork} · ${profile.city}`
    : profile.city;
}
