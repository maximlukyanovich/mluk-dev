import { expect, it } from "vitest";

import { jsonShape } from "@/shared/lib/json-shape";

import { cvContent } from "./content";

it("has the same structure in en and ru", () => {
  expect(jsonShape(cvContent.ru)).toEqual(jsonShape(cvContent.en));
});
