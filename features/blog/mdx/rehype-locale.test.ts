import { describe, expect, it } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";
import { locales } from "@/shared/i18n/locales";

import { dictionaries, fileLocale } from "./rehype-locale.mjs";
import { renderMdx } from "./render-mdx";

const source = "A claim.[^1]\n\n[^1]: The source.";

describe("rehype-locale", () => {
  it("knows every locale of the site", () => {
    expect(Object.keys(dictionaries)).toEqual([...locales]);
  });

  it("reads the locale from the file name", () => {
    expect(fileLocale("/x/content/posts/hello/ru.mdx")).toBe("ru");
    expect(fileLocale("C:\\x\\posts\\hello\\en.mdx")).toBe("en");
    expect(fileLocale("/x/notes.mdx")).toBe("en");
    expect(fileLocale(undefined)).toBe("en");
  });

  it.each(["en", "ru"] as const)(
    "writes the footnote words in %s",
    async (locale) => {
      const words = dictionaryFor(locale).article;
      const html = await renderMdx(
        source,
        `/content/posts/hello/${locale}.mdx`,
      );
      expect(html).toContain(`<h2 id="footnote-label">${words.footnotes}</h2>`);
      expect(html).toContain(
        `aria-label="${words.backToReference.replace("{n}", "1")}"`,
      );
    },
  );

  it("gives the notes another id when a post's heading holds theirs", async () => {
    const html = await renderMdx(
      `## Footnote label\n\n## Footnote label 1\n\n${source}`,
    );
    expect(html).toContain('<h2 id="footnote-label">Footnote label</h2>');
    expect(html).toContain('<h2 id="footnote-label-1">Footnote label 1</h2>');
    expect(html).toContain('<h2 id="footnote-label-2">Footnotes</h2>');
    expect(html).toContain('aria-describedby="footnote-label-2"');
    expect(html).not.toContain('aria-describedby="footnote-label"');
  });

  it("leaves the label visible, as the kit draws it", async () => {
    const html = await renderMdx(source);
    expect(html).not.toContain("sr-only");
  });
});
