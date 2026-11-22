/** The production origin: `metadataBase`, the sitemap and robots.txt. */
export const siteUrl = "https://mluk.dev";

/**
 * The site owner's JSON-LD `@id`: the Person on the home page and the author
 * of every post are one entity, in both locales.
 */
export const personId = `${siteUrl}/#person`;

/** The owner's profiles elsewhere — the Person's `sameAs`. */
export const profileLinks = [
  "https://github.com/maximlukyanovich",
  "https://www.linkedin.com/in/mlukyanovich",
  "https://t.me/MaximLukyanovich",
] as const;
