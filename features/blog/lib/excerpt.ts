import type { Nodes, Root, RootContent } from "mdast";

/** Long enough for the four lines a blog card shows. */
export const excerptLength = 280;

/** Inline nodes that are not prose: JSX, expressions, images, note marks. */
const skippedInline = new Set([
  "footnoteReference",
  "image",
  "imageReference",
  "html",
  "mdxJsxTextElement",
  "mdxTextExpression",
]);

function inlineText(node: Nodes): string {
  if (skippedInline.has(node.type)) return "";
  if (node.type === "break") return "\n";
  // A soft wrap in the source is a space on the page.
  if (node.type === "text") return node.value.replace(/\s*\n\s*/g, " ");
  if (node.type === "inlineCode") return node.value;
  if ("children" in node) return node.children.map(inlineText).join("");
  return "";
}

/** The prose blocks in reading order: paragraphs, also inside lists and quotes. */
function* proseBlocks(nodes: readonly RootContent[]): Generator<string> {
  for (const node of nodes) {
    if (node.type === "paragraph") {
      const text = inlineText(node).trim();
      if (text) yield text;
    } else if (
      node.type === "list" ||
      node.type === "listItem" ||
      node.type === "blockquote"
    ) {
      yield* proseBlocks(node.children);
    }
    // Headings, code, tables, JSX blocks, imports and footnote texts are skipped.
  }
}

/** Cuts at the last whole word within `max` and marks the cut with "…". */
function cut(text: string, max: number): string {
  if (text.length <= max) return text;
  const head = text.slice(0, max + 1);
  const lastSpace = head.search(/\s\S*$/);
  const words = lastSpace > 0 ? head.slice(0, lastSpace) : text.slice(0, max);
  return `${words.replace(/[\s,.;:!?—–-]+$/u, "")}…`;
}

/**
 * The post's opening as plain text: Markdown marks removed, one paragraph
 * per line (blank lines between them collapse to one break), cut at a word.
 */
export function excerpt(tree: Root, max = excerptLength): string {
  const lines: string[] = [];
  let length = 0;
  for (const block of proseBlocks(tree.children)) {
    lines.push(block);
    length += block.length + 1;
    if (length > max) break;
  }
  return cut(lines.join("\n"), max);
}
