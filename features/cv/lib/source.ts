import { createHash } from "node:crypto";

import type { CvContent } from "./types";

/**
 * The fingerprint of the CV data a page rendered: the sha256 of its JSON.
 * The print sheet carries it as `data-cv-source`, and `pnpm cv:pdf`
 * (scripts/lib/cv-pdf.mjs, `dataHash`) refuses a site whose sheet was built
 * from other data than `content/cv/<locale>.json` in the tree — a
 * `next start` of an older build. Both sides hash `JSON.stringify` of the
 * parsed data, so the file's formatting does not count.
 */
export function cvSource(cv: CvContent): string {
  return createHash("sha256").update(JSON.stringify(cv)).digest("hex");
}
