// Test helper: compiles MDX with the site's own plugin list (options.mjs)
// and renders it to HTML, so a test sees what a post page gets.
import { compile, run } from "@mdx-js/mdx";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as runtime from "react/jsx-runtime";
import type { PluggableList } from "unified";

import { mdxOptions } from "./options.mjs";

type Entry = string | [string, ...unknown[]] | PluggableList[number];

/** Resolves a plugin named by a string, as @next/mdx does for Turbopack. */
async function load(entry: Entry): Promise<PluggableList[number]> {
  const resolve = async (name: string) => {
    const mod = await import(/* @vite-ignore */ name);
    return mod.default ?? mod;
  };
  if (typeof entry === "string") return resolve(entry);
  if (Array.isArray(entry) && typeof entry[0] === "string") {
    const [name, ...options] = entry;
    return [await resolve(name), ...options] as PluggableList[number];
  }
  return entry as PluggableList[number];
}

const loadAll = (list: readonly Entry[] = []) => Promise.all(list.map(load));

/** HTML of `source`, compiled as the post file at `path` (its name is its locale). */
export async function renderMdx(
  source: string,
  path = "/content/posts/test/en.mdx",
): Promise<string> {
  const code = await compile(
    { value: source, path },
    {
      remarkPlugins: await loadAll(mdxOptions.remarkPlugins as Entry[]),
      rehypePlugins: await loadAll(mdxOptions.rehypePlugins as Entry[]),
      outputFormat: "function-body",
    },
  );
  const { default: Content } = await run(code, {
    ...runtime,
    baseUrl: import.meta.url,
  });
  return renderToStaticMarkup(createElement(Content));
}
