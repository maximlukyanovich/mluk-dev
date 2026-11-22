import type { Viewport } from "next";

/**
 * The page background (`--bg` in styles/tokens.css) in each theme: the
 * browser's toolbar takes it from `<meta name="theme-color">`.
 */
export const pageBackground = { light: "#f1f3f7", dark: "#080a10" } as const;

/**
 * The toolbar follows the OS theme; a theme picked with the toggle does not
 * change it (owner, 2026-11-22).
 */
export const themeColor: Viewport["themeColor"] = [
  { media: "(prefers-color-scheme: light)", color: pageBackground.light },
  { media: "(prefers-color-scheme: dark)", color: pageBackground.dark },
];
