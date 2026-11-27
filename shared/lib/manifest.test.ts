import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { dictionaryFor } from "@/shared/i18n/dictionaries";
import { locales } from "@/shared/i18n/locales";

import { manifestFor, manifestIcons, manifestPath } from "./manifest";

/** Width × height from a PNG's IHDR chunk. */
function pngSize(file: Buffer): string {
  expect(file.subarray(1, 4).toString("ascii")).toBe("PNG");
  return `${file.readUInt32BE(16)}x${file.readUInt32BE(20)}`;
}

describe("manifestFor", () => {
  it.each(locales)("speaks %s and starts on that locale's home", (locale) => {
    const manifest = manifestFor(locale);
    expect(manifest.lang).toBe(locale);
    expect(manifest.start_url).toBe(`/${locale}`);
    expect(manifest.description).toBe(dictionaryFor(locale).meta.description);
    expect(manifestPath(locale)).toBe(`/${locale}/manifest.webmanifest`);
  });

  it("keeps one app id and scope for every locale", () => {
    for (const locale of locales) {
      expect(manifestFor(locale)).toMatchObject({ id: "/", scope: "/" });
    }
  });
});

describe("manifestIcons", () => {
  it.each(manifestIcons ?? [])(
    "$src is in public/ at its declared size",
    ({ src, sizes }) => {
      const file = readFileSync(new URL(`../../public${src}`, import.meta.url));
      expect(pngSize(file)).toBe(sizes);
    },
  );

  it("has a maskable icon", () => {
    expect(manifestIcons?.some((icon) => icon.purpose === "maskable")).toBe(
      true,
    );
  });
});
