"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/shared/lib/cn";

/**
 * `next/image` that fades in once it has loaded (`.mk-fade-in` in web.css,
 * owner 2026-11-21). A picture that finished loading before hydration is
 * marked at once from its `complete` flag, so it never stays hidden. Not for
 * the first screen's image: hiding it until scripts run would delay the
 * page's largest paint.
 */
export function FadeImage({ alt, className, onLoad, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      ref={(image) => {
        if (image?.complete && image.naturalWidth > 0) setLoaded(true);
      }}
      className={cn("mk-fade-in", className)}
      data-loaded={loaded ? "" : undefined}
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
    />
  );
}
