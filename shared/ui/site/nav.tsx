"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/shared/i18n/locales";
import { localePath } from "@/shared/i18n/locales";

import { isInSection, sections } from "./sections";

type NavProps = {
  locale: Locale;
  label: string;
  /** Section names by key, from the dictionary. */
  names: Record<(typeof sections)[number]["key"], string>;
};

/** The main navigation; the current section is marked by the pathname. */
export function Nav({ locale, label, names }: NavProps) {
  const pathname = usePathname();

  return (
    <nav className="mk-nav" aria-label={label}>
      {sections.map(({ key, path }) => (
        <Link
          key={key}
          href={localePath(locale, path)}
          aria-current={isInSection(pathname, path) ? "page" : undefined}
        >
          {names[key]}
        </Link>
      ))}
    </nav>
  );
}
