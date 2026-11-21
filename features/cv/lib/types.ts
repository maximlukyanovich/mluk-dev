/** `content/cv/<locale>.json`; the JSON is checked by assignment to this type. */
export type CvContent = {
  profile: Profile;
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
