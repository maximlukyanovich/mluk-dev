import { cacheLife } from "next/cache";

import { vimeoPoster, youtubePoster, type VideoService } from "./embed";

/** How long a lookup waits for the service before it gives up. */
const lookupTimeout = 5000;

async function lookUp(service: VideoService, id: string) {
  const signal = AbortSignal.timeout(lookupTimeout);
  if (service === "youtube") {
    const maxres = await fetch(youtubePoster(id, true), {
      method: "HEAD",
      signal,
    });
    // Only a 404 says the video has no 1280px picture; any other refusal
    // (a rate limit, an outage) is a failed lookup.
    if (!maxres.ok && maxres.status !== 404) {
      throw new Error(`YouTube answered ${maxres.status}`);
    }
    return youtubePoster(id, maxres.ok);
  }
  const page = encodeURIComponent(`https://vimeo.com/${id}`);
  const answer = await fetch(
    `https://vimeo.com/api/oembed.json?url=${page}&width=1280`,
    { signal },
  );
  if (!answer.ok) throw new Error(`oEmbed answered ${answer.status}`);
  return vimeoPoster(await answer.json());
}

/**
 * A video's preview picture, looked up on the service when the page is
 * built and cached for good (`use cache`, `cacheLife("max")`): the reader's
 * browser later gets it through the site's image optimiser, so nothing
 * reaches YouTube or Vimeo before play is pressed. A lookup that fails or
 * times out is logged and gives no picture — the facade shows its plain
 * frame — for an hour only (`cacheLife("hours")`): the page then
 * revalidates and asks again.
 */
export async function videoPoster(
  service: VideoService,
  id: string,
): Promise<string | null> {
  "use cache";

  try {
    const picture = await lookUp(service, id);
    cacheLife("max");
    return picture;
  } catch (error) {
    console.warn(`video poster for ${service} ${id}:`, error);
    cacheLife("hours");
    return null;
  }
}
