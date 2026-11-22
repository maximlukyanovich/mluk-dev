import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import { JsonLd } from "@/shared/ui/json-ld";

import { getCv } from "../lib/content";
import { profilePageJsonLd } from "../lib/structured-data";
import { CvIntro } from "./cv-intro";
import { EducationLanguages } from "./education-languages";
import { ExperienceTimeline } from "./experience-timeline";
import { Skills } from "./skills";

type CvPageProps = {
  locale: Locale;
  dictionary: Dictionary;
};

/**
 * The CV page (canvas, CV-A and M-CV) in the order of the PDF: header,
 * experience, skills, education and languages; the ProfilePage for search
 * engines.
 */
export function CvPage({ locale, dictionary }: CvPageProps) {
  const cv = getCv(locale);
  const copy = dictionary.cv;

  return (
    <>
      <JsonLd data={profilePageJsonLd(cv, locale)} />
      <CvIntro locale={locale} cv={cv} dictionary={dictionary} />
      <ExperienceTimeline
        experience={cv.experience}
        copy={{ title: copy.experience, now: copy.now }}
      />
      <Skills skills={cv.skills} title={copy.skills} />
      <EducationLanguages
        education={cv.education}
        languages={cv.languages}
        copy={copy}
      />
    </>
  );
}
