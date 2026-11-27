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

/**
 * The tiles another page shows: those of `ids`, in that order, that the
 * contact page shows — a channel without an address stays hidden — numbered
 * again among them. An id with no channel throws, so the build fails.
 */
export function pickChannels(
  visible: readonly VisibleChannel[],
  ids: readonly string[],
): VisibleChannel[] {
  const picked: VisibleChannel[] = [];
  for (const id of ids) {
    if (!Object.hasOwn(channels, id)) {
      throw new Error(
        `Unknown contact channel "${id}"; expected one of ${Object.keys(channels).join(", ")}`,
      );
    }
    const channel = visible.find((shown) => shown.id === id);
    if (channel) picked.push({ ...channel, number: picked.length + 1 });
  }
  return picked;
}

/** The channel tiles of `locale` that have an address. */
export function visibleChannels(locale: Locale): VisibleChannel[] {
  return joinChannels(getContact(locale).channels, channels);
}
