/**
 * Where a post's video player loads from (features/blog/lib/embed.ts); the
 * blog's tests check every service's player against this list.
 */
export const frameOrigins = [
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
] as const;

/**
 * The Content-Security-Policy, without nonces: a nonce makes every page
 * render per request, and the site prerenders (owner, 2026-11-22). Inline
 * scripts stay allowed — Next's RSC payload and next-themes' script are
 * inline — while other origins, plugins, `<base>`, foreign forms and framing
 * by another site are not. A new third-party origin (analytics, Giscus,
 * Upstash) is added here. Dev adds `'unsafe-eval'` for React's debugging and
 * drops the HTTPS upgrade, since localhost is served over HTTP.
 */
export function contentSecurityPolicy(isDev: boolean): string {
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    `frame-src ${frameOrigins.join(" ")}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

/** The response headers every path gets (next.config.ts). */
export function securityHeaders(isDev: boolean) {
  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy(isDev) },
    // .dev is HSTS-preloaded as a whole TLD, so browsers already insist on
    // HTTPS; the header says the same for any client that lacks the list.
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    // For browsers without CSP's frame-ancestors.
    { key: "X-Frame-Options", value: "DENY" },
    {
      key: "Permissions-Policy",
      value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
    },
  ];
}
