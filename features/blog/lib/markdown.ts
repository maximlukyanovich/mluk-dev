import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

/**
 * A post body (frontmatter already removed) as a Markdown tree, for what the
 * blog computes from the text: excerpt, reading time, sections. It is parsed
 * as MDX with GFM, as the page is, so JSX, imports and footnotes are nodes,
 * not text.
 */
export function parseBody(body: string): Root {
  return parser.parse(body);
}
