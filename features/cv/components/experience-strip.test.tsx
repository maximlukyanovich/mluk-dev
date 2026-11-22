import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";

import type { Experience } from "../lib/types";
import { ExperienceStrip } from "./experience-strip";

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

const job = (start: number, end: number | null): Experience => ({
  start,
  end,
  role: `Role ${start}`,
  company: `Company ${start}`,
  summary: "Summary",
  stack: ["css"],
});

const strip = (experience: Experience[]) =>
  renderToStaticMarkup(
    <ExperienceStrip locale="ru" experience={experience} copy={ru.cv} />,
  );

describe("ExperienceStrip", () => {
  it("renders nothing without jobs", () => {
    expect(strip([])).toBe("");
  });

  it("shows the first three jobs in order, the one that goes on as current", () => {
    const html = strip([
      job(2023, null),
      job(2020, 2023),
      job(2017, 2020),
      job(2015, 2017),
    ]);
    expect(html.match(/<li /g)).toHaveLength(3);
    expect(html.match(/Role \d{4}/g)).toEqual([
      "Role 2023",
      "Role 2020",
      "Role 2017",
    ]);
    expect(html.match(/ data-now="true"/g)).toHaveLength(1);
    expect(html).toMatch(
      /<li data-now="true"[^>]*><span class="[^"]*text-lime[^"]*">2023 — н\. в\.</,
    );
  });

  it("links the locale's CV page and downloads its PDF", () => {
    const html = strip([job(2023, null)]);
    expect(html).toContain(`href="/ru/cv" class="mk-link">${ru.cv.fullCv} `);
    expect(html).toContain('href="/cv/mluk-cv-ru.pdf" download=""');
  });
});
