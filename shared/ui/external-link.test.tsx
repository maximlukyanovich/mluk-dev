import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ExternalLink, NewTabMark } from "./external-link";

const render = (node: ReactNode) => renderToStaticMarkup(node);
/** What a screen reader reads: the markup without its tags. */
const text = (html: string) => html.replace(/<[^>]+>/g, "");

describe("ExternalLink", () => {
  it("opens a new tab without access to this one", () => {
    const html = render(
      <ExternalLink href="https://github.com/a" newTab="(opens in a new tab)">
        Code
      </ExternalLink>,
    );
    expect(html).toContain('href="https://github.com/a"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("ends with the icon and the hidden words for a screen reader", () => {
    const html = render(
      <ExternalLink href="https://a.dev" newTab="(opens in a new tab)">
        Live
      </ExternalLink>,
    );
    expect(text(html)).toBe("Live (opens in a new tab)");
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
    // Hidden from the eye, read by a screen reader.
    expect(html).toMatch(/class="mk-sr">\s*\(opens in a new tab\)/);
  });

  it("leaves the sign to the children when no label is given", () => {
    const html = render(
      <ExternalLink href="https://t.me/a" className="mk-card">
        <span>Telegram</span>
        <span>
          Open
          <NewTabMark label="(откроется в новой вкладке)" />
        </span>
      </ExternalLink>,
    );
    expect(html).toContain('class="mk-card"');
    expect(html.match(/<svg/g)).toHaveLength(1);
    expect(text(html)).toBe("TelegramOpen (откроется в новой вкладке)");
  });
});
