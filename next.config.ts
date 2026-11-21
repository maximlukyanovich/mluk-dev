import createMDX from "@next/mdx";
import type { NextConfig } from "next";

import { mdxOptions } from "./features/blog/mdx/options.mjs";
import { defaultLocale, locales } from "./shared/i18n/locales";

// A path whose last segment has a dot and whose first segment is neither a
// locale nor Next's `_next/`.
const dottedOutsideLocale = `(?!(?:${locales.join("|")})(?:/|$)|_next/).*\\.[^/]*`;

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // The proxy skips paths with a dotted last segment (proxy.ts), so one under a
  // non-locale first segment (`/feed.xml`, `/wp-admin/install.php`) would
  // reach the root layout with that segment as a locale and get Next's
  // unlocalized 404. afterFiles runs after public/ files and static routes
  // (`/robots.txt`), before `[lang]`: such a path is served from the default
  // locale, which answers with its feed or its localized 404.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: `/:path(${dottedOutsideLocale})`,
          destination: `/${defaultLocale}/:path`,
        },
      ],
      fallback: [],
    };
  },
  partialPrefetching: true,
  // Video previews in posts (features/blog/lib/video-poster.ts), served
  // through the image optimiser so the reader never calls the service.
  images: {
    remotePatterns: [
      new URL("https://i.ytimg.com/vi/**"),
      new URL("https://i.vimeocdn.com/video/**"),
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Posts are `.mdx` files imported by the blog's routes (content/posts/).
const withMDX = createMDX({ options: mdxOptions });

export default withMDX(nextConfig);
