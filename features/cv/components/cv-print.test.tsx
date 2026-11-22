import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { cvContent } from "../lib/content";
import type { CvContent } from "../lib/types";
import { CvPrint } from "./cv-print";

const ru = dictionaryFor("ru");
const cv = cvContent.ru;
const sheet = (content: CvContent) =>
  renderToStaticMarkup(<CvPrint cv={content} dictionary={ru} />);

describe("CvPrint", () => {
  it("pins the light theme on the sheet", () => {
    expect(sheet(cv)).toMatch(
      /<article data-theme="light" data-cv-sheet="true"/,
    );
  });

  it("shows the status only when open to work", () => {
    const open = { ...cv, profile: { ...cv.profile, openToWork: true } };
    const closed = { ...cv, profile: { ...cv.profile, openToWork: false } };
    expect(sheet(open)).toContain(ru.home.openToWork);
    expect(sheet(closed)).not.toContain(ru.home.openToWork);
  });

  it("leaves out empty sections", () => {
    const html = sheet({
      ...cv,
      experience: [],
      skills: [{ group: "Empty", items: [] }],
      education: [],
      languages: [],
    });
    for (const title of [
      ru.cv.experience,
      ru.cv.skills,
      ru.cv.education,
      ru.cv.languages,
    ])
      expect(html).not.toContain(`>${title}</h2>`);
    expect(html).not.toContain("Empty");
  });

  it("labels the current job and dates the sheet", () => {
    const html = sheet(cv);
    expect(html).toContain(`2023 — ${ru.cv.now}`);
    expect(html).toContain(
      `${ru.cv.updated} <time dateTime="${cv.updated}">${cv.updated}</time>`,
    );
  });
});
