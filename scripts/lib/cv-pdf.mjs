// The pure half of `pnpm cv:pdf` (scripts/cv-pdf.mjs): which pages it prints
// into which files, and whether the committed PDFs still match the CV data.
// The browser stays in the script; this file only reads the disk.
//
// `public/cv/source.json` maps each locale to the sha256 of the
// `content/cv/<locale>.json` its PDF was printed from. The test beside this
// file compares it with the data in the tree, so a CV edit committed without
// `pnpm cv:pdf` turns `pnpm test` red. That holds only if the PDFs show the
// data in the tree, so the script also checks the sheet's `data-cv-source`
// against it (`renderMismatch`): an older build of the site is refused.
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export const contentDir = "content/cv";
export const outputDir = "public/cv";
export const sourceFile = `${outputDir}/source.json`;

/** The locales that have CV data — one `content/cv/<locale>.json` each. */
export function cvLocales(root) {
  return readdirSync(path.join(root, contentDir))
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.slice(0, -".json".length))
    .sort();
}

/** The repository-relative path of a locale's PDF. */
export function pdfFile(locale) {
  return `${outputDir}/mluk-cv-${locale}.pdf`;
}

/** What to print: each locale's print sheet on `baseUrl`, and its file. */
export function pdfTargets(baseUrl, locales) {
  return locales.map((locale) => ({
    locale,
    url: new URL(`/${locale}/cv/print`, baseUrl).href,
    file: pdfFile(locale),
  }));
}

export function sha256(data) {
  return createHash("sha256").update(data).digest("hex");
}

/** `source.json` for the data in the tree now: locale → sha256 of its JSON. */
export function sourceHashes(root, locales) {
  return Object.fromEntries(
    locales.map((locale) => [
      locale,
      sha256(readFileSync(path.join(root, contentDir, `${locale}.json`))),
    ]),
  );
}

/**
 * The fingerprint of a locale's CV data as the print sheet computes it
 * (features/cv/lib/source.ts): the sha256 of `JSON.stringify` of the parsed
 * JSON — the bundled module has no file bytes, so formatting does not count.
 */
export function dataHash(root, locale) {
  const file = path.join(root, contentDir, `${locale}.json`);
  return sha256(JSON.stringify(JSON.parse(readFileSync(file, "utf8"))));
}

/**
 * Why a printed sheet must not be saved: its `data-cv-source` (null when it
 * has none) is not the data in the tree — the site runs an older build.
 * Null when it matches.
 */
export function renderMismatch(root, locale, rendered) {
  if (rendered === dataHash(root, locale)) return null;
  return (
    `the site renders other CV data than ${contentDir}/${locale}.json — ` +
    `rebuild it (pnpm build && pnpm start) and print again`
  );
}

/**
 * Why the committed PDFs do not match the CV data — one line per problem, or
 * none. A missing PDF, a missing or unreadable `source.json`, and a locale
 * whose JSON hash differs from the recorded one are each a problem.
 */
export function staleness(root) {
  const locales = cvLocales(root);
  const problems = [];

  for (const locale of locales) {
    if (!existsSync(path.join(root, pdfFile(locale)))) {
      problems.push(`${pdfFile(locale)} is missing`);
    }
  }

  let recorded;
  try {
    recorded = JSON.parse(readFileSync(path.join(root, sourceFile), "utf8"));
  } catch {
    problems.push(`${sourceFile} is missing or not JSON`);
    return problems;
  }

  const current = sourceHashes(root, locales);
  for (const locale of locales) {
    if (!(locale in recorded)) {
      problems.push(
        `${sourceFile} has no ${locale}: ${pdfFile(locale)} was never printed`,
      );
    } else if (recorded[locale] !== current[locale]) {
      problems.push(
        `${contentDir}/${locale}.json changed since ${pdfFile(locale)} was printed`,
      );
    }
  }
  for (const locale of Object.keys(recorded)) {
    if (!locales.includes(locale)) {
      problems.push(`${sourceFile} lists ${locale}, which has no CV data`);
    }
  }
  return problems;
}

/**
 * The number of pages in a PDF Chromium printed: its page objects are plain
 * `/Type /Page` dictionaries (the page tree is `/Type /Pages`).
 */
export function pdfPageCount(pdf) {
  return (pdf.toString("latin1").match(/\/Type\s*\/Page(?![a-zA-Z])/g) ?? [])
    .length;
}

/**
 * Each page's size in points, `[width, height]`, from its `/MediaBox` —
 * Chromium writes one per page object. A4 is 595.28 × 841.89.
 */
export function pdfPageSizes(pdf) {
  return [
    ...pdf
      .toString("latin1")
      .matchAll(
        /\/MediaBox\s*\[\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)\s*\]/g,
      ),
  ].map(([, width, height]) => [Number(width), Number(height)]);
}
