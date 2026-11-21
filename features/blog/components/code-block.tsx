import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import type { Locale } from "@/shared/i18n/locales";
import { plural } from "@/shared/i18n/plural";

import { CodeFrame } from "./code-frame";

type FigureProps = ComponentProps<"figure"> & {
  "data-rehype-pretty-code-figure"?: string;
  "data-line-count"?: string;
  "data-collapsed"?: string;
};

type Part = ReactElement<{
  children?: ReactNode;
  "data-language"?: string;
  "data-rehype-pretty-code-title"?: string;
}>;

/**
 * The MDX `figure`: a block rehype-pretty-code highlighted becomes the kit's
 * CodeBlock — its `figcaption` (meta `title="…"`) moves into the bar as the
 * file name, the `pre` stays as built. Any other figure renders as it is.
 */
export function codeFigure(locale: Locale, copy: Dictionary["code"]) {
  return function Figure(props: FigureProps) {
    if (props["data-rehype-pretty-code-figure"] === undefined) {
      return <figure {...props} />;
    }

    const parts = Children.toArray(props.children).filter(
      (child): child is Part => isValidElement(child),
    );
    const caption = parts.find(
      (part) => part.props["data-rehype-pretty-code-title"] !== undefined,
    );
    const pre = parts.find((part) => part.type === "pre");
    const language = pre?.props["data-language"];
    const lines = Number(props["data-line-count"] ?? 0);

    return (
      <CodeFrame
        title={caption ? String(caption.props.children) : undefined}
        language={language === "plaintext" ? undefined : language}
        collapsible={props["data-collapsed"] === "true"}
        labels={{
          copy: copy.copy,
          copied: copy.copied,
          showAll: plural(locale, lines, copy.showAll),
          collapse: copy.collapse,
        }}
      >
        {pre}
      </CodeFrame>
    );
  };
}
