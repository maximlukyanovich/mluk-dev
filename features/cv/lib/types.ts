/** `content/cv/<locale>.json`; the JSON is checked by assignment to this type. */
export type CvContent = {
  profile: Profile;
  /** The line under the name on the CV page. */
  headline: string;
  /** The paragraph under the header of the PDF. */
  summary: string;
  /** The paragraphs of the About section on the CV page; empty, no section. */
  about: string[];
  /** Newest first. */
  experience: Experience[];
  skills: { group: string; items: string[] }[];
  education: { degree: string; school: string; years: string }[];
  languages: { name: string; level: string }[];
  /** ISO date of the last change: "Updated" in the PDF, `dateModified`. */
  updated: string;
};

export type Experience = {
  start: number;
  /** null while the job goes on — labelled from the dictionary, not here. */
  end: number | null;
  role: string;
  company: string;
  summary: string;
  stack: string[];
};

export type Profile = {
  name: { first: string; last: string };
  role: string;
  city: string;
  /** The sentence under the name on the home page. */
  lead: string;
  /** Shows the "Open to work" status on the photo. */
  openToWork: boolean;
  /** A square image under `public/`; null shows the placeholder. */
  photo: { src: string; alt: string } | null;
  /** The languages shown at the top of the profile card, e.g. `EN · RU`. */
  languages: string;
  facts: { term: string; value: string }[];
};
