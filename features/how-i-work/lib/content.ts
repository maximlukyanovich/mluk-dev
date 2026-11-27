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
  if (phase.post) {
    const what = `The post line of phase "${phase.id}"`;
    placeholderOnce(phase.post.text, "post", what);
  }
  return {
    ...phase,
    number: index + 1,
    illustration: {
      ...phase.illustration,
      kind: oneOf(
        illustrationKinds,
        phase.illustration.kind,
        `illustration of phase "${phase.id}"`,
      ),
    },
    steps: phase.steps.map((step) => ({
      ...step,
      icon: oneOf(stepIcons, step.icon, `icon of step "${step.title}"`),
    })),
  };
}

/**
 * Checks the closed sets and the shape the page draws, and numbers the
 * phases by their position. A wrong value throws, so the build fails instead
 * of drawing a missing icon or a lane outside the flow.
 */
export function loadHowIWork(source: HowIWorkSource): HowIWorkContent {
  if (source.phases.length !== phaseCount) {
    throw new Error(
      `The page draws ${phaseCount} phases, the content has ${source.phases.length}`,
    );
  }
  const ids = source.phases.map((phase) => phase.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`Phase ids repeat: ${ids.join(", ")}`);
  }
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
