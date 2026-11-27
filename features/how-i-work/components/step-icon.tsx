import {
  CircleCheck,
  FileText,
  GitPullRequest,
  Globe,
  Grid2x2Plus,
  KeyRound,
  Layers2,
  LifeBuoy,
  Lightbulb,
  PanelsTopLeft,
  Terminal,
  Workflow,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";

import type { StepIcon as StepIconName } from "../lib/types";

/** Every name the loader lets through has its component here. */
const icons: Record<StepIconName, LucideIcon> = {
  lightbulb: Lightbulb,
  workflow: Workflow,
  "file-text": FileText,
  "layers-2": Layers2,
  "panels-top-left": PanelsTopLeft,
  "grid-2x2-plus": Grid2x2Plus,
  terminal: Terminal,
  "git-pull-request": GitPullRequest,
  "circle-check": CircleCheck,
  globe: Globe,
  "key-round": KeyRound,
  "life-buoy": LifeBuoy,
};

/** The kit's round Step icon; decorative — the step's title says it. */
export function StepIcon({
  icon,
  className,
}: {
  icon: StepIconName;
  className?: string;
}) {
  const Icon = icons[icon];
  return (
    <span className={cn("mk-step-icon", className)} aria-hidden="true">
      <Icon strokeWidth={1.8} />
    </span>
  );
}
