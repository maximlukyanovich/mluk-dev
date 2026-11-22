import { describe, expect, it } from "vitest";

import { postJsonLd } from "./structured-data";
import { testPost } from "./test-posts";

describe("postJsonLd", () => {
  const post = testPost("hello", "ru", ["react", "next"], "2026-11-18");

  it("describes the post with absolute URLs in its locale", () => {
    expect(postJsonLd(post, "ru", "Maxim Lukyanovich")).toEqual({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: "hello",
      description: "About hello.",
      datePublished: "2026-11-18",
      dateModified: "2026-11-18",
      author: {
        "@type": "Person",
        "@id": "https://mluk.dev/#person",
        name: "Maxim Lukyanovich",
        url: "https://mluk.dev/ru",
      },
      image: "https://mluk.dev/ru/writing/hello/cover.png",
      inLanguage: "ru",
      url: "https://mluk.dev/ru/writing/hello",
      mainEntityOfPage: "https://mluk.dev/ru/writing/hello",
      keywords: ["react", "next"],
    });
  });

  it("takes the modified date from `updated` when the post has one", () => {
    const updated = { ...post, updated: "2026-11-20" };
    expect(postJsonLd(updated, "ru", "M").dateModified).toBe("2026-11-20");
  });
});
