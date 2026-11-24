import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import { JsonLd } from "@/shared/ui/json-ld";

import { visibleChannels } from "../lib/channels";
import { getContact } from "../lib/content";
import { utcOffsetNow } from "../lib/offset-now";
import { contactPageJsonLd } from "../lib/structured-data";
import { ChannelTile } from "./channel-tile";
import { LocalTime } from "./local-time";

type ContactPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * The contact page (canvas, Contact-C and M-Contact): the status eyebrow,
 * the title and lead, a tile per channel that has an address, and the
 * status row — a pill on a wide screen, a panel on a phone.
 */
export async function ContactPage({ locale, dictionary }: ContactPageProps) {
  const contact = getContact(locale);
  const copy = dictionary.contact;
  const offset = await utcOffsetNow(contact.timeZone);
  const within = copy.repliesWithin.replace("{replies}", contact.replies);

  return (
    <>
      <JsonLd data={contactPageJsonLd(locale)} />
      <header className="max-w-[860px] pt-9 sm:pt-14">
        <p className="mk-eyebrow">
          <span className="mk-dot" />
          {copy.eyebrow.replace("{replies}", contact.replies)}
        </p>
        <h1 className="mt-4 font-display text-display-title text-balance">
          {copy.title}
        </h1>
        <p className="mt-4 text-lead text-muted">{copy.lead}</p>
      </header>
      <ul className="mk-cards mt-7 sm:mt-10" aria-label={copy.channels}>
        {visibleChannels(locale).map((channel) => (
          <li key={channel.id}>
            <ChannelTile channel={channel} newTab={dictionary.site.newTab} />
          </li>
        ))}
      </ul>
      <ul className="mk-status-row mk-glass mt-8" aria-label={copy.status}>
        <li className="mk-status-row-lead">
          <span className="mk-dot" />
          {copy.openTo.replace("{work}", contact.openTo)}
        </li>
        <li>
          <span className="mk-status-row-label">{copy.timeZone}</span> {offset}
        </li>
        <li>
          <span className="mk-status-row-label">{copy.localTime}</span>{" "}
          <LocalTime timeZone={contact.timeZone} locale={locale} />
        </li>
        <li>
          <span className="mk-status-row-label">{copy.replies}</span> {within}
        </li>
      </ul>
    </>
  );
}
