import Image from "next/image";

import { cn } from "@/shared/lib/cn";

/** A square image under `public/`; null until the CV has a photo. */
export type AuthorPhoto = { src: string; alt: string } | null;

type AvatarProps = {
  photo: AuthorPhoto;
  /** 28px in the meta pill, 52px in the author box (kit `.mk-avatar`). */
  small?: boolean;
};

/**
 * The kit's avatar circle. The author's name stands next to it, so the image
 * is decorative; without a photo the circle stays an empty placeholder fill.
 */
export function Avatar({ photo, small }: AvatarProps) {
  const className = cn("mk-avatar", small && "mk-avatar-sm");
  if (!photo) return <span className={className} aria-hidden="true" />;
  const size = small ? 28 : 52;
  return (
    <Image
      className={cn(className, "object-cover")}
      src={photo.src}
      alt=""
      width={size}
      height={size}
    />
  );
}
