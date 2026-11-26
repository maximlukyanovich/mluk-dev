"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  use,
  useId,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "@/shared/lib/cn";
import type { Locale } from "@/shared/i18n/locales";
import { localePath } from "@/shared/i18n/locales";
import { useDrop } from "@/shared/ui/use-drop";

import { isInSection, sections } from "./sections";

type MenuState = {
  open: boolean;
  panelId: string;
  buttonRef: RefObject<HTMLButtonElement | null>;
  toggle: () => void;
  close: () => void;
};

const MenuContext = createContext<MenuState | null>(null);

function useMenu(): MenuState {
  const menu = use(MenuContext);
  if (!menu) throw new Error("Header menu parts sit inside HeaderMenu");
  return menu;
}

/** Whether the menu is open: the header dock stays shown while it is. */
export function useMenuOpen(): boolean {
  return useMenu().open;
}

/**
 * The phone menu's state (`useDrop`), shared by its button (in the header
 * tools) and its panel (the header's last row).
 */
export function HeaderMenu({ children }: { children: ReactNode }) {
  const drop = useDrop();
  const panelId = useId();

  return <MenuContext value={{ ...drop, panelId }}>{children}</MenuContext>;
}

type MenuButtonProps = {
  /** The action in each state: "Open menu" while closed, and back. */
  openLabel: string;
  closeLabel: string;
};

/** The kit's menu button: ☰ and ✕ crossfade on `aria-expanded`. */
export function MenuButton({ openLabel, closeLabel }: MenuButtonProps) {
  const { open, panelId, buttonRef, toggle } = useMenu();

  return (
    <button
      ref={buttonRef}
      type="button"
      className="mk-icon-btn mk-menu-btn"
      aria-expanded={open}
      aria-controls={panelId}
      aria-label={open ? closeLabel : openLabel}
      onClick={toggle}
    >
      <span className="mk-menu-icon">
        <Menu className="mk-i-menu" strokeWidth={1.8} aria-hidden="true" />
        <X className="mk-i-close" strokeWidth={1.8} aria-hidden="true" />
      </span>
    </button>
  );
}

type MenuPanelProps = {
  locale: Locale;
  label: string;
  /** Section names by key, from the dictionary. */
  names: Record<(typeof sections)[number]["key"], string>;
};

/**
 * The sections in the kit's `.mk-drop`: it opens in place, height and fade.
 * Closed, the panel is `visibility: hidden`, so its links are out of the tab
 * order and the accessibility tree.
 */
export function MenuPanel({ locale, label, names }: MenuPanelProps) {
  const { open, panelId, close } = useMenu();
  const pathname = usePathname();

  return (
    <div className={cn("mk-drop", open && "is-open")}>
      <div>
        <nav id={panelId} className="mk-menu" aria-label={label}>
          <ol>
            {sections.map(({ key, path }, index) => (
              <li key={key}>
                <Link
                  href={localePath(locale, path)}
                  aria-current={
                    isInSection(pathname, path) ? "page" : undefined
                  }
                  onClick={close}
                >
                  <span className="mk-menu-no">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {names[key]}
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
}
