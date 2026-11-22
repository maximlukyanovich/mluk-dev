import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import { cvContent } from "../lib/content";
import type { CvContent, Experience } from "../lib/types";
import { CvIntro } from "./cv-intro";
import { EducationLanguages } from "./education-languages";
import { ExperienceTimeline } from "./experience-timeline";
import { Skills } from "./skills";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const ru = dictionaryFor("ru");

const job = (
  start: number,
  end: number | null,
  stack = ["css"],
): Experience => ({
  start,
  end,
  role: "Role",
  company: `Company ${start}`,
  summary: "Summary",
  stack,
});

const timeline = (experience: Experience[]) =>
  renderToStaticMarkup(
    <ExperienceTimeline
      experience={experience}
      copy={{ title: ru.cv.experience, now: ru.cv.now }}
    />,
  );

describe("ExperienceTimeline", () => {
  it("renders nothing without jobs", () => {
    expect(timeline([])).toBe("");
  });

  it("marks only the job that goes on as current", () => {
    const html = timeline([job(2023, null), job(2020, 2023), job(2019, 2019)]);
    expect(html.match(/ data-now="true"/g)).toHaveLength(1);
    expect(html).toMatch(
      /<li data-now="true"[^>]*><span class="[^"]*text-lime[^"]*">2023 — н\. в\.</,
    );
    expect(html).toContain("2020 — 2023");
    expect(html).toContain(">2019<");
  });

  it("leaves out the tags of a job without a stack", () => {
    const html = timeline([
      job(2023, null, ["css", "css"]),
      job(2020, 2023, []),
    ]);
    expect(html.match(/class="mk-tags/g)).toHaveLength(1);
    expect(html.match(/class="mk-tag"/g)).toHaveLength(2);
  });
});

describe("Skills", () => {
  it("leaves out empty groups, and the section with none left", () => {
    expect(
      renderToStaticMarkup(
        <Skills skills={[{ group: "Empty", items: [] }]} title="Skills" />,
      ),
    ).toBe("");
    const html = renderToStaticMarkup(
      <Skills
        skills={[
          { group: "Frontend", items: ["React"] },
          { group: "Empty", items: [] },
        ]}
        title="Skills"
      />,
    );
    expect(html).toContain("Frontend");
    expect(html).not.toContain("Empty");
  });
});

describe("EducationLanguages", () => {
  const copy = { education: "Education", languages: "Languages" };
  const education = [{ degree: "BSc", school: "University", years: "2012" }];
  const languages = [{ name: "English", level: "C1" }];

  it("renders nothing when both are empty", () => {
    expect(
      renderToStaticMarkup(
        <EducationLanguages education={[]} languages={[]} copy={copy} />,
      ),
    ).toBe("");
  });

  it("leaves out the empty one", () => {
    const html = renderToStaticMarkup(
      <EducationLanguages education={education} languages={[]} copy={copy} />,
    );
    expect(html).toContain('id="education-h"');
    expect(html).not.toContain('id="languages-h"');
    const other = renderToStaticMarkup(
      <EducationLanguages education={[]} languages={languages} copy={copy} />,
    );
    expect(other).not.toContain('id="education-h"');
    expect(other).toContain("<dt>English</dt><dd>C1</dd>");
  });
});

describe("CvIntro", () => {
  const intro = (cv: CvContent) =>
    renderToStaticMarkup(<CvIntro locale="ru" cv={cv} dictionary={ru} />);
  const cv = cvContent.ru;

  it("shows the status before the city when open to work", () => {
    const html = intro({ ...cv, profile: { ...cv.profile, openToWork: true } });
    expect(html).toContain(`${ru.home.openToWork} · ${cv.profile.city}`);
  });

  it("shows only the city otherwise", () => {
    const html = intro({
      ...cv,
      profile: { ...cv.profile, openToWork: false },
    });
    expect(html).not.toContain(ru.home.openToWork);
    expect(html).toContain(`</span>${cv.profile.city}</p>`);
  });

  it("downloads the locale's PDF and links the locale's contact page", () => {
    const html = intro(cv);
    expect(html).toContain('href="/cv/mluk-cv-ru.pdf" download=""');
    expect(html).toContain('href="/ru/contact"');
  });
});
