import { describe, expect, it } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { fileLocale } from "./rehype-locale.mjs";
import { renderMdx } from "./render-mdx";

const source = "A claim.[^1]\n\n[^1]: The source.";

describe("rehype-locale", () => {
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

  it("leaves the label visible, as the kit draws it", async () => {
    const html = await renderMdx(source);
    expect(html).not.toContain("sr-only");
  });
});
