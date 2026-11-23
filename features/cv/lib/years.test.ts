import { describe, expect, it } from "vitest";

import { yearsLabel } from "./years";

describe("yearsLabel", () => {
  it("joins the start and the end with a dash", () => {
    expect(yearsLabel({ start: 2020, end: 2023 }, "NOW")).toBe("2020 — 2023");
  });

  it("ends with the dictionary's word while the job goes on", () => {
    expect(yearsLabel({ start: 2023, end: null }, "н. в.")).toBe(
      "2023 — н. в.",
    );
  });

  it("gives one year for a job that began and ended in it", () => {
    expect(yearsLabel({ start: 2021, end: 2021 }, "NOW")).toBe("2021");
  });
});
