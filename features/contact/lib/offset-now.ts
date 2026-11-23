import { cacheLife } from "next/cache";

import { utcOffsetLabel } from "./time";

/**
 * The zone's UTC offset when the page is built, kept with the prerendered
 * page (`use cache`): reading the clock outside a cache would make the page
 * dynamic. `cacheLife("max")` revalidates within 30 days — Tbilisi has no
 * summer time, and a zone that has one is right again after the next build.
 */
export async function utcOffsetNow(timeZone: string): Promise<string> {
  "use cache";
  cacheLife("max");
  return utcOffsetLabel(timeZone, new Date());
}
