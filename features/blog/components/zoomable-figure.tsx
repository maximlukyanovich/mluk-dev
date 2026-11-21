"use client";

import { Maximize2, X } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";

type ZoomableFigureProps = {
  src: StaticImageData;
  alt: string;
  caption?: string;
  labels: { open: string; close: string };
};

/** The text column's width: the inline image never needs more. */
const inlineSizes = "(min-width: 790px) 740px, 100vw";

/**
 * The kit's Figure: a button around the image opens it full size in a modal
 * `<dialog>`, which follows the figure as in the kit — inside it,
 * `.mk-figure img` would frame the full-size picture too. Escape, a click on the backdrop or ✕ closes it and
 * focus returns to the button; the kit blocks the page's scroll while it is
 * open. Without scripts the button does nothing and the kit hides its icon.
 */
export function ZoomableFigure({
  src,
  alt,
  caption,
  labels,
}: ZoomableFigureProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);

  return (
    <>
      <figure className="mk-figure">
        <button
          ref={opener}
          type="button"
          className="mk-figure-zoom"
          aria-label={labels.open}
          onClick={() => dialog.current?.showModal()}
        >
          <Image src={src} alt={alt} sizes={inlineSizes} />
          <span className="mk-figure-zoom-icon">
            <Maximize2 aria-hidden="true" />
          </span>
        </button>
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
      <dialog
        ref={dialog}
        className="mk-lightbox"
        aria-label={alt}
        onClose={() => opener.current?.focus()}
        // The dialog fills the viewport; a click outside the picture lands
        // on the dialog itself, which stands for the backdrop.
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        {/* The original file, not the optimiser's srcset: that lists widths
            past the source (1920w for a 1280px picture), the optimiser does
            not upscale, and the browser then reads a smaller natural size,
            which the kit's `width: auto` shows. Lazy in a closed dialog, so
            it loads when opened. */}
        <Image src={src} alt={alt} unoptimized />
        {caption && <p className="mk-lightbox-caption">{caption}</p>}
        <button
          type="button"
          className="mk-icon-btn mk-lightbox-close"
          aria-label={labels.close}
          onClick={() => dialog.current?.close()}
        >
          <X strokeWidth={1.8} aria-hidden="true" />
        </button>
      </dialog>
    </>
  );
}
