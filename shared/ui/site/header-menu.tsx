"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  createContext,
  use,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

import { cn } from "@/shared/lib/cn";
import type { Locale } from "@/shared/i18n/locales";
import { localePath } from "@/shared/i18n/locales";

import { isInSection, sections } from "./sections";

/** The kit's phone breakpoint: above it the header shows the nav inline. */
const PHONE = "(max-width: 640px)";

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

/**
 * The phone menu's state, shared by its button (in the header tools) and its
 * panel (the header's last row). The menu is open on the path it was opened
 * on, so any navigation closes it without an effect. Escape closes it and
 * returns focus to the button; widening the window past the phone breakpoint,
 * where the panel is hidden, closes it too.
 */
export function HeaderMenu({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const phone = window.matchMedia(PHONE);
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpenOn(null);
      buttonRef.current?.focus();
    };
    const onResize = () => {
      if (!phone.matches) setOpenOn(null);
    };
    document.addEventListener("keydown", onKey);
    phone.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKey);
      phone.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <MenuContext
      value={{
        open,
        panelId,
        buttonRef,
        toggle: () => setOpenOn(open ? null : pathname),
        close: () => setOpenOn(null),
      }}
    >
      {children}
    </MenuContext>
  );
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
