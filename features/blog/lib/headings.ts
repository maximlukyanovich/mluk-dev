import GithubSlugger from "github-slugger";
import type { Root } from "mdast";
import { toString } from "mdast-util-to-string";
import { visit } from "unist-util-visit";

import type { Heading } from "./types";

/**
 * The post's sections (its h2s) with the ids `rehype-slug` gives them on the
 * page. rehype-slug runs one github-slugger over every heading of the file,
 * so a repeated h3 shifts the suffix of a later h2: every heading is slugged
 * here too, in order, and only the h2s are kept.
 */
export function headings(tree: Root): Heading[] {
  const slugger = new GithubSlugger();
  const sections: Heading[] = [];
  visit(tree, "heading", (node) => {
    const text = toString(node);
    const id = slugger.slug(text);
    if (node.depth === 2) sections.push({ id, text });
  });
  return sections;
}
