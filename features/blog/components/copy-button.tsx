"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
 * by a polite live region. Another click restarts the 2 s; a refused
 * clipboard leaves it as it was.
 */
export function CopyButton({ getText, label, copiedLabel }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

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
        aria-label={copied ? copiedLabel : label}
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
