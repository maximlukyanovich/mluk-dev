import { describe, expect, it } from "vitest";

import { renderMdx } from "../mdx/render-mdx";
import { headings } from "./headings";
import { parseBody } from "./markdown";

const fixture = [
  "## Why `use cache`?",
  "### Setup",
  "## Setup",
  "## Что дальше",
  "## Why `use cache`?",
  "Text.[^1]",
  "```md\n## Not a heading\n```",
  "[^1]: A note.",
].join("\n\n");

describe("headings", () => {
  it("lists the h2s only", () => {
    expect(headings(parseBody(fixture)).map((h) => h.text)).toEqual([
      "Why use cache?",
      "Setup",
      "Что дальше",
      "Why use cache?",
    ]);
  });

  it("gives each h2 the id rehype-slug gives it on the page", async () => {
    const html = await renderMdx(fixture);
    const onPage = [...html.matchAll(/<h2 id="([^"]+)"/g)]
      .map((match) => match[1])
      .filter((id) => id !== "footnote-label");
    const ids = headings(parseBody(fixture)).map((h) => h.id);
    expect(ids).toEqual(onPage);
    // The h3 "Setup" took the plain slug first.
    expect(ids).toEqual([
      "why-use-cache",
      "setup-1",
      "что-дальше",
      "why-use-cache-1",
    ]);
  });
});
