import { ExternalLinkIcon } from "lucide-react";
import type { ComponentProps } from "react";

/**
 * The sign of a link that opens a new tab: the icon for the eye and the
 * dictionary's `site.newTab` for a screen reader. `ExternalLink` puts it at
 * the end; a link whose sign sits elsewhere (a channel tile's action line)
 * places it itself.
 */
export function NewTabMark({ label }: { label: string }) {
  return (
    <>
      <ExternalLinkIcon
        className="mk-newtab"
        strokeWidth={1.8}
        aria-hidden="true"
      />
      <span className="mk-sr"> {label}</span>
    </>
  );
}

type ExternalLinkProps = Omit<ComponentProps<"a">, "target" | "rel"> & {
  href: string;
  /** `site.newTab`; without it the children hold a `NewTabMark`. */
  newTab?: string;
};

/**
 * A link to another site: it opens in a new tab, without access to this
 * one (`noopener`) and without sending the page's address (`noreferrer`).
 * A `mailto:` link is a plain `<a>`, not this.
 */
export function ExternalLink({ newTab, children, ...rest }: ExternalLinkProps) {
  return (
    <a {...rest} target="_blank" rel="noopener noreferrer">
      {children}
      {newTab !== undefined && <NewTabMark label={newTab} />}
    </a>
  );
}
