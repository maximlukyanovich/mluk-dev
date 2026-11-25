import { describe, expect, it } from "vitest";

import type { Channel, ChannelId } from "@/shared/lib/site";
import { jsonShape } from "@/shared/lib/json-shape";

import { joinChannels, visibleChannels } from "./channels";
import { contactContent } from "./content";

const known: Record<ChannelId, Channel> = {
  email: { name: "Email", handle: "[email]", href: null },
  telegram: { name: "Telegram", handle: "@t", href: "https://t.me/t" },
  whatsapp: { name: "WhatsApp", handle: "[+0]", href: null },
  linkedin: { name: "LinkedIn", handle: "in/l", href: "https://l.example" },
  github: { name: "GitHub", handle: "@g", href: "https://g.example" },
  instagram: { name: "Instagram", handle: "[@i]", href: null },
};
const tile = (id: string) => ({ id, purpose: `For ${id}`, action: "Open" });

describe("joinChannels", () => {
  it("leaves out a channel without an address and numbers those shown", () => {
    const shown = joinChannels(
      ["email", "telegram", "whatsapp", "linkedin", "github"].map(tile),
      known,
    );
    expect(shown.map(({ id, number }) => [id, number])).toEqual([
      ["telegram", 1],
      ["linkedin", 2],
      ["github", 3],
    ]);
    expect(shown[0]).toEqual({
      id: "telegram",
      number: 1,
      name: "Telegram",
      handle: "@t",
      href: "https://t.me/t",
      purpose: "For telegram",
      action: "Open",
    });
  });

  it("keeps the content's order", () => {
    const shown = joinChannels(["github", "telegram"].map(tile), known);
    expect(shown.map(({ id }) => id)).toEqual(["github", "telegram"]);
  });

  it("shows the email once it has an address", () => {
    const shown = joinChannels([tile("email")], {
      ...known,
      email: { name: "Email", handle: "a@b.dev", href: "mailto:a@b.dev" },
    });
    expect(shown.map(({ href }) => href)).toEqual(["mailto:a@b.dev"]);
  });

  it.each(["fax", "toString"])("refuses an unknown channel: %s", (id) => {
    expect(() => joinChannels([tile(id)], known)).toThrow(
      `Unknown contact channel "${id}"`,
    );
  });
});

describe("the content", () => {
  it("has the same structure in en and ru", () => {
    expect(jsonShape(contactContent.ru)).toEqual(jsonShape(contactContent.en));
  });

  it("agrees between en and ru on the time zone and the channels", () => {
    const fixed = (locale: "en" | "ru") => ({
      timeZone: contactContent[locale].timeZone,
      ids: contactContent[locale].channels.map(({ id }) => id),
    });
    expect(fixed("ru")).toEqual(fixed("en"));
  });

  it("shows Telegram, LinkedIn and GitHub while the rest have no address", () => {
    for (const locale of ["en", "ru"] as const) {
      expect(
        visibleChannels(locale).map(({ id, number }) => [id, number]),
      ).toEqual([
        ["telegram", 1],
        ["linkedin", 2],
        ["github", 3],
      ]);
    }
  });
});
