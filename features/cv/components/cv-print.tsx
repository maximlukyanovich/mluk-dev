import type { ReactNode } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { ownerEmail, profileLinks, siteUrl } from "@/shared/lib/site";

import { cvSource } from "../lib/source";
import type { CvContent } from "../lib/types";
import { yearsLabel } from "../lib/years";

type CvPrintProps = {
  cv: CvContent;
  dictionary: Dictionary;
};

const github = profileLinks[0];
const bare = (url: string) => url.replace(/^https:\/\//, "");

/**
 * The CV as one A4 sheet (canvas, CV-PDF) — what `pnpm cv:pdf` prints. Light
 * whatever the theme: the sheet pins `data-theme="light"`. White paper, the
 * frame's colour; the kit's light ground is grey. Rows are a 118px column
 * beside the text; an empty section is left out, as on the page.
 * `data-cv-source` names the data it was rendered from (`cvSource`).
 */
export function CvPrint({ cv, dictionary }: CvPrintProps) {
  const { profile } = cv;
  const copy = dictionary.cv;
  const skills = cv.skills.filter(({ items }) => items.length);

  return (
    <div className="overflow-x-auto py-10 print:overflow-visible print:p-0">
      <article
        data-theme="light"
        data-cv-sheet
        data-cv-source={cvSource(cv)}
        className="mx-auto flex h-[297mm] w-[210mm] flex-none flex-col gap-5 overflow-hidden bg-white px-16 py-15 font-sans text-base/normal text-fg"
      >
        <header className="flex items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-[34px]/[1.05] font-semibold tracking-[-0.03em]">
              {profile.name.first} {profile.name.last}
            </h1>
            <p className="mt-2 text-[17px] text-muted">
              {profile.role} · {profile.city}
            </p>
          </div>
          {/* The links one per line, not "site · github" as on the frame:
              with the real handle that line pushed the name onto two. */}
          <p className="shrink-0 text-right font-mono text-xs/[1.7] text-muted">
            {ownerEmail}
            <br />
            <a className="text-peri" href={siteUrl}>
              {bare(siteUrl)}
            </a>
            <br />
            <a className="text-peri" href={github}>
              {bare(github)}
            </a>
            {profile.openToWork && (
              <>
                <br />
                <span className="text-lime">
                  <span aria-hidden="true">● </span>
                  {dictionary.home.openToWork}
                </span>
              </>
            )}
          </p>
        </header>

        {cv.summary && <p>{cv.summary}</p>}

        {cv.experience.length > 0 && (
          <Section title={copy.experience}>
            {cv.experience.map((job) => (
              <Row
                key={`${job.start}-${job.company}-${job.role}`}
                label={yearsLabel(job, copy.now)}
              >
                <strong>{job.role}</strong>, {job.company}
                <p>{job.summary}</p>
              </Row>
            ))}
          </Section>
        )}

        {skills.length > 0 && (
          <Section title={copy.skills}>
            {skills.map(({ group, items }) => (
              <Row key={group} label={group}>
                {items.join(" · ")}
              </Row>
            ))}
          </Section>
        )}

        {(cv.education.length > 0 || cv.languages.length > 0) && (
          <div className="grid grid-cols-2 gap-6 border-t border-line pt-4.5">
            {cv.education.length > 0 && (
              <section>
                <SectionTitle>{copy.education}</SectionTitle>
                <ul className="flex flex-col gap-2">
                  {cv.education.map(({ degree, school, years }) => (
                    <li key={`${degree}-${school}-${years}`}>
                      <strong>{degree}</strong>
                      <p className="text-muted">
                        {school}, {years}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {cv.languages.length > 0 && (
              <section>
                <SectionTitle>{copy.languages}</SectionTitle>
                <ul>
                  {cv.languages.map(({ name, level }) => (
                    <li key={name}>
                      {name} — {level}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        <footer className="mt-auto flex justify-between font-mono text-xs text-muted">
          <span>
            mluk<span className="text-lime">.</span>dev/cv
          </span>
          <span>
            {copy.updated} <time dateTime={cv.updated}>{cv.updated}</time>
          </span>
        </footer>
      </article>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="mk-eyebrow mb-2.5 text-lime">{children}</h2>;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-line pt-4.5">
      <SectionTitle>{title}</SectionTitle>
      <ul className="flex flex-col gap-3">{children}</ul>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[118px_1fr] gap-x-5 gap-y-0.5">
      <span className="pt-0.75 font-mono text-xs text-muted">{label}</span>
      <div>{children}</div>
    </li>
  );
}
