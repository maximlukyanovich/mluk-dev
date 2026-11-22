"use client";

import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useId, useRef } from "react";

import { cn } from "@/shared/lib/cn";
import { useDrop } from "@/shared/ui/use-drop";

export type TagLink = {
  href: string;
  /** The tag; none for the row that lists every post. */
  tag?: string;
  label: string;
  count?: number;
  current: boolean;
};

type TagMenuProps = {
  label: string;
  /** "Tag": the button's label before the current value. */
  button: string;
  value: string;
  links: readonly TagLink[];
  className?: string;
};

/**
 * The kit's Filter on a phone: a button with the current tag and a list of
 * tag pages under it (`.mk-drop`), lying over the posts (owner,
 * 2026-11-21). Choosing a row closes the list, the current one too; Escape
 * closes it and returns focus to the button, a press outside closes it too.
 * Above 640px the kit hides it and the chips show.
 */
export function TagMenu({
  label,
  button,
  value,
  links,
  className,
}: TagMenuProps) {
  const nav = useRef<HTMLElement>(null);
  const { open, buttonRef, toggle, close } = useDrop({ container: nav });
  const listId = useId();

  return (
    <nav ref={nav} className={cn("mk-filter", className)} aria-label={label}>
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
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.current ? "page" : undefined}
                  onClick={close}
                >
                  <span>
                    {link.tag && <span className="mk-hash">#</span>}
                    {link.label}
                  </span>
                  {link.current ? (
                    <Check
                      className="mk-filter-check"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  ) : (
                    link.count !== undefined && (
                      <span className="mk-filter-count">{link.count}</span>
                    )
                  )}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </nav>
  );
}
