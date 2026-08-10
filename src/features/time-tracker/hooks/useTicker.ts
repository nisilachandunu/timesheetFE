"use client";

import { useSyncExternalStore } from "react";

/* The wall clock is an external store, so it is read through
   useSyncExternalStore rather than mirrored into state inside an effect. One
   interval is shared by every subscriber — a stopwatch and the row it will
   become must not drift a second apart — and it only runs while something is
   actually watching. */
const listeners = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | null = null;

/* Cached because getSnapshot has to return a stable value between renders;
   `Date.now()` per call would re-render forever. */
let now = 0;

function tick() {
  now = Date.now();
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (!interval) {
    // Refreshed on subscribe as well as on the interval: a timer started
    // between two ticks would otherwise read up to a second stale.
    now = Date.now();
    interval = setInterval(tick, 1000);
  }

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && interval) {
      clearInterval(interval);
      interval = null;
    }
  };
}

function getSnapshot(): number {
  if (now === 0) now = Date.now();
  return now;
}

/** The server has no clock for this visitor — nothing is ticking there. */
function getServerSnapshot(): number {
  return 0;
}

const subscribeToNothing = () => () => {};

/**
 * The current time in epoch milliseconds, re-rendering the caller once a
 * second while `active`.
 *
 * Idle callers pass `active: false` and get a frozen value rather than a
 * per-second render: with no timer running there is nothing on screen that
 * changes, and the tracker page can sit open all day.
 */
export function useTicker(active: boolean): number {
  return useSyncExternalStore(
    active ? subscribe : subscribeToNothing,
    getSnapshot,
    getServerSnapshot,
  );
}
