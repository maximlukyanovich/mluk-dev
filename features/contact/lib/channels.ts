import type { Locale } from "@/shared/i18n/locales";
import { channels, type Channel, type ChannelId } from "@/shared/lib/site";

import { getContact } from "./content";
import type { ChannelSource, VisibleChannel } from "./types";

/**
 * Joins the content's tiles with the channels' addresses, in the content's
 * order. A channel without an address is left out (owner, 2026-11-23), and
 * the tiles are numbered among those shown. An id with no channel throws, so
 * the build fails instead of showing an empty tile.
 */
export function joinChannels(
  source: readonly ChannelSource[],
  known: Readonly<Record<ChannelId, Channel>>,
): VisibleChannel[] {
  const shown: VisibleChannel[] = [];
  for (const { id, purpose, action } of source) {
    if (!Object.hasOwn(known, id)) {
      throw new Error(
        `Unknown contact channel "${id}"; expected one of ${Object.keys(known).join(", ")}`,
      );
    }
    const { name, handle, href } = known[id as ChannelId];
    if (href === null) continue;
    shown.push({
      id: id as ChannelId,
      number: shown.length + 1,
      name,
      handle,
      href,
      purpose,
      action,
    });
  }
  return shown;
}

/** The channel tiles of `locale` that have an address. */
export function visibleChannels(locale: Locale): VisibleChannel[] {
  return joinChannels(getContact(locale).channels, channels);
}
