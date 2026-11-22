// Code blocks for posts: rehype-pretty-code with the kit's syntax tokens.
//
// Plain JS on purpose: @next/mdx under Turbopack takes plugins as strings and
// loads them with Node (`require.resolve` from the directory of the `.mdx`
// being compiled, then `import()`; options.mjs names it by absolute path), so
// this module must run without a compile step. Its options
// stay inside the module — a function cannot cross into Turbopack's config.
import { transformerNotationDiff } from "@shikijs/transformers";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";

/** A block longer than this starts collapsed (the kit shows ~14 lines). */
export const collapseAfter = 20;

const syntax = (token) => `var(--syntax-${token})`;

/**
 * A Shiki theme whose colours are the kit's `--syntax-*` tokens, so a block
 * follows the site's theme with no second set of spans. The scopes follow
 * Shiki's own `createCssVariablesTheme`, folded onto the kit's seven tokens.
 */
export const syntaxTheme = {
  name: "mluk",
  type: "dark",
  colors: {
    "editor.foreground": syntax("plain"),
    "editor.background": "transparent",
  },
  tokenColors: [
    { settings: { foreground: syntax("plain") } },
    {
      scope: [
        "comment",
        "punctuation.definition.comment",
        "string.quoted.docstring.multi",
      ],
      settings: { foreground: syntax("comment"), fontStyle: "italic" },
    },
    {
      scope: [
        "string",
        "string.quoted",
        "string.template",
        "string.regexp",
        "string.unquoted.plain.out.yaml",
        "markup.inline.raw",
        "markup.fenced_code",
      ],
      settings: { foreground: syntax("string") },
    },
    {
      scope: [
        "keyword",
        "storage",
        "storage.type",
        "storage.modifier",
        "constant.language",
        "variable.language",
        "punctuation.definition.template-expression",
      ],
      settings: { foreground: syntax("keyword") },
    },
    {
      scope: [
        "entity.name.function",
        "support.function",
        "meta.function-call",
        "entity.name.type",
        "entity.name.class",
        "support.class",
        "support.type",
        "entity.other.inherited-class",
        "meta.instance.constructor",
      ],
      settings: { foreground: syntax("function") },
    },
    {
      scope: [
        "entity.name.tag",
        "support.class.component",
        "punctuation.definition.tag",
      ],
      settings: { foreground: syntax("tag") },
    },
    {
      scope: [
        "entity.other.attribute-name",
        "support.type.property-name",
        "meta.property-name",
        "meta.object-literal.key",
        "entity.name.tag.yaml",
        "constant.numeric",
        "constant.other",
        "variable.other.constant",
      ],
      settings: { foreground: syntax("attr") },
    },
    {
      scope: ["markup.heading", "markup.bold"],
      settings: { fontStyle: "bold" },
    },
    { scope: ["markup.italic"], settings: { fontStyle: "italic" } },
  ],
};

/** @type {import("rehype-pretty-code").Options} */
const prettyCodeOptions = {
  theme: syntaxTheme,
  // The kit paints the block (`--code`); Shiki only colours the tokens.
  keepBackground: false,
  // Inline code keeps the kit's `.mk-prose :not(pre) > code` look.
  bypassInlineCode: true,
  defaultLang: "plaintext",
  // `// [!code ++]` and `// [!code --]` mark diff lines (`.diff.add`).
  transformers: [transformerNotationDiff()],
};

/** `nocollapse` in a block's meta keeps a long block open. */
const noCollapse = /(?:^|\s)nocollapse(?=\s|$)/;

function isElement(node, tagName) {
  return node?.type === "element" && node.tagName === tagName;
}

/**
 * Marks every highlighted block for the kit: line numbers on its `code`, and
 * on its `figure` the line count and whether it starts collapsed. Both are
 * decided here, at build time, so the server HTML and the hydrated block
 * agree and a long block never jumps.
 */
function markBlocks(tree) {
  visit(tree, "element", (figure) => {
    if (!("data-rehype-pretty-code-figure" in (figure.properties ?? {})))
      return;
    const pre = figure.children.find((child) => isElement(child, "pre"));
    const code = pre?.children.find((child) => isElement(child, "code"));
    if (!code) return;

    const lines = code.children.filter(
      (child) =>
        child.type === "element" && "data-line" in (child.properties ?? {}),
    ).length;
    const meta = String(code.data?.meta ?? "");

    code.properties["data-line-numbers"] = "";
    figure.properties["data-line-count"] = String(lines);
    figure.properties["data-collapsed"] = String(
      lines > collapseAfter && !noCollapse.test(meta),
    );
  });
}

export default function rehypeCode() {
  const highlight = rehypePrettyCode(prettyCodeOptions);
  return async (tree, file) => {
    await highlight(tree, file);
    markBlocks(tree);
  };
}
