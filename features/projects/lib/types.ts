/** Who the work was for — labelled from the dictionary (`projects.own.*`). */
export const owns = ["commercial", "personal"] as const;
export type Own = (typeof owns)[number];

/** What kind of work it is — labelled from `projects.type.*`. */
export const types = ["product", "site", "oss"] as const;
export type ProjectType = (typeof types)[number];

/** Where the work stands — labelled from `projects.status.*`. */
export const statuses = ["live", "building"] as const;
export type Status = (typeof statuses)[number];

/** A person the work was done with, shown as "feat." on the card. */
export type Collaborator = {
  name: string;
  /** Their page elsewhere; null shows the name as text. */
  href: string | null;
  /** A square image under `public/projects/people/`; null shows no avatar. */
  avatar: string | null;
};

/** One project of `content/projects/<locale>.json`, after the loader. */
export type Project = {
  /** Its 1-based position in the content file — the card's "01". */
  number: number;
  /** The future case page's URL segment; the same in every locale. */
  slug: string;
  name: string;
  /** Starred and listed first, wherever the list is filtered. */
  featured: boolean;
  own: Own;
  type: ProjectType;
  /** null shows no status (the home page's card meta stays empty). */
  status: Status | null;
  stack: string[];
  description: string;
  /** As written: a year or a span ("2024 — 2025"). */
  year: string;
  role: string;
  /** Each null hides its button. */
  links: { live: string | null; code: string | null };
  feat: Collaborator | null;
};

/**
 * A project as JSON gives it: the closed sets are plain strings until the
 * loader checks them, and the number is the position, not a field.
 */
export type ProjectSource = Omit<
  Project,
  "number" | "own" | "type" | "status"
> & { own: string; type: string; status: string | null };

/** A filter's value: one of the set, or every project. */
export type ProjectFilter = { own: Own | "all"; type: ProjectType | "all" };
