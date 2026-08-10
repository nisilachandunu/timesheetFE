"use client";

import { useSyncExternalStore } from "react";
import { startOfDay } from "@/lib/date";

/* The calendar day is an external store, so it is read through
   useSyncExternalStore rather than mirrored into state inside an effect. The
   snapshot is a cached number because getSnapshot must return a stable value
   between renders — and because an unchanged snapshot lets React skip the
   re-render entirely, which is what makes a once-a-minute check free. */
const listeners = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | null = null;
let cached = 0;

function compute(): number {
  return startOfDay(new Date()).getTime();
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);
  if (!interval) {
    interval = setInterval(() => {
      const next = compute();
      if (next === cached) return;
      cached = next;
      listeners.forEach((listener) => listener());
    }, 60_000);
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
  if (cached === 0) cached = compute();
  return cached;
}

/** The server has no clock for this visitor, so it renders the skeleton. */
function getServerSnapshot(): number {
  return 0;
}

/**
 * Local midnight of the current day, in epoch milliseconds, or `0` before
 * hydration.
 *
 * The tracker is a page people leave open from morning to evening, so "Today"
 * has to stop meaning yesterday at some point. Rolling the day over is checked
 * once a minute; the check is a no-op for all but one of those minutes, since
 * an unchanged snapshot re-renders nothing.
 *
 * Zero before hydration because these pages are statically prerendered:
 * resolving "today" during the server render would bake the build date into
 * the HTML. Callers show a skeleton until it is non-zero.
 */
export function useToday(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
