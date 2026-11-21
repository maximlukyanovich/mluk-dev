import type { Dictionary } from "@/shared/i18n/dictionaries";
import { stripLocale } from "@/shared/i18n/locales";

/** The main navigation, in header order; paths are locale-less. */
export const sections = [
  { key: "writing", path: "/writing" },
  { key: "projects", path: "/projects" },
  { key: "cv", path: "/cv" },
  { key: "howIWork", path: "/how-i-work" },
  { key: "contact", path: "/contact" },
] as const satisfies readonly {
  key: keyof Dictionary["site"]["nav"];
  path: string;
}[];

/**
 * Whether a locale-prefixed pathname is inside a section: the section page
 * itself and everything under it (`/en/writing/page/2` is in Writing), but
 * not a lookalike (`/en/cvs`).
 */
export function isInSection(pathname: string, sectionPath: string): boolean {
  const path = stripLocale(pathname);
  return path === sectionPath || path.startsWith(`${sectionPath}/`);
}
