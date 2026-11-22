import { describe, expect, it } from "vitest";

import { excerpt } from "./excerpt";
import { parseBody } from "./markdown";

const of = (body: string, max?: number) => excerpt(parseBody(body), max);

describe("excerpt", () => {
  it("removes Markdown marks and keeps the words", () => {
    expect(
      of("Some **bold**, _italic_, `code` and a [link](https://x.dev)."),
    ).toBe("Some bold, italic, code and a link.");
  });

  it("puts each paragraph on its own line, blank lines collapsed", () => {
    expect(of("First one.\n\n\n\nSecond one.")).toBe("First one.\nSecond one.");
  });

  it("joins a soft wrap with a space and keeps a hard break", () => {
    expect(of("One\nline.  \nNext line.")).toBe("One line.\nNext line.");
  });

  it("skips headings, code, JSX, imports, tables, images and notes", () => {
    const body = [
      'import shot from "./shot.png";',
      "## A heading",
      "```js\nconst x = 1;\n```",
      '<Figure src={shot} alt="A shot" />',
      "| a | b |\n| - | - |\n| 1 | 2 |",
      "![alt](./x.png)",
      "Only this.[^1] <Note>inline</Note>",
      "[^1]: The note.",
    ].join("\n\n");
    expect(of(body)).toBe("Only this.");
  });

  it("reads list items and quotes as prose", () => {
    expect(of("- one\n- two\n\n> quoted")).toBe("one\ntwo\nquoted");
  });

  it("cuts at a whole word and marks the cut", () => {
    const text = of("Alpha beta gamma, delta epsilon.", 18);
    expect(text).toBe("Alpha beta gamma…");
    expect(text.length).toBeLessThanOrEqual(19);
  });

  it("does not mark a text that fits", () => {
    expect(of("Short.", 18)).toBe("Short.");
  });

  it("is empty for a post with no prose", () => {
    expect(of("## Only a heading")).toBe("");
  });
});
