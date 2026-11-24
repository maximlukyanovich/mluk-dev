import { ExternalLink, NewTabMark } from "@/shared/ui/external-link";

import type { VisibleChannel } from "../lib/types";

const number = (n: number) => String(n).padStart(2, "0");

/**
 * A channel as the kit's Card (canvas, Contact-C and M-Contact): the number
 * and purpose, the channel's name, its handle and the action. The whole tile
 * is one link; a web address opens a new tab, `mailto:` does not. The kit's
 * Contact: `.mk-tile`.
 */
export function ChannelTile({
  channel,
  newTab,
}: {
  channel: VisibleChannel;
  newTab: string;
}) {
  const mail = channel.href.startsWith("mailto:");
  const body = (
    <>
      <span className="mk-card-meta">
        <span className="mk-card-no">{number(channel.number)}</span>
        <span>{channel.purpose}</span>
      </span>
      <span className="mk-card-title">{channel.name}</span>
      <span className="mk-tile-handle">{channel.handle}</span>
      <span className="mk-tile-action">
        {channel.action}
        {!mail && <NewTabMark label={newTab} />}
      </span>
    </>
  );
  const className = "mk-card mk-glass mk-tile h-full";

  return mail ? (
    <a className={className} href={channel.href}>
      {body}
    </a>
  ) : (
    <ExternalLink className={className} href={channel.href}>
      {body}
    </ExternalLink>
  );
}
