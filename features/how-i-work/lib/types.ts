import type { ChannelId } from "@/shared/lib/site";

/**
 * A step's icon, by its name in `lucide-react` — the page maps each to its
 * component. "All pages" repeats `panels-top-left`, as the artboard does.
 */
export const stepIcons = [
  "lightbulb",
  "workflow",
  "file-text",
  "layers-2",
  "panels-top-left",
  "grid-2x2-plus",
  "terminal",
  "git-pull-request",
  "circle-check",
  "globe",
  "key-round",
  "life-buoy",
] as const;
export type StepIcon = (typeof stepIcons)[number];

/** Which of the four drawings a phase shows above its steps. */
export const illustrationKinds = [
  "notes",
  "variants",
  "preview",
  "handover",
] as const;
export type IllustrationKind = (typeof illustrationKinds)[number];

/** A column of the phase flow: the number of the phase above it. */
export const columns = [1, 2, 3, 4] as const;
export type Column = (typeof columns)[number];

/** One step of a phase: its line in the flow and its row in the section. */
export type Step = { icon: StepIcon; title: string; text: string };

/** A phase's drawing; `label` is its `aria-label`, `items` its captions. */
export type Illustration = {
  kind: IllustrationKind;
  label: string;
  items: string[];
};

/**
 * Work that runs beside the phases, under the flow: it spans the columns
 * `from` to `to`, both included — `{ from: 2, to: 2 }` sits under Design.
 */
export type FlowLane = { label: string; from: Column; to: Column };

/** One phase of `content/how-i-work/<locale>.json`, after the loader. */
export type Phase = {
  /** Its 1-based position in the content file — the phase's "01". */
  number: number;
  /** The section's anchor; the same in every locale. */
  id: string;
  title: string;
  summary: string;
  /** What repeats inside the phase; absent, the phase shows no "repeats". */
  loop?: string;
  /** What the phase hands on — the pill with the check. */
  outcome: string;
  illustration: Illustration;
  steps: Step[];
  /** The phase's parallel work, written out; empty when it has none. */
  lanes: string[];
  /** Slugs of the projects in the phase's ribbon. */
  examples?: string[];
  /**
   * A post the phase points to; `text` holds `{post}` where its badge goes.
   * The sentence is left out while the post does not exist in the locale.
   */
  post?: { slug: string; text: string };
};

/** The How I work page's content in one locale. */
export type HowIWorkContent = {
  hero: { lead: string };
  flow: { lanes: FlowLane[] };
  phases: Phase[];
  /** "You choose on a canvas"; `label` is the drawing's `aria-label`. */
  canvas: { title: string; text: string; label: string };
  /** "A project starts in one command"; `project` is the badge's slug. */
  command: { title: string; text: string; project: string };
  tools: { title: string; groups: { label: string; items: string[] }[] };
  /** "How I am registered": the terms of the work and the facts list. */
  registered: {
    title: string;
    text: string;
    facts: { term: string; value: string }[];
  };
  /** "Want a site like this one?" at the end of the page. */
  offer: {
    title: string;
    text: string;
    /** The kinds of site; `meta` is the card's time ("[a few days]"). */
    kinds: { meta: string; title: string; text: string }[];
    /** The channel tiles, in this order; those without an address are hidden. */
    channels: ChannelId[];
    /**
     * The line under the tiles, with `{replies}` — the contact page's value.
     * In Russian that value is written in the genitive ("[2 дней]"), as the
     * contact page's own "в течение {replies}" needs.
     */
    reply: string;
  };
};

/**
 * A phase as JSON gives it: the closed sets are plain strings until the
 * loader checks them, and the number is found, not a field.
 */
export type PhaseSource = Omit<Phase, "number" | "illustration" | "steps"> & {
  illustration: Omit<Illustration, "kind"> & { kind: string };
  steps: (Omit<Step, "icon"> & { icon: string })[];
};

/** The page's content as JSON gives it. */
export type HowIWorkSource = Omit<
  HowIWorkContent,
  "flow" | "phases" | "offer"
> & {
  flow: { lanes: { label: string; from: number; to: number }[] };
  phases: PhaseSource[];
  offer: Omit<HowIWorkContent["offer"], "channels"> & { channels: string[] };
};
