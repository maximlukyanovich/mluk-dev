import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The kit's OgCover drawn for `next/og` at 1200×630. Satori takes no CSS
 * variables or classes, so the dark theme's values from tokens.json are
 * repeated here and the kit's percentages are worked out for 1200 px.
 */
const dark = {
  bg: "#080a10",
  grid: "rgba(150,170,255,0.06)",
  line: "#232838",
  fg: "#eceefe",
  muted: "#9a9fbd",
  lime: "#b8f25a",
  peri: "#8ea2ff",
};

export const ogSize = { width: 1200, height: 630 };

type OgFont = {
  name: string;
  data: Buffer;
  weight: 500 | 600;
  style: "normal";
};

let fonts: OgFont[] | undefined;

/**
 * Static TTFs with Cyrillic (Satori reads ttf/otf/woff only); OFL in
 * assets/fonts. Read synchronously and once: with Cache Components an
 * awaited file read inside a route handler makes it render on every request,
 * while synchronous I/O is prerendered (docs: caching, "Predictable values").
 */
export function ogFonts(): OgFont[] {
  const font = (file: string) =>
    readFileSync(join(process.cwd(), "assets/fonts", file));
  fonts ??= [
    {
      name: "Unbounded",
      data: font("Unbounded-SemiBold.ttf"),
      weight: 600,
      style: "normal",
    },
    {
      name: "Geist Mono",
      data: font("GeistMono-Medium.ttf"),
      weight: 500,
      style: "normal",
    },
  ];
  return fonts;
}

type OgCoverProps = {
  title: string;
  /** The meta line under the title, e.g. `2026-11-18 · 8 min · EN`. */
  meta: string;
  /** A post's first tag, shown at the top right. */
  tag?: string;
};

export function OgCover({ title, meta, tag }: OgCoverProps) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "84px 90px",
        backgroundColor: dark.bg,
        backgroundImage: `linear-gradient(${dark.grid} 1px, transparent 1px), linear-gradient(90deg, ${dark.grid} 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        border: `2px solid ${dark.line}`,
        fontFamily: "Geist Mono",
        fontSize: 26,
        color: dark.fg,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ display: "flex" }}>
          mluk<span style={{ color: dark.lime }}>.</span>dev
        </span>
        {tag && <span style={{ color: dark.peri }}>{tag}</span>}
      </div>
      <div
        style={{
          maxWidth: "80%",
          fontFamily: "Unbounded",
          fontWeight: 600,
          fontSize: 60,
          lineHeight: 1.1,
          letterSpacing: "-0.025em",
        }}
      >
        {title}
      </div>
      <div style={{ color: dark.muted }}>{meta}</div>
      <div
        style={{
          position: "absolute",
          right: 90,
          bottom: 84,
          width: 108,
          height: 108,
          borderRadius: "50%",
          backgroundColor: dark.lime,
        }}
      />
    </div>
  );
}
