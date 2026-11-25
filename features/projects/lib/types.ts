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
  /** The case page's URL segment and folder; the same in every locale. */
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
  /** As written ("Solo", "3 people"); null hides it on the case page. */
  team: string | null;
  /**
   * A 16:10 image under `public/projects/<slug>/`, as a site path: the top of
   * the case page, its Open Graph image and the card's picture. null shows
   * none, and the card keeps its placeholder.
   */
  cover: string | null;
  /** Each null hides its button. */
  links: { live: string | null; code: string | null };
  feat: Collaborator | null;
  /**
   * It has a case page: `content/projects/<slug>/<locale>.mdx` exists. Found
   * by the loader, not written in the JSON.
   */
  hasCase: boolean;
};

/**
 * A project as JSON gives it: the closed sets are plain strings until the
 * loader checks them, and the number and the case are found, not fields.
 */
export type ProjectSource = Omit<
  Project,
  "number" | "own" | "type" | "status" | "hasCase"
> & { own: string; type: string; status: string | null };

/** A filter's value: one of the set, or every project. */
export type ProjectFilter = { own: Own | "all"; type: ProjectType | "all" };
