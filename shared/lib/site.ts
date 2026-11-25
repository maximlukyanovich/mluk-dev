/** The production origin: `metadataBase`, the sitemap and robots.txt. */
export const siteUrl = "https://mluk.dev";

/**
 * The site owner's JSON-LD `@id`: the Person on the home page and the author
 * of every post are one entity, in both locales.
 */
export const personId = `${siteUrl}/#person`;

/**
 * The owner's public address — the CV's PDF header and the contact channels.
 * A placeholder until the address is chosen (a domain alias; the personal
 * mailbox is not published): `mailHref` gives it no link, so the email
 * channel is hidden. The PDF header prints the value as plain text whatever
 * it holds, so a real address is no link there either. A real address shows
 * the email channel on its own, but the PDF header prints it too: run
 * `pnpm cv:pdf` in the same commit — `cv-pdf.test` hashes only
 * `content/cv/`, so a stale PDF stays green.
 */
export const ownerEmail = "[email]";

/** A `mailto:` link to `address`, or `null` while it is a `[placeholder]`. */
export function mailHref(address: string): string | null {
  return /^\[.*\]$/.test(address) ? null : `mailto:${address}`;
}

export type ChannelId =
  "email" | "telegram" | "whatsapp" | "linkedin" | "github" | "instagram";

/** A way to reach the owner; `href` is `null` until it has an address. */
export type Channel = {
  name: string;
  handle: string;
  href: string | null;
};

/**
 * The owner's channels — one source for the contact page, the home page's
 * contact strip, the Person's `sameAs` and the PDF header. A channel without
 * an address is hidden (owner, 2026-11-23); the email takes its address
 * from `ownerEmail`.
 */
export const channels = {
  email: { name: "Email", handle: ownerEmail, href: mailHref(ownerEmail) },
  telegram: {
    name: "Telegram",
    handle: "@MaximLukyanovich",
    href: "https://t.me/MaximLukyanovich",
  },
  whatsapp: { name: "WhatsApp", handle: "[+000 000 00 00]", href: null },
  linkedin: {
    name: "LinkedIn",
    handle: "in/mlukyanovich",
    href: "https://www.linkedin.com/in/mlukyanovich",
  },
  github: {
    name: "GitHub",
    handle: "@maximlukyanovich",
    href: "https://github.com/maximlukyanovich",
  },
  instagram: { name: "Instagram", handle: "[@handle]", href: null },
} as const satisfies Record<ChannelId, Channel>;

/** The owner's profiles elsewhere — the Person's `sameAs`, GitHub first. */
export const profileLinks = [
  channels.github.href,
  channels.linkedin.href,
  channels.telegram.href,
] as const;
