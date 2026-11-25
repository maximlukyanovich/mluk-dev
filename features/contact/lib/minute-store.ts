"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;

function notify() {
  for (const listener of listeners) listener();
}

/** Wakes at the next minute boundary, tells the listeners, and repeats. */
function schedule() {
  timer = setTimeout(
    () => {
      notify();
      schedule();
    },
    60_000 - (Date.now() % 60_000),
  );
}

/** A background tab's timer is throttled: catch up when it shows again. */
function onVisibility() {
  if (document.visibilityState === "visible") notify();
}

// Subscribed while a clock is mounted; a page hidden in <Activity> loses its
// effects, so the timer stops there and the clock reads the time anew on
// return.
function subscribe(listener: () => void) {
  if (!listeners.size) {
    schedule();
    document.addEventListener("visibilitychange", onVisibility);
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    if (listeners.size) return;
    clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

const getSnapshot = () => Math.floor(Date.now() / 60_000);
// The server has no visitor's clock: the page is prerendered without a time.
const getServerSnapshot = () => null;

/**
 * The current minute since the epoch, `null` on the server and until
 * hydration; it changes at each minute boundary.
 */
export function useMinute(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
