"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

import { cn } from "@/shared/lib/cn";

/**
 * `next/image` that fades in once it has loaded (`.mk-fade-in` in web.css,
 * owner 2026-11-21). Only the script that reveals a picture hides it: the
 * server's HTML shows every picture, and on hydration one still loading is
 * marked pending until it loads — or fails, when the browser's broken-image
 * box and its alt show. A page whose scripts never run keeps its pictures.
 * Not for the first screen's image: hiding it until it loads would delay the
 * page's largest paint. `onError` goes to next/image only while a picture
 * is pending or when the caller gave one: given at mount, next/image sets
 * `src` again to replay an error it missed, and every picture is fetched
 * twice.
 */
export function FadeImage({
  alt,
  className,
  onLoad,
  onError,
  ...props
}: ImageProps) {
  const [pending, setPending] = useState(false);

  return (
    <Image
      {...props}
      alt={alt}
      ref={(image) => {
        if (image && !image.complete) setPending(true);
      }}
      className={cn("mk-fade-in", className)}
      data-pending={pending ? "" : undefined}
      onLoad={(event) => {
        setPending(false);
        onLoad?.(event);
      }}
      onError={
        pending || onError
          ? (event) => {
              setPending(false);
              onError?.(event);
            }
          : undefined
      }
    />
  );
}
