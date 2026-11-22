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

/**
 * YouTube's preview: the 1280px picture when the video has one, else the
 * 480px one every video has — 4:3 with black bands, which the 16:9 frame
 * crops away (`object-fit: cover`).
 */
export function youtubePoster(id: string, hasMaxres: boolean): string {
  const name = hasMaxres ? "maxresdefault" : "hqdefault";
  return `https://i.ytimg.com/vi/${id}/${name}.jpg`;
}

/**
 * Vimeo's preview from its oEmbed answer, or null when the answer has none
 * or names something other than an https picture under `/video/` on Vimeo's
 * CDN, on its default port — the one image path next.config.ts allows. The
 * query string (`?region=us`) is dropped: the picture does not need it, and
 * that path names no query.
 */
export function vimeoPoster(oembed: unknown): string | null {
  if (typeof oembed !== "object" || oembed === null) return null;
  const { thumbnail_url } = oembed as { thumbnail_url?: unknown };
  if (typeof thumbnail_url !== "string" || !URL.canParse(thumbnail_url)) {
    return null;
  }
  const url = new URL(thumbnail_url);
  return url.protocol === "https:" &&
    url.hostname === "i.vimeocdn.com" &&
    url.port === "" &&
    url.pathname.startsWith("/video/")
    ? url.origin + url.pathname
    : null;
}
