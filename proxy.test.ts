import {
  getRewrittenUrl,
  unstable_doesMiddlewareMatch,
  unstable_getResponseFromNextConfig,
} from "next/experimental/testing/server";
import { describe, expect, it } from "vitest";

import nextConfig from "./next.config";
import { config } from "./proxy";

const matches = (url: string) =>
  unstable_doesMiddlewareMatch({ config, nextConfig, url });

describe("proxy matcher", () => {
  it.each(["/", "/en", "/ru", "/writing", "/ru/cv", "/en/writing/some-post"])(
    "routes %s by locale",
    (url) => {
      expect(matches(url)).toBe(true);
    },
  );

  // Next's internals and files never carry a locale. A dotted last segment
  // under a non-locale first segment (`/feed.xml`, `/wp-admin/install.php`)
  // skips the proxy too: next.config's rewrite below takes it.
  it.each([
    "/_next/static/chunks/main.js",
    "/_next/image",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/feed.xml",
    "/apple-touch-icon.png",
    "/wp-login.php",
    "/wp-admin/install.php",
    "/.well-known/security.txt",
    "/cv/mluk-cv-en.pdf",
  ])("leaves %s alone", (url) => {
    expect(matches(url)).toBe(false);
  });
});

// afterFiles: public/ files and static routes (`/robots.txt`) win over this
// rule at runtime — Next's documented order, checked by hand on a production
// build on 2026-11-21; these cases pin the rule only.
describe("dotted path rewrite", () => {
  const rewrittenTo = async (path: string) =>
    getRewrittenUrl(
      await unstable_getResponseFromNextConfig({
        url: `https://mluk.dev${path}`,
        nextConfig,
      }),
    );

  it.each([
    ["/feed.xml", "https://mluk.dev/en/feed.xml"],
    ["/wp-login.php", "https://mluk.dev/en/wp-login.php"],
    ["/wp-admin/install.php", "https://mluk.dev/en/wp-admin/install.php"],
    [
      "/.well-known/security.txt",
      "https://mluk.dev/en/.well-known/security.txt",
    ],
    ["/cv/mluk-cv-en.pdf", "https://mluk.dev/en/cv/mluk-cv-en.pdf"],
    ["/english/x.php", "https://mluk.dev/en/english/x.php"],
    ["/en.json", "https://mluk.dev/en/en.json"],
  ])("serves %s from the default locale", async (path, target) => {
    expect(await rewrittenTo(path)).toBe(target);
  });

  // A locale first segment is the locale's own (its 404 is localized), and
  // a missing `/_next/` file stays Next's plain 404.
  it.each([
    "/",
    "/en",
    "/writing",
    "/ru/feed.xml",
    "/en/wp-login.php",
    "/ru/cv/mluk-cv-ru.pdf",
    "/_next/static/chunks/missing.js",
  ])("leaves %s alone", async (path) => {
    expect(await rewrittenTo(path)).toBeNull();
  });
});

// Every path gets the security headers, a rewritten one too.
describe("security headers", () => {
  it.each(["/", "/en", "/ru/writing/some-post", "/feed.xml", "/robots.txt"])(
    "are sent on %s",
    async (path) => {
      const response = await unstable_getResponseFromNextConfig({
        url: `https://mluk.dev${path}`,
        nextConfig,
      });
      expect(response.headers.get("content-security-policy")).toContain(
        "frame-ancestors 'none'",
      );
      expect(response.headers.get("strict-transport-security")).toContain(
        "max-age=63072000",
      );
    },
  );
});
