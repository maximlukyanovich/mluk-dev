import type { CvContent } from "../lib/types";

type EducationLanguagesProps = {
  education: CvContent["education"];
  languages: CvContent["languages"];
  copy: { education: string; languages: string };
};

/**
 * Education and languages side by side on the CV (canvas, CV-A and M-CV);
 * languages as the kit's facts. An empty one is left out, and with both
 * empty, the row.
 */
export function EducationLanguages({
  education,
  languages,
  copy,
}: EducationLanguagesProps) {
  if (!education.length && !languages.length) return null;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6 pt-14 sm:pt-18">
      {education.length > 0 && (
        <section aria-labelledby="education-h">
          <h2 className="font-display text-display-h2" id="education-h">
            {copy.education}
          </h2>
          <ul className="mt-4 flex flex-col gap-2">
            {education.map(({ degree, school, years }) => (
              <li key={`${degree}-${school}-${years}`}>
                <strong>{degree}</strong> ·{" "}
                <span className="text-muted">
                  {school}, {years}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {languages.length > 0 && (
        <section aria-labelledby="languages-h">
          <h2 className="font-display text-display-h2" id="languages-h">
            {copy.languages}
          </h2>
          <dl className="mk-facts mt-4">
            {languages.map(({ name, level }) => (
              <div key={name} className="contents">
                <dt>{name}</dt>
                <dd>{level}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}
    </div>
  );
}
