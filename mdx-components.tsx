import type { MDXComponents } from "mdx/types";

// Required by @next/mdx in the App Router. It stays a pass-through: a post's
// components come from features/blog as a prop (`<Post components={…} />`),
// so the root never imports a feature.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
