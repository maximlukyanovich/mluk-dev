type AboutProps = {
  paragraphs: readonly string[];
  title: string;
};

/**
 * About on the CV (canvas, CV-About-A and M-CV-About): under the header,
 * before the experience, titled like the other sections; lines up to 680px.
 * No paragraphs, no section.
 */
export function About({ paragraphs, title }: AboutProps) {
  if (!paragraphs.length) return null;

  return (
    <section className="pt-14 sm:pt-18" aria-labelledby="about-h">
      <h2 className="mb-6 font-display text-display-section" id="about-h">
        {title}
      </h2>
      <div className="flex max-w-170 flex-col gap-4 text-[17px]/[1.7] sm:text-lg/[1.7]">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
