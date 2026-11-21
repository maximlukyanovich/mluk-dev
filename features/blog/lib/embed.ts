/** The video services a post can embed (kit Embed: no files of our own). */
export type VideoService = "youtube" | "vimeo";

const idPattern: Record<VideoService, RegExp> = {
  youtube: /^[\w-]{11}$/,
  vimeo: /^\d+$/,
};

/**
 * The player and the page of a video. YouTube plays from its no-cookie
 * domain and Vimeo with `dnt=1`; both autoplay, since the player loads only
 * when the reader presses play. A malformed id fails the build, where the
 * post is rendered, instead of shipping a broken player.
 */
export function videoUrls(
  service: VideoService,
  id: string,
): { player: string; page: string } {
  if (!idPattern[service].test(id)) {
    throw new Error(`"${id}" is not a ${service} video id`);
  }
  return service === "youtube"
    ? {
        player: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`,
        page: `https://www.youtube.com/watch?v=${id}`,
      }
    : {
        player: `https://player.vimeo.com/video/${id}?dnt=1&autoplay=1`,
        page: `https://vimeo.com/${id}`,
      };
}
