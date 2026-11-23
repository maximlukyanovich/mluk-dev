import path from "node:path";

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { dataHash } from "@/scripts/lib/cv-pdf.mjs";
import { dictionaryFor } from "@/shared/i18n/dictionaries";
import { locales } from "@/shared/i18n/locales";

import { cvContent } from "../lib/content";
import type { CvContent } from "../lib/types";
import { CvPrint } from "./cv-print";

const root = path.resolve(import.meta.dirname, "../../..");
const ru = dictionaryFor("ru");
// The real data gives the sheet its shape; what a test asserts is set here.
const cv: CvContent = {
  ...cvContent.ru,
  experience: [
    {
      start: 2021,
      end: null,
      role: "Инженер",
      company: "Компания",
      summary: "Итог",
      stack: [],
    },
  ],
  updated: "2026-12-01",
};
const sheet = (content: CvContent) =>
  renderToStaticMarkup(<CvPrint cv={content} dictionary={ru} />);

describe("CvPrint", () => {
  it("pins the light theme on the sheet", () => {
    expect(sheet(cv)).toMatch(
      /<article data-theme="light" data-cv-sheet="true"/,
    );
  });

  // `pnpm cv:pdf` refuses a sheet whose data-cv-source differs from its own
  // hash of the file, so the two sides are compared here, not re-implemented.
  it.each(locales)(
    "names the data it was rendered from, as cv:pdf hashes it (%s)",
    (locale) => {
      const html = renderToStaticMarkup(
        <CvPrint cv={cvContent[locale]} dictionary={dictionaryFor(locale)} />,
      );
      expect(html).toContain(`data-cv-source="${dataHash(root, locale)}"`);
    },
  );

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
    // Nor the rule above a section: education and languages share one frame.
    expect(html).not.toContain("border-t");
  });

  it("labels the current job and dates the sheet", () => {
    const html = sheet(cv);
    expect(html).toContain(`2021 — ${ru.cv.now}`);
    expect(html).toContain(
      `${ru.cv.updated} <time dateTime="2026-12-01">2026-12-01</time>`,
    );
  });
});
