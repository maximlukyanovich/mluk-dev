import en from "@/content/how-i-work/en.json";
import ru from "@/content/how-i-work/ru.json";
import type { Locale } from "@/shared/i18n/locales";
import { channels, type ChannelId } from "@/shared/lib/site";

import {
  columns,
  illustrationKinds,
  stepIcons,
  type Column,
  type FlowLane,
  type HowIWorkContent,
  type HowIWorkSource,
  type IllustrationKind,
  type Phase,
} from "./types";

/** The flow has one column per phase, and the page draws four. */
const phaseCount = columns.length;

function oneOf<T extends string | number>(
  set: readonly T[],
  value: string | number,
  what: string,
): T {
  if ((set as readonly (string | number)[]).includes(value)) return value as T;
  throw new Error(
    `Unknown ${what} "${value}"; expected one of ${set.join(", ")}`,
  );
}

/**
 * The captions each drawing shows (`phase-illustration.tsx`): the notes one
 * or more, the variants none, the preview its window's title, the handover
 * the window's title and the note.
 */
const captions: Record<IllustrationKind, { min: number; max: number }> = {
  notes: { min: 1, max: Infinity },
  variants: { min: 0, max: 0 },
  preview: { min: 1, max: 1 },
  handover: { min: 2, max: 2 },
};

/** A list the page keys by its values: a repeat would draw an item twice. */
function noRepeats(values: readonly string[], what: string): void {
  const seen = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) throw new Error(`${what} repeat: "${value}"`);
    seen.add(value);
  }
}

function placeholderOnce(text: string, name: string, what: string): void {
  const count = text.split(`{${name}}`).length - 1;
  if (count !== 1) {
    throw new Error(
      `${what} must hold {${name}} once, found ${count}: "${text}"`,
    );
  }
}

function loadLane({
  label,
  from,
  to,
}: HowIWorkSource["flow"]["lanes"][number]): FlowLane {
  const what = `flow lane "${label}"`;
  const lane = {
    label,
    from: oneOf<Column>(columns, from, `start column of ${what}`),
    to: oneOf<Column>(columns, to, `end column of ${what}`),
  };
  if (lane.from > lane.to) {
    throw new Error(`The ${what} ends (${to}) before it starts (${from})`);
  }
  return lane;
}

function loadPhase(
  phase: HowIWorkSource["phases"][number],
  index: number,
): Phase {
  const of = `of phase "${phase.id}"`;
  if (phase.post) {
    placeholderOnce(phase.post.text, "post", `The post line ${of}`);
  }
  const kind = oneOf(
    illustrationKinds,
    phase.illustration.kind,
    `illustration ${of}`,
  );
  const { items } = phase.illustration;
  const { min, max } = captions[kind];
  if (items.length < min || items.length > max) {
    const takes = max === Infinity ? `${min} or more` : String(min);
    throw new Error(
      `The ${kind} drawing ${of} takes ${takes} captions, the content has ${items.length}`,
    );
  }
  noRepeats(items, `Captions ${of}`);
  noRepeats(
    phase.steps.map((step) => step.title),
    `Step titles ${of}`,
  );
  noRepeats(phase.lanes, `Lanes ${of}`);
  noRepeats(phase.examples ?? [], `Examples ${of}`);
  return {
    ...phase,
    number: index + 1,
    illustration: { ...phase.illustration, kind },
    steps: phase.steps.map((step) => ({
      ...step,
      icon: oneOf(stepIcons, step.icon, `icon of step "${step.title}"`),
    })),
  };
}

/**
 * Checks the closed sets, the shape the page draws and the lists it keys by
 * their values, and numbers the phases by their position. A wrong value throws, so the build fails instead
 * of drawing a missing icon or a lane outside the flow.
 */
export function loadHowIWork(source: HowIWorkSource): HowIWorkContent {
  if (source.phases.length !== phaseCount) {
    throw new Error(
      `The page draws ${phaseCount} phases, the content has ${source.phases.length}`,
    );
  }
  noRepeats(
    source.phases.map((phase) => phase.id),
    "Phase ids",
  );
  noRepeats(
    source.flow.lanes.map((lane) => lane.label),
    "Flow lane labels",
  );
  noRepeats(
    source.tools.groups.map((group) => group.label),
    "Tool groups",
  );
  for (const group of source.tools.groups) {
    noRepeats(group.items, `Tools of group "${group.label}"`);
  }
  noRepeats(
    source.registered.facts.map((fact) => fact.term),
    "Registered facts",
  );
  noRepeats(
    source.offer.kinds.map((kind) => kind.title),
    "Offer kinds",
  );
  noRepeats(source.offer.channels, "Offer channels");
  placeholderOnce(source.offer.reply, "replies", "The offer's reply line");
  return {
    ...source,
    flow: { lanes: source.flow.lanes.map(loadLane) },
    phases: source.phases.map(loadPhase),
    offer: {
      ...source.offer,
      channels: source.offer.channels.map((id) =>
        oneOf(Object.keys(channels) as ChannelId[], id, "offer channel"),
      ),
    },
  };
}

/** Both locales' raw content, for the tests that read the real data. */
export const howIWorkContent: Record<Locale, HowIWorkSource> = { en, ru };

let cache: Partial<Record<Locale, HowIWorkContent>> = {};

/** The How I work page's content of `locale`, checked once per build. */
export function getHowIWork(locale: Locale): HowIWorkContent {
  if (process.env.NODE_ENV === "development") cache = {};
  return (cache[locale] ??= loadHowIWork(howIWorkContent[locale]));
}
