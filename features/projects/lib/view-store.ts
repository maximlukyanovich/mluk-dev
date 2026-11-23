"use client";

import { useSyncExternalStore } from "react";

/** How the projects are laid out: the kit's ViewToggle. */
export type View = "grid" | "rows";

const key = "mluk.projects.view";
const listeners = new Set<() => void>();
/** The view this tab shows; read from storage once, then kept here. */
let current: View | undefined;

function read(): View {
  try {
    return localStorage.getItem(key) === "rows" ? "rows" : "grid";
  } catch {
    // Storage blocked (a private window, site data off): the default.
    return "grid";
  }
}

function notify() {
  for (const listener of listeners) listener();
}

/** Another tab stored a view: this one follows. */
function onStorage(event: StorageEvent) {
  if (event.key !== key && event.key !== null) return;
  current = read();
  notify();
}

function subscribe(listener: () => void) {
  if (!listeners.size) window.addEventListener("storage", onStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (!listeners.size) window.removeEventListener("storage", onStorage);
  };
}

const getSnapshot = () => (current ??= read());
// The server renders the grid; hydration starts from it and React then
// renders the stored view, with no mismatch.
const getServerSnapshot = (): View => "grid";

/**
 * Switches the view. It is remembered when storage takes it; when storage
 * throws, the view still changes for this visit.
 */
export function setView(view: View) {
  current = view;
  try {
    localStorage.setItem(key, view);
  } catch {
    // Not remembered: the choice lasts until the page is reloaded.
  }
  notify();
}

/**
 * The visitor's view, stored in `localStorage` (decision 2026-11-21): the
 * grid on the server and until hydration, then the stored one.
 */
export function useView(): View {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
