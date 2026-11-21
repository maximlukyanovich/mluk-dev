import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { locales } from "@/shared/i18n/locales";

import {
  buildPosts,
  countTags,
  postsDir,
  readPostSources,
  templateDir,
  type PostSource,
} from "./posts";
import { testPost } from "./test-posts";

const frontmatter = (title: string, date = "2026-11-18", tags = "[mdx]") =>
  `---\ntitle: ${title}\ndescription: About ${title}.\ndate: ${date}\ntags: ${tags}\n---\n\n`;

let dir: string | undefined;

function tree(files: Record<string, string>): string {
  dir = mkdtempSync(path.join(tmpdir(), "posts-"));
  for (const [name, content] of Object.entries(files)) {
    const file = path.join(dir, name);
    mkdirSync(path.dirname(file), { recursive: true });
    writeFileSync(file, content);
  }
  return dir;
}

afterEach(() => {
  if (dir) rmSync(dir, { recursive: true, force: true });
  dir = undefined;
});

describe("readPostSources", () => {
  it("reads each locale file of each post folder, leaving images and `_` folders alone", () => {
    const root = tree({
      "hello/en.mdx": frontmatter("Hello"),
      "hello/ru.mdx": frontmatter("Привет"),
      "hello/shot.png": "png",
      "README.txt": "not a post",
      "_template/en.mdx": frontmatter("Template"),
    });
    const sources = readPostSources(root);
    expect(
      sources.map(({ slug, locale }) => `${slug}/${locale}`).sort(),
    ).toEqual(["hello/en", "hello/ru"]);
  });

  it("is empty when the folder is gone", () => {
    expect(
      readPostSources(path.join(tmpdir(), "no-such-posts-folder")),
    ).toEqual([]);
  });

  it.each(["page", "tag"])(
    "rejects the reserved slug %s, naming the folder",
    (slug) => {
      const root = tree({ [`${slug}/en.mdx`]: frontmatter("X") });
      expect(() => readPostSources(root)).toThrow(
        new RegExp(`${slug}: .*reserved`),
      );
    },
  );

  it("rejects a folder name that is not a URL slug", () => {
    const root = tree({ "Hello World/en.mdx": frontmatter("X") });
    expect(() => readPostSources(root)).toThrow(/Hello World: /);
  });

  it("rejects a file that is not named after a locale", () => {
    const root = tree({ "hello/de.mdx": frontmatter("X") });
    expect(() => readPostSources(root)).toThrow(/de\.mdx: .*locale/);
  });
});

describe("buildPosts", () => {
  const source = (
    slug: string,
    locale: "en" | "ru",
    text: string,
  ): PostSource => ({
    slug,
    locale,
    file: `content/posts/${slug}/${locale}.mdx`,
    source: text,
  });

  it("computes excerpt, reading time and sections, newest first", () => {
    const posts = buildPosts([
      source("old", "en", frontmatter("Old", "2026-01-01") + "Old text."),
      source(
        "new",
        "en",
        frontmatter("New", "2026-11-18") + "New text.\n\n## One\n\n## Two",
      ),
    ]);
    expect(posts.map((p) => p.slug)).toEqual(["new", "old"]);
    expect(posts[0]).toMatchObject({
      title: "New",
      date: "2026-11-18",
      excerpt: "New text.",
      readingTime: 1,
      headings: [
        { id: "one", text: "One" },
        { id: "two", text: "Two" },
      ],
    });
  });

  it("rejects a duplicate post, naming both files", () => {
    const twice = source("hello", "en", frontmatter("Hello"));
    expect(() => buildPosts([twice, twice])).toThrow(
      /hello\/en\.mdx: duplicates .*hello\/en\.mdx/,
    );
  });

  it("names the file of bad frontmatter", () => {
    expect(() =>
      buildPosts([source("hello", "en", frontmatter("Hello", "18.11.2026"))]),
    ).toThrow(/^content\/posts\/hello\/en\.mdx: /);
  });

  it("names the file of a body that is not valid MDX", () => {
    expect(() =>
      buildPosts([source("hello", "en", frontmatter("Hello") + "<Figure")]),
    ).toThrow(/^content\/posts\/hello\/en\.mdx: /);
  });
});

describe("countTags", () => {
  it("puts the most used first, then alphabetically", () => {
    const posts = [
      testPost("a", "en", ["mdx", "next"]),
      testPost("b", "en", ["next", "css"]),
      testPost("c", "en", ["astro"]),
    ];
    expect(countTags(posts)).toEqual([
      { tag: "next", count: 2 },
      { tag: "astro", count: 1 },
      { tag: "css", count: 1 },
      { tag: "mdx", count: 1 },
    ]);
  });
});

describe("content/posts", () => {
  it("parses: every post in the repository is valid", () => {
    expect(() => buildPosts(readPostSources(postsDir))).not.toThrow();
  });

  it("keeps a valid template in every locale", () => {
    const sources = locales.map((locale) => {
      const file = path.join(templateDir, `${locale}.mdx`);
      return {
        slug: "template",
        locale,
        file,
        source: readFileSync(file, "utf8"),
      };
    });
    expect(() => buildPosts(sources)).not.toThrow();
  });

  it("keeps every image at 1 MB or less", () => {
    const tooBig: string[] = [];
    const walk = (folder: string) => {
      for (const entry of readdirSync(folder, { withFileTypes: true })) {
        const file = path.join(folder, entry.name);
        if (entry.isDirectory()) walk(file);
        else if (
          /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(entry.name) &&
          statSync(file).size > 1024 * 1024
        ) {
          tooBig.push(file);
        }
      }
    };
    walk(path.join(process.cwd(), "content"));
    expect(tooBig).toEqual([]);
  });
});
