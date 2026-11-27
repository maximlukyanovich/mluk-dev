import Link from "next/link";
import type { ReactNode } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import type { ChannelId } from "@/shared/lib/site";

import type { HowIWorkContent } from "../lib/types";

const number = (n: number) => String(n).padStart(2, "0");

/** The kinds of site: How-K2's three cards, 240px at the least. */
const kindsGrid = "grid-cols-[repeat(auto-fit,minmax(240px,1fr))]";

/*
 * The tiles keep the kinds' columns while fewer channels have an address:
 * a track is never narrower than a third of the row (two 24px gaps), and
 * `auto-fill` keeps the empty ones, so a lone tile stands under the first
 * card instead of filling the panel.
 */
const tilesGrid =
  "grid-cols-[repeat(auto-fill,minmax(max(240px,calc((100%-48px)/3)),1fr))]";

type OfferProps = {
  locale: Locale;
  offer: HowIWorkContent["offer"];
  copy: Dictionary["howIWork"];
  /**
   * The channel tiles of `ids` that have an address, in the grid class it is
   * given; null when none has one, and the list is left out.
   */
  tiles: (ids: readonly ChannelId[], className: string) => ReactNode | null;
  /** The contact page's reply time. */
  replies: string;
};

/**
 * "Want a site like this one?" at the end of the page (How-K2): the kinds of
 * site as cards that are not links, the channel tiles and the reply line.
 */
export function Offer({ locale, offer, copy, tiles, replies }: OfferProps) {
  return (
    <section
      aria-labelledby="offer-title"
      className="mk-glass mt-6 flex flex-col gap-6 rounded-panel p-7"
    >
      <div>
        <h2 id="offer-title" className="font-display text-display-section">
          {offer.title}
        </h2>
        <p className="mt-3.5 max-w-[680px] text-muted">{offer.text}</p>
      </div>
      <ul className={`mk-cards ${kindsGrid}`}>
        {offer.kinds.map((kind, index) => (
          <li
            key={kind.title}
            className="mk-card gap-2 border border-line bg-bg p-4.5"
          >
            <span className="mk-card-meta p-0">
              <span className="mk-card-no">{number(index + 1)}</span>
              <span>{kind.meta}</span>
            </span>
            <h3 className="mt-1.5 font-display text-display-card">
              {kind.title}
            </h3>
            <p className="m-0 text-meta text-muted">{kind.text}</p>
          </li>
        ))}
      </ul>
      {tiles(offer.channels, tilesGrid)}
      <p className="m-0 font-mono text-meta text-muted">
        {offer.reply.replace("{replies}", replies)}{" "}
        <Link className="mk-link" href={localePath(locale, "/contact")}>
          {copy.allContacts} <span aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}
