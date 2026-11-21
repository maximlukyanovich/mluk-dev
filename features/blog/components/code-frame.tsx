"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";

import { CopyButton } from "./copy-button";

type CodeFrameProps = {
  title?: string;
  /** The language badge; none for plain text. */
  language?: string;
  /** Set at build time (rehype-code.mjs): the block starts collapsed. */
  collapsible: boolean;
  labels: {
    copy: string;
    copied: string;
    /** "Show all 26 lines", already counted. */
    showAll: string;
    collapse: string;
  };
  /** The highlighted `<pre>`, rendered on the server. */
  children: ReactNode;
};

/**
 * The text a copy takes: every line except the removed ones of a diff, each
 * without trailing spaces — a removed `// [!code ++]` leaves its space, and
 * an empty line holds one so the grid keeps its height.
 */
function codeText(figure: HTMLElement | null): string {
  const lines = figure?.querySelectorAll("pre [data-line]") ?? [];
  return Array.from(lines)
    .filter((line) => !line.classList.contains("remove"))
    .map((line) => (line.textContent ?? "").trimEnd())
    .join("\n");
}

/**
 * The kit's CodeBlock around a highlighted block: the bar (file name,
 * language, copy) and, for a long block, the button that opens and closes
 * it. The collapsed state comes from the build, so the server HTML is
 * already right; without scripts the kit opens the block and hides the
 * button.
 */
export function CodeFrame({
  title,
  language,
  collapsible,
  labels,
  children,
}: CodeFrameProps) {
  const [collapsed, setCollapsed] = useState(collapsible);
  const figure = useRef<HTMLElement>(null);
  const id = useId();

  const toggle = () => {
    flushSync(() => setCollapsed(!collapsed));
    if (collapsed) return;
    // Collapsing from far below leaves the block's top above the window:
    // bring it back, clear of the sticky table of contents (scroll-mt-22),
    // smoothly or at once as the page's scroll-behavior says (web.css).
    const block = figure.current;
    if (block && block.getBoundingClientRect().top < 0) {
      block.scrollIntoView({ block: "start" });
    }
  };

  return (
    <figure
      ref={figure}
      id={id}
      className="mk-code scroll-mt-22"
      data-rehype-pretty-code-figure=""
      data-collapsed={collapsible ? String(collapsed) : undefined}
    >
      <div className="mk-code-bar">
        {title && <span className="mk-code-title">{title}</span>}
        {language && <span className="mk-code-lang">{language}</span>}
        <CopyButton
          getText={() => codeText(figure.current)}
          label={labels.copy}
          copiedLabel={labels.copied}
        />
      </div>
      {children}
      {collapsible && (
        <div className="mk-code-more">
          <button
            type="button"
            className="mk-btn mk-btn-secondary mk-btn-sm"
            aria-expanded={!collapsed}
            aria-controls={id}
            onClick={toggle}
          >
            {collapsed ? labels.showAll : labels.collapse}
          </button>
        </div>
      )}
    </figure>
  );
}
