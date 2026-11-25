import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { PrevNext, type PrevNextItem } from "./prev-next";

const labels = {
  label: "More posts",
  previousLabel: "Previous",
  nextLabel: "Next",
};
const older: PrevNextItem = { href: "/en/writing/a", title: "Older" };
const newer: PrevNextItem = { href: "/en/writing/b", title: "Newer" };

describe("PrevNext", () => {
  it("renders no nav without a neighbour", () => {
    expect(renderToStaticMarkup(<PrevNext {...labels} />)).toBe("");
  });

  it("links each neighbour with its direction", () => {
    const html = renderToStaticMarkup(
      <PrevNext {...labels} previous={older} next={newer} />,
    );
    expect(html).toContain('aria-label="More posts"');
    expect(html).toMatch(/rel="prev" href="\/en\/writing\/a"/);
    expect(html).toMatch(/class="[^"]*mk-pn-next[^"]*" rel="next"/);
  });

  it("prints the meta line only when the item has one", () => {
    const plain = renderToStaticMarkup(<PrevNext {...labels} next={newer} />);
    expect(plain).not.toContain("mk-pn-meta");

    const withMeta = renderToStaticMarkup(
      <PrevNext
        {...labels}
        next={{ ...newer, meta: "01 · Personal · Product" }}
      />,
    );
    expect(withMeta).toContain("01 · Personal · Product");
  });
});
