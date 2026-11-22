import { ArrowDownToLine } from "lucide-react";
import Link from "next/link";

import type { Dictionary } from "@/shared/i18n/dictionaries";
import { localePath, type Locale } from "@/shared/i18n/locales";
import { buttonVariants } from "@/shared/ui/button";

import { cvPdfPath } from "../lib/pdf";
import type { CvContent } from "../lib/types";
import { Photo } from "./photo";

type CvIntroProps = {
  locale: Locale;
  cv: CvContent;
  dictionary: Dictionary;
};

/**
 * The CV page's header (canvas, CV-A and M-CV): the photo left of the name —
 * above it on a phone, where Unbounded leaves no room beside it — the status
 * and city, the headline, the PDF and Contact.
 */
export function CvIntro({ locale, cv, dictionary }: CvIntroProps) {
  const { profile } = cv;
  const name = `${profile.name.first} ${profile.name.last}`;
  const copy = dictionary.cv;

  return (
    <header className="flex flex-wrap items-center justify-between gap-6 pt-9 sm:pt-14">
      <div className="flex min-w-0 flex-[1_1_600px] flex-wrap items-center gap-x-8 gap-y-6">
        <Photo
          className="flex-none [--photo:96px] *:text-[9px] sm:[--photo:132px] sm:*:text-[10px]"
          photo={profile.photo}
          name={name}
          placeholder={dictionary.home.photoPlaceholder}
          width={132}
          sizes="(min-width: 640px) 132px, 96px"
          preload
        />
        <div className="min-w-0 flex-[1_1_320px]">
          <p className="mk-eyebrow">
            <span className="mk-dot" aria-hidden="true" />
            {profile.openToWork
              ? `${dictionary.home.openToWork} · ${profile.city}`
              : profile.city}
          </p>
          <h1 className="mt-3.5 max-w-[980px] font-display text-display-title text-balance">
            {name}
          </h1>
          <p className="mt-3 max-w-[720px] text-[18px]/[1.5] text-muted sm:text-lead">
            {cv.headline}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <a
          className={buttonVariants({ variant: "primary" })}
          href={cvPdfPath(locale)}
          download
        >
          {copy.downloadPdf}
          <ArrowDownToLine aria-hidden="true" size={16} strokeWidth={2} />
        </a>
        <Link
          className={buttonVariants({ variant: "secondary" })}
          href={localePath(locale, "/contact")}
        >
          {copy.contact}
        </Link>
      </div>
    </header>
  );
}
