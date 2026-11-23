import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, beforeEach, describe, it } from "node:test";

import {
  cvLocales,
  dataHash,
  pdfFile,
  pdfPageCount,
  pdfPageSizes,
  pdfTargets,
  renderMismatch,
  sha256,
  sourceFile,
  sourceHashes,
  staleness,
} from "./cv-pdf.mjs";

const root = path.resolve(import.meta.dirname, "../..");

/** A4 in points, and how far Chromium's rounding may stray from it. */
const a4 = [595.28, 841.89];
const isA4 = ([width, height]) =>
  Math.abs(width - a4[0]) < 1 && Math.abs(height - a4[1]) < 1;

describe("the committed CV PDFs", () => {
  it("match content/cv — run `pnpm cv:pdf` after editing it", () => {
    assert.deepEqual(staleness(root), []);
  });

  it("are one A4 page each", () => {
    for (const locale of cvLocales(root)) {
      const pdf = readFileSync(path.join(root, pdfFile(locale)));
      assert.equal(pdfPageCount(pdf), 1, pdfFile(locale));
      const sizes = pdfPageSizes(pdf);
      assert.equal(sizes.length, 1, pdfFile(locale));
      assert.ok(isA4(sizes[0]), `${pdfFile(locale)} is ${sizes[0]} pt`);
    }
  });
});

describe("pdfTargets", () => {
  it("prints each locale's sheet into its file", () => {
    assert.deepEqual(pdfTargets("http://localhost:3000", ["en", "ru"]), [
      {
        locale: "en",
        url: "http://localhost:3000/en/cv/print",
        file: "public/cv/mluk-cv-en.pdf",
      },
      {
        locale: "ru",
        url: "http://localhost:3000/ru/cv/print",
        file: "public/cv/mluk-cv-ru.pdf",
      },
    ]);
  });

  it("takes the origin of a base URL with a path or a trailing slash", () => {
    assert.equal(
      pdfTargets("https://preview.example.com/some/path/", ["ru"])[0].url,
      "https://preview.example.com/ru/cv/print",
    );
  });
});

describe("staleness", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "cv-pdf-"));
  after(() => rmSync(fixture, { recursive: true, force: true }));

  const write = (file, data) => {
    mkdirSync(path.dirname(path.join(fixture, file)), { recursive: true });
    writeFileSync(path.join(fixture, file), data);
  };

  beforeEach(() => {
    rmSync(fixture, { recursive: true, force: true });
    write("content/cv/en.json", '{"name":"A"}');
    write("content/cv/ru.json", '{"name":"А"}');
    write(pdfFile("en"), "%PDF");
    write(pdfFile("ru"), "%PDF");
    write(sourceFile, JSON.stringify(sourceHashes(fixture, ["en", "ru"])));
  });

  it("finds nothing when the PDFs were printed from the data", () => {
    assert.deepEqual(staleness(fixture), []);
  });

  it("names a locale whose JSON changed after printing", () => {
    write("content/cv/ru.json", '{"name":"Б"}');
    assert.deepEqual(staleness(fixture), [
      "content/cv/ru.json changed since public/cv/mluk-cv-ru.pdf was printed",
    ]);
  });

  it("names a missing PDF", () => {
    rmSync(path.join(fixture, pdfFile("en")));
    assert.deepEqual(staleness(fixture), [
      "public/cv/mluk-cv-en.pdf is missing",
    ]);
  });

  it("names a missing source.json", () => {
    rmSync(path.join(fixture, sourceFile));
    assert.deepEqual(staleness(fixture), [
      "public/cv/source.json is missing or not JSON",
    ]);
  });

  it("names a new locale printed never and a removed one still recorded", () => {
    write("content/cv/de.json", "{}");
    write(pdfFile("de"), "%PDF");
    rmSync(path.join(fixture, "content/cv/en.json"));
    assert.deepEqual(staleness(fixture), [
      "public/cv/source.json has no de: public/cv/mluk-cv-de.pdf was never printed",
      "public/cv/source.json lists en, which has no CV data",
    ]);
  });
});

describe("renderMismatch", () => {
  const fixture = mkdtempSync(path.join(tmpdir(), "cv-render-"));
  after(() => rmSync(fixture, { recursive: true, force: true }));
  mkdirSync(path.join(fixture, "content/cv"), { recursive: true });
  // Formatted as a person writes it; the sheet hashes the parsed data.
  writeFileSync(
    path.join(fixture, "content/cv/ru.json"),
    '{\n  "name": "Ада",\n  "years": [2023, null]\n}\n',
  );
  const rendered = sha256(JSON.stringify({ name: "Ада", years: [2023, null] }));

  it("passes a sheet rendered from the data in the tree", () => {
    assert.equal(dataHash(fixture, "ru"), rendered);
    assert.equal(renderMismatch(fixture, "ru", rendered), null);
  });

  it("refuses a sheet from other data, or one with no data-cv-source", () => {
    const stale = sha256(JSON.stringify({ name: "Ада", years: [2020, null] }));
    for (const source of [stale, null]) {
      assert.equal(
        renderMismatch(fixture, "ru", source),
        "the site renders other CV data than content/cv/ru.json — " +
          "rebuild it (pnpm build && pnpm start) and print again",
      );
    }
  });
});

describe("pdfPageCount", () => {
  it("counts page objects, not the page tree", () => {
    const pdf = Buffer.from(
      "<< /Type /Pages /Count 2 >> << /Type /Page >> <</Type/Page/Parent 1 0 R>>",
    );
    assert.equal(pdfPageCount(pdf), 2);
  });
});

describe("pdfPageSizes", () => {
  it("reads each page's MediaBox, so a Letter page is not taken for A4", () => {
    const pdf = Buffer.from(
      "<</Type/Page/MediaBox [0 0 594.95996 841.91998]>> <</Type/Page/MediaBox[0 0 612 792]>>",
    );
    const sizes = pdfPageSizes(pdf);
    assert.deepEqual(sizes, [
      [594.95996, 841.91998],
      [612, 792],
    ]);
    assert.deepEqual(sizes.map(isA4), [true, false]);
  });
});
