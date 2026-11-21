import type { Heading } from "../lib/types";

/** `01`, `02` … — the same numbers the kit's counter puts before each h2. */
export function sectionNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

type TocListProps = {
  headings: readonly Heading[];
  active: string | null;
  onPick?: (id: string) => void;
};

/** The items of both tables of contents: number and title, current marked. */
export function TocList({ headings, active, onPick }: TocListProps) {
  return (
    <ol>
      {headings.map(({ id, text }, index) => (
        <li key={id}>
          <a
            href={`#${id}`}
            aria-current={id === active ? "true" : undefined}
            onClick={onPick && (() => onPick(id))}
          >
            <span>{sectionNumber(index)}</span>
            {text}
          </a>
        </li>
      ))}
    </ol>
  );
}
