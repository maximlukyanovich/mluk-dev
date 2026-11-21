"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * next-themes renders an inline <script> that sets `data-theme` before the
 * first paint. React 19 reports any executable <script> a component renders
 * on the client; the server keeps it executable, the client marks it as data
 * (it has already run by then, and next-themes suppresses the attribute
 * mismatch on that tag).
 */
export function ThemeProvider(
  props: ComponentProps<typeof NextThemesProvider>,
) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={{
        type: typeof window === "undefined" ? undefined : "application/json",
      }}
    />
  );
}
