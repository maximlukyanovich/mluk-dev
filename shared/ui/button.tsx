import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "@/shared/lib/cn";

// The kit's Button (project/components/Button): pill, 48px, or 40px at `sm`.
// A link that looks like a button takes the same classes —
// <Link className={buttonVariants({ variant: "secondary" })}> — since the kit
// renders an <a> when it navigates and a <button> when it acts.
export const buttonVariants = cva("mk-btn", {
  variants: {
    // No default: primary is used once per view, so every call site says which.
    variant: {
      primary: "mk-btn-primary",
      secondary: "mk-btn-secondary",
      ghost: "mk-btn-ghost",
    },
    size: {
      default: "",
      sm: "mk-btn-sm",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

export type ButtonProps = ComponentProps<"button"> &
  ButtonVariants & {
    variant: NonNullable<ButtonVariants["variant"]>;
  };

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
