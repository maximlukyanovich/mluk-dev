import { cn } from "@/shared/lib/cn";

type LaneProps = {
  label: string;
  /** "in parallel": shown before the label, or read out only. */
  prefix: string;
  showPrefix?: boolean;
  className?: string;
};

/**
 * Work that runs beside a phase — the dashed bar of How-K2. The text wraps
 * instead of being cut with an ellipsis, so a long Russian label stays whole
 * on a phone (owner, 2026-11-27).
 */
export function Lane({ label, prefix, showPrefix, className }: LaneProps) {
  return (
    <li
      className={cn(
        "rounded-card border border-dashed border-line px-3.5 py-1.75 font-mono text-label font-normal text-muted",
        className,
      )}
    >
      <span aria-hidden="true">‖ </span>
      {showPrefix ? (
        `${prefix} · `
      ) : (
        <span className="sr-only">{`${prefix}: `}</span>
      )}
      {label}
    </li>
  );
}
