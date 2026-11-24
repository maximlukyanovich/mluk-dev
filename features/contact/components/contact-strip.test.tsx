import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { visibleChannels } from "../lib/channels";
import type { VisibleChannel } from "../lib/types";
import { ContactStrip } from "./contact-strip";

vi.mock("../lib/channels", async (actual) => ({
  ...(await actual<typeof import("../lib/channels")>()),
  visibleChannels: vi.fn(),
}));

const channel = (
  id: VisibleChannel["id"],
  name: string,
  href: string,
): VisibleChannel => ({
  id,
  number: 1,
  name,
  handle: name.toLowerCase(),
  href,
  purpose: "",
  action: "",
});
const telegram = channel("telegram", "Telegram", "https://t.me/t");
const github = channel("github", "GitHub", "https://github.com/g");
const email = channel("email", "Email", "mailto:hi@mluk.dev");

const render = (shown: VisibleChannel[]) => {
  vi.mocked(visibleChannels).mockReturnValue(shown);
  return renderToStaticMarkup(
    <ContactStrip locale="en" dictionary={dictionaryFor("en")} />,
  );
};

describe("ContactStrip", () => {
  it("links each channel in a new tab and has no email button without an address", () => {
    const html = render([telegram, github]);
    expect(html.match(/<a [^>]*>/g)).toEqual([
      '<a class="mk-link" href="https://t.me/t" target="_blank" rel="noopener noreferrer">',
      '<a class="mk-link" href="https://github.com/g" target="_blank" rel="noopener noreferrer">',
    ]);
    expect(html).not.toContain("mailto:");
  });

  it("makes the email the primary button once it has an address", () => {
    const html = render([email, telegram]);
    expect(html).toContain(
      '<a class="mk-btn mk-btn-primary" href="mailto:hi@mluk.dev">email</a>',
    );
    expect(html).not.toMatch(/href="mailto:[^"]*" target/);
  });
});
