import { describe, expect, it } from "vitest";

import { buildRss, rfc822 } from "./rss";
import { testPost } from "./test-posts";

const channel = {
  locale: "en" as const,
  title: "mluk.dev · Writing",
  description: "Posts.",
};
const origin = "https://mluk.dev";

const items = (xml: string) => xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];

describe("buildRss", () => {
  it("escapes & < > \" ' in text", () => {
    const post = {
      ...testPost("a", "en", ["css"]),
      title: `Tom & "Jerry" <3 it's`,
      description: "a < b && c > d",
    };
    const xml = buildRss(channel, [post], origin);
    expect(xml).toContain(
      "<title>Tom &amp; &quot;Jerry&quot; &lt;3 it&apos;s</title>",
    );
    expect(xml).toContain(
      "<description>a &lt; b &amp;&amp; c &gt; d</description>",
    );
    expect(xml).not.toMatch(/<title>[^<]*&(?!amp;|quot;|lt;|gt;|apos;)/);
  });

  it("links absolutely, to the locale's pages and to itself", () => {
    const xml = buildRss(channel, [testPost("hello", "en")], origin);
    expect(xml).toContain("<link>https://mluk.dev/en/writing</link>");
    expect(xml).toContain(
      '<atom:link href="https://mluk.dev/en/feed.xml" rel="self" type="application/rss+xml"/>',
    );
    expect(xml).toContain(
      '<guid isPermaLink="true">https://mluk.dev/en/writing/hello</guid>',
    );
    expect(xml).toContain("<language>en</language>");
  });

  it("dates in RFC 822, the build date from the latest change", () => {
    expect(rfc822("2026-11-18")).toBe("Wed, 18 Nov 2026 00:00:00 GMT");
    const xml = buildRss(
      channel,
      [
        { ...testPost("a", "en", [], "2026-11-01"), updated: "2026-11-20" },
        testPost("b", "en", [], "2026-11-18"),
      ],
      origin,
    );
    expect(xml).toContain("<pubDate>Wed, 18 Nov 2026 00:00:00 GMT</pubDate>");
    expect(xml).toContain(
      "<lastBuildDate>Fri, 20 Nov 2026 00:00:00 GMT</lastBuildDate>",
    );
  });

  it("lists the newest first, tags as categories", () => {
    const xml = buildRss(
      channel,
      [
        testPost("old", "en", ["css"], "2026-01-01"),
        testPost("new", "en", ["mdx", "nextjs"], "2026-11-01"),
      ],
      origin,
    );
    const [first, second] = items(xml);
    expect(first).toContain("/en/writing/new<");
    expect(first).toContain("<category>mdx</category>");
    expect(first).toContain("<category>nextjs</category>");
    expect(second).toContain("/en/writing/old<");
  });

  it("is a valid empty channel without posts", () => {
    const xml = buildRss(channel, [], origin);
    expect(items(xml)).toHaveLength(0);
    expect(xml).not.toContain("lastBuildDate");
    expect(xml).toMatch(/^<\?xml version="1.0" encoding="UTF-8"\?>\n<rss /);
    expect(xml).toMatch(/<channel>[\s\S]*<\/channel>\n<\/rss>\n$/);
  });
});
