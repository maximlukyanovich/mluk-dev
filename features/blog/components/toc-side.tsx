"use client";

import { useId } from "react";

import type { Heading } from "../lib/types";
import { TocList } from "./toc-list";
import { useActiveHeading } from "./use-active-heading";

type TocSideProps = {
  headings: readonly Heading[];
  title: string;
};

/** The kit's Toc as a side panel, from 1280px; its column keeps it sticky. */
export function TocSide({ headings, title }: TocSideProps) {
  const active = useActiveHeading(headings.map((heading) => heading.id));
  const titleId = useId();

  return (
    <nav className="mk-toc mk-glass" aria-labelledby={titleId}>
      <h2 className="mk-toc-title" id={titleId}>
        {title}
      </h2>
      <TocList headings={headings} active={active} />
    </nav>
  );
}
