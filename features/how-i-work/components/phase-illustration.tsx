import { Check } from "lucide-react";

import { cn } from "@/shared/lib/cn";

import type { Illustration } from "../lib/types";

/*
 * The phases' small drawings (How-K2, `.ill`): HTML and CSS on the kit's
 * grid, one per kind. Each is one image to a screen reader — its label comes
 * from the content, and what is inside is decoration.
 */

const ground =
  "mk-ground [--grid-cell:24px] flex flex-wrap border border-dashed border-line";

const bar = "block h-1.5 rounded-pill bg-ph";

/** Three page variants with the middle one chosen. */
export function VariantFrames({ size }: { size: "phase" | "canvas" }) {
  const frame = cn(
    "relative flex flex-col gap-1.5 rounded-[12px] border border-line bg-glass p-[9px]",
    size === "phase"
      ? "h-[110px] flex-[0_1_96px]"
      : "h-[150px] flex-[1_1_140px]",
  );
  return [false, true, false].map((chosen, index) => (
    <span key={index} className={cn(frame, chosen && "border-lime")}>
      <span className={bar} />
      <span className={bar} />
      <span className="block flex-1 rounded-xs bg-ph" />
      {chosen && (
        <span className="absolute -top-[9px] right-2 flex size-[18px] items-center justify-center rounded-full bg-lime text-on-lime">
          <Check size={11} strokeWidth={3} />
        </span>
      )}
    </span>
  ));
}

function Note({ text, wide }: { text: string; wide?: boolean }) {
  return (
    <span
      className={cn(
        "h-[62px] rounded-[10px] bg-ph p-2 font-mono text-[10px]/[1.6] text-muted",
        wide ? "w-[120px]" : "w-[92px]",
      )}
    >
      {text}
    </span>
  );
}

/** A browser window: its address bar and lines of a page. */
function Window({ title, lines }: { title: string; lines: string[] }) {
  return (
    <span className="max-w-[300px] flex-[1_1_240px] overflow-hidden rounded-inner border border-line bg-glass">
      <span className="flex items-center gap-1.5 border-b border-line px-2.5 py-2 font-mono text-[10px]/[1.6] text-muted">
        <span className="size-[7px] rounded-full bg-ph" />
        <span className="size-[7px] rounded-full bg-ph" />
        <span className="size-[7px] rounded-full bg-ph" />
        {title}
      </span>
      <span className="flex flex-col gap-1.5 p-3">
        {lines.map((width, index) => (
          <span key={index} className={cn("h-2 rounded-pill bg-ph", width)} />
        ))}
      </span>
    </span>
  );
}

function Drawing({ kind, items }: Illustration) {
  switch (kind) {
    case "notes":
      return items.map((item) => <Note key={item} text={item} />);
    case "variants":
      return <VariantFrames size="phase" />;
    case "preview":
      return <Window title={items[0]} lines={["w-3/5", "w-full", "w-4/5"]} />;
    case "handover":
      return (
        <>
          <Window title={items[0]} lines={["w-1/2", "w-full"]} />
          <Note text={items[1]} wide />
        </>
      );
  }
}

/** A phase's drawing over its steps. */
export function PhaseIllustration({
  illustration,
}: {
  illustration: Illustration;
}) {
  return (
    <div
      className={cn(
        ground,
        "min-h-[170px] content-center justify-center gap-2.5 rounded-card p-4.5",
      )}
      role="img"
      aria-label={illustration.label}
    >
      <Drawing {...illustration} />
    </div>
  );
}

/** "You choose on a canvas": the same variants, larger. */
export function CanvasIllustration({ label }: { label: string }) {
  return (
    <div
      className={cn(ground, "min-w-0 flex-[1_1_520px] gap-4 rounded-panel p-6")}
      role="img"
      aria-label={label}
    >
      <VariantFrames size="canvas" />
    </div>
  );
}
