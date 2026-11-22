// Footnotes in the post's own language. remark-rehype writes the heading
// ("Footnotes") and the back links ("Back to reference 1") in English for
// every file; this plugin takes the words from the site's dictionaries by the
// locale in the file name (`content/posts/<slug>/ru.mdx`). It also keeps the
// notes' heading id unique: remark-rehype always names it `footnote-label`,
// and rehype-slug gives a post's heading "Footnote label" the same id.
//
// Plain JS for the same reason as rehype-code.mjs: Turbopack loads it by path.
import { visit } from "unist-util-visit";

import en from "../../../shared/i18n/dictionaries/en.json" with { type: "json" };
import ru from "../../../shared/i18n/dictionaries/ru.json" with { type: "json" };

/**
 * The site's dictionaries by locale. A plain JS module cannot read
 * shared/i18n/locales.ts, so the list is its own; rehype-locale.test.ts holds
 * it equal to `locales`, and a third locale fails there until it is added.
 */
export const dictionaries = { en, ru };
const fallbackLocale = "en";

/** The locale a post file is written in: `…/ru.mdx` → `ru`. */
export function fileLocale(path) {
  const name = String(path ?? "")
    .split(/[\\/]/)
    .pop();
  const locale = name?.replace(/\.mdx$/, "");
  return locale && locale in dictionaries ? locale : fallbackLocale;
}

const backLabel = /^Back to reference (\S+)$/;

const labelId = "footnote-label";

/**
 * The id the notes' heading takes: `footnote-label`, or the first
 * `footnote-label-<n>` no element has when a post's heading already holds it.
 * The post's heading keeps its id — a link to that section stays valid.
 */
function noteLabelId(tree) {
  const ids = new Set();
  let taken = 0;
  visit(tree, "element", (node) => {
    const id = node.properties?.id;
    if (id === labelId) taken++;
    else if (typeof id === "string") ids.add(id);
  });
  if (taken < 2) return labelId;
  let n = 1;
  while (ids.has(`${labelId}-${n}`)) n++;
  return `${labelId}-${n}`;
}

export default function rehypeLocale() {
  return (tree, file) => {
    const words = dictionaries[fileLocale(file.path)].article;
    const label = noteLabelId(tree);

    visit(tree, "element", (node) => {
      const props = node.properties ?? {};
      // The notes' own heading, the first child of their section: a post's
      // heading slugged `footnote-label` keeps its words.
      if ("dataFootnotes" in props) {
        const heading = node.children.find(
          (child) =>
            child.type === "element" && child.properties?.id === labelId,
        );
        if (heading) {
          heading.properties.id = label;
          heading.children = [{ type: "text", value: words.footnotes }];
          // The kit shows the heading as a small label above the notes.
          delete heading.properties.className;
        }
        return;
      }
      if ("dataFootnoteRef" in props && Array.isArray(props.ariaDescribedBy)) {
        props.ariaDescribedBy = props.ariaDescribedBy.map((id) =>
          id === labelId ? label : id,
        );
      }
      if (
        "dataFootnoteBackref" in props &&
        typeof props.ariaLabel === "string"
      ) {
        const match = backLabel.exec(props.ariaLabel);
        if (match)
          props.ariaLabel = words.backToReference.replace("{n}", match[1]);
      }
    });
  };
}
