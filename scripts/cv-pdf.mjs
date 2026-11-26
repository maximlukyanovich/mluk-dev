// Print the CV's A4 sheet (`/<locale>/cv/print`) of every locale into
// `public/cv/mluk-cv-<locale>.pdf` and record what it was printed from in
// `public/cv/source.json` — the test in lib/cv-pdf.test.mjs fails when
// `content/cv` changes without a new print. The PDFs are committed.
//
//   pnpm build && pnpm start      in one terminal (the dev server works too)
//   pnpm cv:pdf [baseUrl]         in another; baseUrl defaults to localhost on
//                                 the port those take (PORT, else .env.local)
//
// Nothing is written unless every locale printed: a sheet that does not fit
// one page, a page that does not answer 200, a site that is not running or
// one that renders other data than content/cv (a `next start` of an older
// build) exits 1 and leaves the committed files as they were. Chromium comes
// from Playwright: `pnpm exec playwright install chromium` once per machine.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

import { chromium } from "playwright";

import {
  cvLocales,
  outputDir,
  pdfPageCount,
  pdfTargets,
  renderMismatch,
  sourceFile,
  sourceHashes,
} from "./lib/cv-pdf.mjs";
import { localSite } from "./lib/port.mjs";

const root = path.resolve(import.meta.dirname, "..");
const baseUrl = process.argv[2] ?? defaultBaseUrl();

/** The site `pnpm dev` or `pnpm start` serves, by the port rule of scripts/next.mjs. */
function defaultBaseUrl() {
  let envLocal = "";
  try {
    envLocal = readFileSync(path.join(root, ".env.local"), "utf8");
  } catch {
    // no .env.local — the default port
  }
  const { url, warning } = localSite(process.env.PORT || undefined, envLocal);
  if (warning) console.warn(`cv:pdf: ${warning}`);
  return url;
}

function fail(message) {
  console.error(`cv:pdf: ${message}`);
  process.exit(1);
}

try {
  await fetch(baseUrl, { redirect: "manual" });
} catch {
  fail(
    `nothing answers at ${baseUrl}. Start the site first: pnpm build && pnpm start`,
  );
}

const locales = cvLocales(root);
const printed = [];
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const { locale, url, file } of pdfTargets(baseUrl, locales)) {
    const response = await page.goto(url, { waitUntil: "networkidle" });
    if (response?.status() !== 200) {
      fail(`${url} answered ${response?.status() ?? "nothing"}, not 200`);
    }
    // The dev server's indicator would print in the corner of the sheet.
    await page.addStyleTag({
      content: "nextjs-portal { display: none !important; }",
    });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(() => document.fonts.ready);

    const sheet = await page.evaluate(() => {
      const element = document.querySelector("[data-cv-sheet]");
      return (
        element && {
          content: element.scrollHeight,
          height: element.clientHeight,
          source: element.getAttribute("data-cv-source"),
        }
      );
    });
    if (!sheet) fail(`${url} has no [data-cv-sheet]`);
    const mismatch = renderMismatch(root, locale, sheet.source);
    if (mismatch) fail(`${url}: ${mismatch}`);
    if (sheet.content > sheet.height) {
      fail(
        `the CV in ${locale} does not fit one A4 page ` +
          `(${sheet.content}px of content in ${sheet.height}px); shorten content/cv/${locale}.json`,
      );
    }

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
    });
    const pages = pdfPageCount(pdf);
    if (pages !== 1) fail(`the CV in ${locale} printed on ${pages} pages`);
    printed.push({ file, pdf });
  }
} finally {
  await browser.close();
}

mkdirSync(path.join(root, outputDir), { recursive: true });
for (const { file, pdf } of printed) {
  writeFileSync(path.join(root, file), pdf);
  console.log(`cv:pdf: ${file} (${Math.round(pdf.length / 1024)} KB)`);
}
writeFileSync(
  path.join(root, sourceFile),
  `${JSON.stringify(sourceHashes(root, locales), null, 2)}\n`,
);
console.log(`cv:pdf: ${sourceFile}`);
