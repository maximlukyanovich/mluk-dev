"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

type ThemeToggleProps = {
  /** The action in each theme: "Switch to light theme" while dark, and back. */
  toLight: string;
  toDark: string;
};

/**
 * One button that flips the theme. Both icons and both labels are in the
 * markup and kit.css shows the pair matching `data-theme`, so the server
 * render is right before hydration and needs no "mounted" check. The visible
 * label is the button's accessible name; the hidden one is `display: none`
 * and out of the name.
 */
export function ThemeToggle({ toLight, toDark }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      className="mk-icon-btn mk-theme-toggle"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <Moon className="mk-i-moon" strokeWidth={1.8} aria-hidden="true" />
      <Sun className="mk-i-sun" strokeWidth={1.8} aria-hidden="true" />
      <span className="mk-tooltip">
        <span className="mk-tip-light">{toLight}</span>
        <span className="mk-tip-dark">{toDark}</span>
      </span>
    </button>
  );
}
