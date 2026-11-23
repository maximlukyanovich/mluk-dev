import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { ExternalLink } from "@/shared/ui/external-link";

import { visibleChannels } from "../lib/channels";

type ContactStripProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * Contact on the home page (canvas, Main and M-Home): the title, a link per
 * channel and the email as the primary button — a pill on a wide screen, a
 * panel on a phone. The button shows only once the email has an address;
 * until then the pill keeps even padding at both ends.
 */
export function ContactStrip({ locale, dictionary }: ContactStripProps) {
  const shown = visibleChannels(locale);
  const email = shown.find(({ id }) => id === "email");
  const links = shown.filter(({ id }) => id !== "email");
  const copy = dictionary.contact;

  return (
    <section
      className={cn(
        "mk-glass mt-14 flex flex-col items-start gap-3.5 rounded-panel p-6",
        "sm:mt-20 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:rounded-pill sm:py-3 sm:pl-7",
        email ? "sm:pr-3" : "sm:pr-7",
      )}
      aria-labelledby="home-contact-h"
    >
      <h2
        className="font-display text-[22px]/[1.3] font-semibold"
        id="home-contact-h"
      >
        {copy.title}
      </h2>
      {links.length > 0 && (
        <ul
          className="flex flex-wrap gap-x-5 gap-y-2"
          aria-label={copy.channels}
        >
          {links.map((channel) => (
            <li key={channel.id}>
              <ExternalLink
                className="mk-link"
                href={channel.href}
                newTab={dictionary.site.newTab}
              >
                {channel.name}
              </ExternalLink>
            </li>
          ))}
        </ul>
      )}
      {email && (
        <a className={buttonVariants({ variant: "primary" })} href={email.href}>
          {email.handle}
        </a>
      )}
    </section>
  );
}
