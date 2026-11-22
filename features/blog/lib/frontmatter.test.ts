import { describe, expect, it } from "vitest";

import { parseFrontmatter } from "./frontmatter";

const file = "content/posts/hello/en.mdx";
const valid = {
  title: "Hello",
  description: "A first post.",
  date: "2026-11-18",
  tags: ["next-js", "mdx"],
};

describe("parseFrontmatter", () => {
  it("accepts a valid post", () => {
    expect(parseFrontmatter(valid, file)).toEqual(valid);
    expect(
      parseFrontmatter(
        { ...valid, date: "2026-11-18", updated: "2026-11-20" },
        file,
      ),
    ).toMatchObject({
      date: "2026-11-18",
      updated: "2026-11-20",
    });
  });

  it.each(["title", "description", "date", "tags"])(
    "rejects a post without %s, naming the file",
    (key) => {
      const data: Record<string, unknown> = { ...valid };
      delete data[key];
      expect(() => parseFrontmatter(data, file)).toThrow(
        new RegExp(`^${file}: .*${key}`),
      );
    },
  );

  it("rejects an empty title", () => {
    expect(() => parseFrontmatter({ ...valid, title: "  " }, file)).toThrow(
      /title/,
    );
  });

  it.each([
    ["a day that does not exist", "2026-02-30"],
    ["another format", "18.11.2026"],
    ["a time of day", "2026-11-18T10:00:00Z"],
    ["a Date", new Date("2026-11-18T00:00:00Z")],
    ["a number", 20261118],
  ])("rejects a date as %s", (_, date) => {
    expect(() => parseFrontmatter({ ...valid, date }, file)).toThrow(
      /YYYY-MM-DD/,
    );
  });

  it("rejects an update before the publication", () => {
    expect(() =>
      parseFrontmatter({ ...valid, updated: "2026-11-01" }, file),
    ).toThrow(/earlier/);
  });

  it.each([["Next"], ["next js"], ["кириллица"], ["-edge"], [""]])(
    "rejects the tag %j",
    (tag) => {
      expect(() => parseFrontmatter({ ...valid, tags: [tag] }, file)).toThrow(
        /tag/,
      );
    },
  );

  it("rejects tags that are not a list or repeat", () => {
    expect(() => parseFrontmatter({ ...valid, tags: "mdx" }, file)).toThrow(
      /list/,
    );
    expect(() =>
      parseFrontmatter({ ...valid, tags: ["mdx", "mdx"] }, file),
    ).toThrow(/duplicate/);
  });

  it.each(["draft", "update"])(
    "rejects the unknown key %s, naming it",
    (key) => {
      expect(() => parseFrontmatter({ ...valid, [key]: true }, file)).toThrow(
        new RegExp(`^${file}: frontmatter \`${key}\``),
      );
    },
  );

  it("accepts a post without tags", () => {
    expect(parseFrontmatter({ ...valid, tags: [] }, file).tags).toEqual([]);
  });
});
