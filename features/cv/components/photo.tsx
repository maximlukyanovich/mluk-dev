import Image from "next/image";

import { cn } from "@/shared/lib/cn";

import type { Profile } from "../lib/types";

type PhotoProps = {
  photo: Profile["photo"];
  /** The alt text when the photo has none. */
  name: string;
  /** Shown in the circle while there is no photo. */
  placeholder: string;
  /** The intrinsic size in px; the rendered one is the `--photo` variable. */
  width: number;
  sizes: string;
  preload?: boolean;
  /** Sets `--photo` and the placeholder's text size. */
  className?: string;
};

/** The kit's Photo circle with the lime ring, or its placeholder. */
export function Photo({
  photo,
  name,
  placeholder,
  width,
  sizes,
  preload,
  className,
}: PhotoProps) {
  return (
    <div className={cn("mk-photo-ring", className)}>
      {photo ? (
        <Image
          className="mk-photo-img"
          src={photo.src}
          alt={photo.alt || name}
          width={width}
          height={width}
          sizes={sizes}
          preload={preload}
        />
      ) : (
        <div className="mk-photo-img">{placeholder}</div>
      )}
    </div>
  );
}
