import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { buttonVariants } from "@/shared/ui/button";

import type { Profile } from "../lib/types";

type IntroProps = {
  locale: Locale;
  profile: Profile;
  copy: Dictionary["home"];
};

/** The home page's first screen, left side: eyebrow, name, lead, actions. */
export function Intro({ locale, profile, copy }: IntroProps) {
  return (
    <div>
      <p className="mk-eyebrow">
        <span className="mk-dot" aria-hidden="true" />
        {profile.role} · {profile.city}
      </p>
      <h1 className="mt-4.5 font-display text-display-hero">
        {profile.name.first}
        <br />
        {profile.name.last}
      </h1>
      <p className="mt-5.5 max-w-[540px] text-lead text-muted">
        {profile.lead}
      </p>
      <div className="mt-7 flex flex-wrap gap-2.5">
        <Link
          className={buttonVariants({ variant: "primary" })}
          href={localePath(locale, "/writing")}
        >
          {copy.readBlog} <span aria-hidden="true">↗</span>
        </Link>
        {/* The PDF arrives with the CV (PR 3): pnpm cv:pdf writes it. */}
        <a
          className={buttonVariants({ variant: "secondary" })}
          href={`/cv/mluk-cv-${locale}.pdf`}
        >
          {copy.cvPdf}
        </a>
      </div>
    </div>
  );
}
