// Footnotes in the post's own language. remark-rehype writes the heading
// ("Footnotes") and the back links ("Back to reference 1") in English for
// every file; this plugin takes the words from the site's dictionaries by the
// locale in the file name (`content/posts/<slug>/ru.mdx`).
//
// Plain JS for the same reason as rehype-code.mjs: Turbopack loads it by path.
import { visit } from "unist-util-visit";

import en from "../../../shared/i18n/dictionaries/en.json" with { type: "json" };
import ru from "../../../shared/i18n/dictionaries/ru.json" with { type: "json" };

const dictionaries = { en, ru };
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

export default function rehypeLocale() {
  return (tree, file) => {
    const words = dictionaries[fileLocale(file.path)].article;

    visit(tree, "element", (node) => {
      const props = node.properties ?? {};
      if (props.id === "footnote-label") {
        node.children = [{ type: "text", value: words.footnotes }];
        // The kit shows the heading as a small label above the notes.
        delete props.className;
        return;
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
