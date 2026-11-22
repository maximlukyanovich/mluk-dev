import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  const data = { "@type": "Thing", name: "a </script><script>alert(1)" };

  it("never lets a value close the script element", () => {
    expect(serializeJsonLd(data)).not.toContain("<");
  });

  it("parses back into the same data", () => {
    expect(JSON.parse(serializeJsonLd(data))).toEqual(data);
  });
});
