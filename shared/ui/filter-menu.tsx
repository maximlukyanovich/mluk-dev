"use client";

import { ChevronDown } from "lucide-react";
import { useId, useRef, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { useDrop } from "@/shared/ui/use-drop";

type FilterMenuProps = {
  /** The name of the list: the nav's label, or the group's. */
  label: string;
  /** "Tag", "Type": the button's label before the current value. */
  button: string;
  value: string;
  /** `nav` when the rows are links to pages, a group when they are buttons. */
  as?: "nav" | "group";
  className?: string;
  /**
   * The list's rows, each an `<li>` with a link (`aria-current`) or a button
   * (`aria-pressed`) that calls `choose`: it closes the list and returns
   * focus to the button.
   */
  children: (choose: () => void) => ReactNode;
};

/**
 * The kit's Filter on a phone: a button with the current value and a list
 * under it (`.mk-drop`), lying over the content (owner, 2026-11-21).
 * Choosing a row closes the list, the current one too; Escape closes it and
 * returns focus to the button, a press outside closes it too. Above 640px
 * the kit hides it and the chips show.
 */
export function FilterMenu({
  label,
  button,
  value,
  as = "nav",
  className,
  children,
}: FilterMenuProps) {
  const box = useRef<HTMLElement & HTMLDivElement>(null);
  const { open, buttonRef, toggle, closeToButton } = useDrop({
    container: box,
  });
  const listId = useId();
  const Box = as === "nav" ? "nav" : "div";

  return (
    <Box
      ref={box}
      className={cn("mk-filter", className)}
      role={as === "group" ? "group" : undefined}
      aria-label={label}
    >
      <button
        ref={buttonRef}
        type="button"
        className="mk-filter-btn"
        aria-expanded={open}
        aria-controls={listId}
        onClick={toggle}
      >
        {button} <span className="mk-filter-value">{value}</span>
        <ChevronDown strokeWidth={1.8} aria-hidden="true" />
      </button>
      <div className={cn("mk-drop", open && "is-open")}>
        <div>
          <ol id={listId} className="mk-filter-list mk-glass">
            {children(closeToButton)}
          </ol>
        </div>
      </div>
    </Box>
  );
}
