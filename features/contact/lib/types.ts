import type { ChannelId } from "@/shared/lib/site";

/** One tile of `content/contact/<locale>.json`: what a channel is for. */
export type ChannelSource = {
  id: string;
  /** The tile's meta line: "Quick questions". */
  purpose: string;
  /** The tile's last line: "Open", "Write". */
  action: string;
};

/** The contact page's content in one locale. */
export type ContactContent = {
  /** The owner's IANA time zone — the status row's offset and local time. */
  timeZone: string;
  /** What the owner is open to: "Open to {work}". */
  openTo: string;
  /** How soon a reply comes: "within {replies}". */
  replies: string;
  /** The tiles in the page's order. */
  channels: ChannelSource[];
};

/** A channel tile ready to render: the content joined with its address. */
export type VisibleChannel = {
  id: ChannelId;
  /** Its 1-based position among the tiles shown — the tile's "01". */
  number: number;
  name: string;
  handle: string;
  href: string;
  purpose: string;
  action: string;
};
