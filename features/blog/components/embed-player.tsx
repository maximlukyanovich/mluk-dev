"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type EmbedPlayerProps = {
  /** The player's address, with autoplay: the click already asked to play. */
  src: string;
  title: string;
  label: string;
};

/**
 * The kit's Embed facade: a button over the frame and nothing from the video
 * service until it is pressed; then the player replaces the button and takes
 * its focus. A page Next hides after a navigation (`<Activity>`) keeps its
 * DOM, and a hidden iframe plays on: hiding it puts the facade back. That
 * state update waits for an idle render of the hidden tree, so the player
 * is stopped through the DOM first.
 */
export function EmbedPlayer({ src, title, label }: EmbedPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (playing) frame.current?.focus();
  }, [playing]);

  useLayoutEffect(() => {
    if (!playing) return;
    const player = frame.current;
    return () => {
      player?.setAttribute("src", "about:blank");
      setPlaying(false);
    };
  }, [playing]);

  if (playing) {
    return (
      <iframe
        ref={frame}
        src={src}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="mk-embed-play"
      aria-label={label}
      onClick={() => setPlaying(true)}
    >
      <span className="mk-embed-icon">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M7 4.5v15l12.5-7.5z" />
        </svg>
      </span>
      {title}
    </button>
  );
}
