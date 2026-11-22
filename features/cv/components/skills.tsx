import type { CvContent } from "../lib/types";

type SkillsProps = {
  skills: CvContent["skills"];
  title: string;
};

/**
 * Skills on the CV (canvas, CV-A and M-CV): groups in columns of at least
 * 240px, each a caption over its tags. A group with no skills is left out,
 * and with none left, the section.
 */
export function Skills({ skills, title }: SkillsProps) {
  const groups = skills.filter(({ items }) => items.length);
  if (!groups.length) return null;

  return (
    <section className="pt-14 sm:pt-18" aria-labelledby="skills-h">
      <h2 className="mb-6 font-display text-display-section" id="skills-h">
        {title}
      </h2>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
        {groups.map(({ group, items }) => (
          <div key={group}>
            <h3 className="mb-3 font-mono text-caption text-muted uppercase">
              {group}
            </h3>
            <ul className="mk-tags">
              {items.map((item, index) => (
                <li key={`${item}-${index}`} className="mk-tag">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
