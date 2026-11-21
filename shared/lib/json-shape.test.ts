import { describe, expect, it } from "vitest";

import { jsonShape } from "./json-shape";

describe("jsonShape", () => {
  it("is equal for the same keys, lengths and leaf types", () => {
    expect(jsonShape({ a: "x", b: [1, { c: true }] })).toEqual(
      jsonShape({ b: [2, { c: false }], a: "y" }),
    );
  });

  it("differs on a missing key, an extra item or a changed type", () => {
    const base = jsonShape({ a: "x", b: [1] });
    expect(jsonShape({ a: "x" })).not.toEqual(base);
    expect(jsonShape({ a: "x", b: [1, 2] })).not.toEqual(base);
    expect(jsonShape({ a: null, b: [1] })).not.toEqual(base);
  });
});
