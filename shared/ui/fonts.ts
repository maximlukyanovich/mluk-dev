import { Geist_Mono, Manrope, Unbounded } from "next/font/google";

// The kit's three families (tokens.json → type.families), variable fonts with
// Cyrillic. theme.css builds --font-display / --font-sans / --font-mono from
// these variables, followed by the kit's fallbacks.
const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  variable: "--font-unbounded",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
});

const geistMono = Geist_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-geist-mono",
});

/** Class names that define the font variables; set them on <html>. */
export const fontVariables = [
  unbounded.variable,
  manrope.variable,
  geistMono.variable,
].join(" ");
