import { ExternalLink, NewTabMark } from "@/shared/ui/external-link";

import type { VisibleChannel } from "../lib/types";

const number = (n: number) => String(n).padStart(2, "0");

/**
 * A channel as the kit's Card (canvas, Contact-C and M-Contact): the number
 * and purpose, the channel's name, its handle and the action. The whole tile
 * is one link; a web address opens a new tab, `mailto:` does not. The tile
 * is not in the kit yet — its spacing is the frame's.
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
      <span className="mk-card-meta p-0">
        <span className="mk-card-no">{number(channel.number)}</span>
        <span>{channel.purpose}</span>
      </span>
      <span className="mk-card-title mt-4.5 p-0">{channel.name}</span>
      <span className="text-muted">{channel.handle}</span>
      <span className="mt-3 font-bold text-peri">
        {channel.action}
        {!mail && <NewTabMark label={newTab} />}
      </span>
    </>
  );
  const className = "mk-card mk-glass h-full gap-2.5 px-5 pt-5.5 pb-6";

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
