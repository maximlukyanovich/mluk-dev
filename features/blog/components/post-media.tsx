import Image, { type StaticImageData } from "next/image";
import type { ComponentProps, ReactNode } from "react";

import type { Dictionary } from "@/shared/i18n/dictionaries";

import { videoUrls, type VideoService } from "../lib/embed";
import { EmbedPlayer } from "./embed-player";
import { ZoomableFigure } from "./zoomable-figure";

type Copy = Dictionary["media"];

export type FigureProps = {
  /** An image imported beside the post: `import shot from "./shot.png"`. */
  src: StaticImageData;
  alt: string;
  caption?: string;
};

export type VideoProps = {
  /** The id from the video's address, not the whole URL. */
  id: string;
  title: string;
  caption?: string;
  /** A picture of the author's own, imported beside the post. */
  poster?: StaticImageData;
};

/**
 * The components a post writes by name — `<Figure>`, `<Note>`, `<YouTube>`,
 * `<Vimeo>` — and the GFM table, each the kit's markup with the words of
 * the post's locale.
 */
export function mediaComponents(copy: Copy) {
  function Figure({ src, alt, caption }: FigureProps) {
    return (
      <ZoomableFigure
        src={src}
        alt={alt}
        caption={caption}
        labels={{
          open: copy.openFull.replace("{alt}", alt),
          close: copy.close,
        }}
      />
    );
  }

  function Note({ children }: { children: ReactNode }) {
    return (
      <div role="note" className="mk-callout">
        <span className="mk-dot" aria-hidden="true" />
        <div>{children}</div>
      </div>
    );
  }

  function video(service: VideoService, watch: string) {
    return function Video({ id, title, caption, poster }: VideoProps) {
      const { player, page } = videoUrls(service, id);
      return (
        <figure className="mk-embed">
          <div className="mk-embed-frame">
            {poster && <Image src={poster} alt="" fill sizes="740px" />}
            <EmbedPlayer
              src={player}
              title={title}
              label={copy.play.replace("{title}", title)}
            />
          </div>
          {/* The way to the video without scripts, and the service's name. */}
          <figcaption>
            {caption && `${caption} · `}
            <a href={page}>
              {watch} <span aria-hidden="true">↗</span>
            </a>
          </figcaption>
        </figure>
      );
    };
  }

  /** A wide table scrolls inside its own box, never the page. */
  function Table(props: ComponentProps<"table">) {
    return (
      <div
        className="mk-table"
        role="region"
        tabIndex={0}
        aria-label={copy.table}
      >
        <table {...props} />
      </div>
    );
  }

  return {
    Figure,
    Note,
    YouTube: video("youtube", copy.watchYouTube),
    Vimeo: video("vimeo", copy.watchVimeo),
    table: Table,
  };
}
