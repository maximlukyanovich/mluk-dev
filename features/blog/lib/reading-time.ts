import type { Nodes, Root } from "mdast";

/** Words a minute, for both locales. */
export const wordsPerMinute = 200;

/** Nodes whose text is not read: code, JSX logic, imports, raw HTML. */
const unread = new Set([
  "code",
  "mdxjsEsm",
  "mdxFlowExpression",
  "mdxTextExpression",
  "html",
]);

const word = /[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu;

function countWords(node: Nodes): number {
  if (unread.has(node.type)) return 0;
  if (node.type === "text" || node.type === "inlineCode") {
    return node.value.match(word)?.length ?? 0;
  }
  if ("children" in node) {
    return node.children.reduce((sum, child) => sum + countWords(child), 0);
  }
  return 0;
}

/** Minutes to read a post, code blocks not counted; at least 1. */
export function readingTime(tree: Root): number {
  return Math.max(1, Math.ceil(countWords(tree) / wordsPerMinute));
}
