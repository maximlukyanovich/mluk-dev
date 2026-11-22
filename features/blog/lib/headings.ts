import GithubSlugger from "github-slugger";
import type { Nodes, Root } from "mdast";
import { SKIP, visit } from "unist-util-visit";

import type { Heading } from "./types";

/**
 * A heading's text as the page holds it — what `rehype-slug` slugs: the
 * text and inline code, a footnote reference as its number, nothing for a
 * picture (its alt is no text on the page) or an `{expression}`.
 */
function pageText(node: Nodes, footnote: (id: string) => string): string {
  if (node.type === "text" || node.type === "inlineCode") return node.value;
  if (node.type === "break") return "\n";
  if (node.type === "footnoteReference") return footnote(node.identifier);
  if ("children" in node) {
    return node.children.map((child) => pageText(child, footnote)).join("");
  }
  return "";
}

/**
 * The post's sections (its h2s) with the ids `rehype-slug` gives them on the
 * page. rehype-slug runs one github-slugger over every heading of the file,
 * so a repeated h3 shifts the suffix of a later h2: every heading is slugged
 * here too, in order, and only the h2s are kept. Footnotes are numbered as
 * the page numbers them, by their first reference in the text; the notes
 * themselves come after it, so their own headings and references are left
 * out.
 */
export function headings(tree: Root): Heading[] {
  const slugger = new GithubSlugger();
  const sections: Heading[] = [];
  const footnotes: string[] = [];
  const number = (id: string) => {
    if (!footnotes.includes(id)) footnotes.push(id);
    return String(footnotes.indexOf(id) + 1);
  };

  visit(tree, (node) => {
    if (node.type === "footnoteDefinition") return SKIP;
    if (node.type === "footnoteReference") number(node.identifier);
    if (node.type !== "heading") return;
    const id = slugger.slug(pageText(node, number));
    if (node.depth === 2) {
      sections.push({ id, text: pageText(node, () => "").trim() });
    }
  });
  return sections;
}
