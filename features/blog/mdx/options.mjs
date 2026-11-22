// The one list of MDX plugins: next.config.ts hands it to @next/mdx, and the
// tests compile fixtures with it, so a test cannot check another pipeline.
//
// Turbopack takes plugins as strings (a function cannot cross into Rust).
// @next/mdx resolves each string from the directory of the `.mdx` file being
// compiled (`require.resolve(name, { paths: [this.context] })`), so a package
// name works and a relative path would not: the project's own plugins are
// named by their absolute path.
import { fileURLToPath } from "node:url";

const local = (file) => fileURLToPath(new URL(file, import.meta.url));

/** @type {NonNullable<import("@next/mdx").NextMDXOptions["options"]>} */
export const mdxOptions = {
  remarkPlugins: ["remark-frontmatter", "remark-gfm"],
  rehypePlugins: [
    "rehype-slug",
    local("./rehype-code.mjs"),
    local("./rehype-locale.mjs"),
  ],
};
