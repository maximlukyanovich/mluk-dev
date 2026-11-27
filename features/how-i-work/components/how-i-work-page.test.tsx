import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { getHowIWork } from "../lib/content";
import { HowIWorkPage, type HowIWorkSlots } from "./how-i-work-page";

const slots = (overrides: Partial<HowIWorkSlots> = {}): HowIWorkSlots => ({
  eyebrow: "Open to work · Minsk",
  ribbon: () => <ul data-slot="ribbon" />,
  projectBadge: (slug) => <a data-slot="project">{slug}</a>,
  post: (slug) => <a data-slot="post">{slug}</a>,
  contacts: {
    tiles: () => <ul data-slot="tiles" />,
    replies: "2 days",
  },
  ...overrides,
});

/** The page's HTML, with the apostrophe React escapes read back. */
const render = (overrides?: Partial<HowIWorkSlots>) =>
  renderToStaticMarkup(
    <HowIWorkPage
      locale="en"
      dictionary={dictionaryFor("en")}
      slots={slots(overrides)}
    />,
  ).replaceAll("&#x27;", "'");

const content = getHowIWork("en");
const withPost = content.phases.find((phase) => phase.post)!;
const [postBefore] = withPost.post!.text.split("{post}");

describe("HowIWorkPage", () => {
  it("puts the post's sentence around its badge", () => {
    const html = render();
    expect(html).toContain(
      `${postBefore}<a data-slot="post">${withPost.post!.slug}</a>`,
    );
  });

  it("leaves the sentence out while the post does not exist", () => {
    expect(render()).toContain(postBefore);
    const html = render({ post: () => null });
    expect(html).not.toContain(postBefore);
    expect(html).not.toContain('data-slot="post"');
  });

  it("marks only the phases with a loop as repeating in the flow", () => {
    const html = render();
    const repeating = content.phases.filter((phase) => phase.loop).length;
    expect(repeating).toBeLessThan(content.phases.length);
    expect(html.match(/<\/svg>repeats<\/span>/g)).toHaveLength(repeating);
  });

  it("shows the ribbon only in the phases with examples", () => {
    const html = render();
    const examples = content.phases.filter((phase) => phase.examples).length;
    expect(html.match(/data-slot="ribbon"/g)).toHaveLength(examples);
  });

  it("keeps the reply line and the contacts link without any tile", () => {
    const html = render({
      contacts: { tiles: () => null, replies: "2 days" },
    });
    expect(html).not.toContain('data-slot="tiles"');
    expect(html).toContain("I reply within 2 days.");
    expect(html).toContain('href="/en/contact"');
    expect(html).toMatch(/All contacts <span aria-hidden="true">→<\/span>/);
  });

  it("passes the offer's channels to the tiles", () => {
    let asked: readonly string[] = [];
    render({
      contacts: {
        tiles: (ids) => ((asked = ids), null),
        replies: "2 days",
      },
    });
    expect(asked).toEqual(content.offer.channels);
  });
});
