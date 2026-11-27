import { cn } from "@/shared/lib/cn";

import type { VisibleChannel } from "../lib/types";
import { ChannelTile } from "./channel-tile";

type ContactTilesProps = {
  channels: readonly VisibleChannel[];
  /** The list's `aria-label`. */
  label: string;
  newTab: string;
  className?: string;
};

/**
 * The channel tiles in the kit's card grid — the contact page's and How I
 * work's. A page with no channel to show leaves the list out.
 */
export function ContactTiles({
  channels,
  label,
  newTab,
  className,
}: ContactTilesProps) {
  return (
    <ul className={cn("mk-cards", className)} aria-label={label}>
      {channels.map((channel) => (
        <li key={channel.id}>
          <ChannelTile channel={channel} newTab={newTab} />
        </li>
      ))}
    </ul>
  );
}
