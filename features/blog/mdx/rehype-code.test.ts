import { describe, expect, it } from "vitest";

import { renderMdx } from "./render-mdx";

const block = (lines: number, meta = "") =>
  [
    "```js" + (meta ? ` ${meta}` : ""),
    ...Array.from({ length: lines }, (_, i) => `const a${i} = ${i};`),
    "```",
  ].join("\n");

const figure = (html: string) =>
  /<figure[^>]*data-rehype-pretty-code-figure[^>]*>/.exec(html)?.[0] ?? "";

describe("rehype-code", () => {
  it("counts the lines and numbers them", async () => {
    const html = await renderMdx(block(3));
    expect(figure(html)).toContain('data-line-count="3"');
    expect(html).toMatch(/<code[^>]*data-line-numbers=""/);
    expect(html.match(/data-line=""/g)).toHaveLength(3);
  });

  it("collapses a block of 21 lines and not one of 20", async () => {
    expect(figure(await renderMdx(block(21)))).toContain(
      'data-collapsed="true"',
    );
    expect(figure(await renderMdx(block(20)))).toContain(
      'data-collapsed="false"',
    );
  });

  it("keeps a long block open with nocollapse", async () => {
    const html = await renderMdx(block(30, "nocollapse"));
    expect(figure(html)).toContain('data-collapsed="false"');
    expect(figure(html)).toContain('data-line-count="30"');
  });

  it("colours tokens with the kit's syntax variables, no background", async () => {
    const html = await renderMdx(block(1));
    expect(html).toContain("color:var(--syntax-keyword)");
    expect(html).not.toMatch(/background-color/);
  });

  it("marks diff lines from the notation comments", async () => {
    const html = await renderMdx(
      [
        "```ts",
        'const a = "old"; // [!code --]',
        'const a = "new"; // [!code ++]',
        "```",
      ].join("\n"),
    );
    expect(html).toContain('class="diff remove"');
    expect(html).toContain('class="diff add"');
    expect(html).not.toContain("[!code");
  });

  it("takes the file name, highlighted lines and words from the meta", async () => {
    const html = await renderMdx(block(3, 'title="app/page.tsx" {2} /a1/'));
    expect(html).toMatch(
      /<figcaption[^>]*data-rehype-pretty-code-title[^>]*>app\/page.tsx<\/figcaption>/,
    );
    expect(html.match(/data-highlighted-line=""/g)).toHaveLength(1);
    expect(html).toContain("data-highlighted-chars");
  });

  it("leaves inline code to the prose styles", async () => {
    const html = await renderMdx("Run `pnpm dev` now.");
    expect(html).toContain("<code>pnpm dev</code>");
  });
});
