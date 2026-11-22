import { describe, expect, it } from "vitest";

import { contentSecurityPolicy, securityHeaders } from "./security-headers";

const directives = (policy: string) =>
  new Map(
    policy.split("; ").map((directive) => {
      const [name, ...values] = directive.split(" ");
      return [name, values];
    }),
  );

describe("contentSecurityPolicy", () => {
  it("allows inline scripts but no other origin, in production", () => {
    const policy = directives(contentSecurityPolicy(false));
    expect(policy.get("script-src")).toEqual(["'self'", "'unsafe-inline'"]);
    expect(policy.get("default-src")).toEqual(["'self'"]);
    expect(policy.get("frame-ancestors")).toEqual(["'none'"]);
    expect(policy.get("object-src")).toEqual(["'none'"]);
    expect(policy.has("upgrade-insecure-requests")).toBe(true);
  });

  it("adds eval and keeps HTTP in dev", () => {
    const policy = directives(contentSecurityPolicy(true));
    expect(policy.get("script-src")).toContain("'unsafe-eval'");
    expect(policy.has("upgrade-insecure-requests")).toBe(false);
  });
});

describe("securityHeaders", () => {
  it("sends each header once", () => {
    const keys = securityHeaders(false).map(({ key }) => key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toEqual(
      expect.arrayContaining([
        "Content-Security-Policy",
        "Strict-Transport-Security",
        "X-Content-Type-Options",
        "Referrer-Policy",
        "X-Frame-Options",
        "Permissions-Policy",
      ]),
    );
  });
});
