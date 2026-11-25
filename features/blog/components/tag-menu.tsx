"use client";

import { Check } from "lucide-react";
import Link from "next/link";

import { FilterMenu } from "@/shared/ui/filter-menu";

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

/** The blog's tag pages in the kit's Filter, for a phone. */
export function TagMenu({ links, ...menu }: TagMenuProps) {
  return (
    <FilterMenu {...menu}>
      {(choose) =>
        links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              aria-current={link.current ? "page" : undefined}
              onClick={choose}
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
        ))
      }
    </FilterMenu>
  );
}
