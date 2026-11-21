import { cacheLife } from "next/cache";

import { vimeoPoster, youtubePoster, type VideoService } from "./embed";

/**
 * A video's preview picture, looked up on the service when the page is
 * built and cached for good (`use cache`, `cacheLife("max")`): the reader's
 * browser later gets it through the site's image optimiser, so nothing
 * reaches YouTube or Vimeo before play is pressed. A lookup that fails
 * gives no picture, and the facade shows its plain frame.
 */
export async function videoPoster(
  service: VideoService,
  id: string,
): Promise<string | null> {
  "use cache";
  cacheLife("max");

  try {
    if (service === "youtube") {
      const maxres = await fetch(youtubePoster(id, true), {
        method: "HEAD",
      });
      return youtubePoster(id, maxres.ok);
    }
    const page = encodeURIComponent(`https://vimeo.com/${id}`);
    const answer = await fetch(
      `https://vimeo.com/api/oembed.json?url=${page}&width=1280`,
    );
    return answer.ok ? vimeoPoster(await answer.json()) : null;
  } catch {
    return null;
  }
}
