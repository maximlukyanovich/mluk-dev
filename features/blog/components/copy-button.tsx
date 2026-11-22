"use client";

import { Check, Copy } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";

/** How long the check stays after a copy (CodeBlock README). */
const copiedFor = 2000;

type CopyButtonProps = {
  /** Reads the text at click time, from the rendered block. */
  getText: () => string;
  label: string;
  copiedLabel: string;
};

/**
 * The kit's copy icon: a check and "Copied" for 2 s after a copy, announced
 * once, by a polite live region — the button keeps its name. Another click
 * restarts the 2 s; a refused clipboard leaves it as it was. A page Next
 * hides after a navigation (`<Activity>`) drops the check with its timer.
 */
export function CopyButton({ getText, label, copiedLabel }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useLayoutEffect(
    () => () => {
      window.clearTimeout(timer.current);
      setCopied(false);
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), copiedFor);
  };

  return (
    <>
      <button
        type="button"
        className={copied ? "mk-code-copy is-copied" : "mk-code-copy"}
        aria-label={label}
        onClick={copy}
      >
        <Copy className="mk-i-copy" aria-hidden="true" />
        <Check className="mk-i-check" strokeWidth={2.2} aria-hidden="true" />
      </button>
      <span className="mk-sr" aria-live="polite">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}
