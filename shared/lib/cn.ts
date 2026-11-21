import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The kit's type styles, radii and blur from shared/ui/styles/theme.css.
// Without them tailwind-merge reads `text-ui` as a colour and drops it next to
// `text-muted`; a new name there is added here in the same commit.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "display-hero",
        "display-title",
        "display-section",
        "display-h2",
        "display-card",
        "lead",
        "body-article",
        "body",
        "post-title",
        "excerpt",
        "ui",
        "button",
        "wordmark",
        "meta",
        "label",
      ],
      radius: ["pill", "panel", "card", "media", "inner"],
      blur: ["glass"],
      font: ["display"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
