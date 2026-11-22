// The pure half of `pnpm cv:pdf` (scripts/cv-pdf.mjs): which pages it prints
// into which files, and whether the committed PDFs still match the CV data.
// The browser stays in the script; this file only reads the disk.
//
// `public/cv/source.json` maps each locale to the sha256 of the
// `content/cv/<locale>.json` its PDF was printed from. The test beside this
// file compares it with the data in the tree, so a CV edit committed without
// `pnpm cv:pdf` turns `pnpm test` red.
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
    if (recorded[locale] !== current[locale]) {
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
