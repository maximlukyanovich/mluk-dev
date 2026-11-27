import { describe, expect, it } from "vitest";

import { locales, type Locale } from "@/shared/i18n/locales";
import { jsonShape } from "@/shared/lib/json-shape";

import { getHowIWork, howIWorkContent, loadHowIWork } from "./content";
import type { HowIWorkSource } from "./types";

/** A fresh copy of the English content, for a test to break. */
const source = (): HowIWorkSource => structuredClone(howIWorkContent.en);

describe("the content", () => {
  it("has the same structure in en and ru", () => {
    expect(jsonShape(howIWorkContent.ru)).toEqual(
      jsonShape(howIWorkContent.en),
    );
  });

  it("agrees between en and ru on everything that is not language", () => {
    const fixed = (locale: Locale) => {
      const { flow, phases, command, offer } = getHowIWork(locale);
      return {
        lanes: flow.lanes.map(({ from, to }) => [from, to]),
        phases: phases.map((phase) => ({
          number: phase.number,
          id: phase.id,
          loop: phase.loop !== undefined,
          kind: phase.illustration.kind,
          icons: phase.steps.map(({ icon }) => icon),
          examples: phase.examples,
          post: phase.post?.slug,
        })),
        project: command.project,
        channels: offer.channels,
      };
    };
    expect(fixed("ru")).toEqual(fixed("en"));
  });

  it("loads in every locale", () => {
    for (const locale of locales) {
      expect(getHowIWork(locale).phases.map(({ number }) => number)).toEqual([
        1, 2, 3, 4,
      ]);
    }
  });
});

describe("loadHowIWork", () => {
  it("refuses an icon outside the set", () => {
    const broken = source();
    broken.phases[0].steps[0].icon = "rocket";
    expect(() => loadHowIWork(broken)).toThrow(
      'Unknown icon of step "Idea review" "rocket"',
    );
  });

  it("refuses an illustration outside the set", () => {
    const broken = source();
    broken.phases[1].illustration.kind = "photo";
    expect(() => loadHowIWork(broken)).toThrow(
      'Unknown illustration of phase "design" "photo"',
    );
  });

  it.each([
    [0, 1],
    [2, 5],
    [1.5, 2],
  ])("refuses a lane outside the columns: %s…%s", (from, to) => {
    const broken = source();
    broken.flow.lanes[0] = { label: "lane", from, to };
    expect(() => loadHowIWork(broken)).toThrow(/column of flow lane "lane"/);
  });

  it("refuses a lane that ends before it starts", () => {
    const broken = source();
    broken.flow.lanes[0] = { label: "lane", from: 3, to: 2 };
    expect(() => loadHowIWork(broken)).toThrow(
      'The flow lane "lane" ends (2) before it starts (3)',
    );
  });

  it("keeps a lane across several columns", () => {
    const wide = source();
    wide.flow.lanes = [{ label: "lane", from: 1, to: 4 }];
    expect(loadHowIWork(wide).flow.lanes).toEqual([
      { label: "lane", from: 1, to: 4 },
    ]);
  });

  it("refuses a flow of other than four phases", () => {
    const broken = source();
    broken.phases.pop();
    expect(() => loadHowIWork(broken)).toThrow(
      "The page draws 4 phases, the content has 3",
    );
  });

  it("refuses repeated phase ids", () => {
    const broken = source();
    broken.phases[3].id = "discover";
    expect(() => loadHowIWork(broken)).toThrow("Phase ids repeat");
  });

  it("refuses an unknown channel", () => {
    const broken = source();
    broken.offer.channels = ["telegram", "fax"];
    expect(() => loadHowIWork(broken)).toThrow('Unknown offer channel "fax"');
  });

  it.each(["The whole path is in the blog.", "{post} and {post}"])(
    "refuses a post line without one {post}: %s",
    (text) => {
      const broken = source();
      broken.phases[1].post = { slug: "a-post", text };
      expect(() => loadHowIWork(broken)).toThrow(
        'The post line of phase "design" must hold {post} once',
      );
    },
  );

  it("refuses a reply line without {replies}", () => {
    const broken = source();
    broken.offer.reply = "I reply soon.";
    expect(() => loadHowIWork(broken)).toThrow(
      "The offer's reply line must hold {replies} once",
    );
  });
});
