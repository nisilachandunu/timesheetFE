"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { addDays, startOfDay, startOfWeek, toISODate, weekDates } from "../utils";

/* The clock is an external store, so it is read through useSyncExternalStore
   rather than mirrored into state inside an effect. The snapshot is cached per
   calendar day because getSnapshot must return a stable reference between
   renders — a fresh Date each call would loop forever. */
let cachedToday: Date | null = null;
let cachedKey = "";

function getTodaySnapshot(): Date {
  const now = new Date();
  const key = toISODate(now);
  if (key !== cachedKey || !cachedToday) {
    cachedKey = key;
    cachedToday = startOfDay(now);
  }
  return cachedToday;
}

/** The server has no clock for this visitor, so it renders the skeleton. */
function getServerToday(): Date | null {
  return null;
}

const subscribeToNothing = () => () => {};

/**
 * Week navigation anchored to the real current date.
 *
 * `today` is null until hydration completes: these pages are statically
 * prerendered, so resolving "today" during the server render would bake the
 * build date into the HTML. Callers show a skeleton until `isReady`.
 *
 * The displayed week is stored as an offset from the current week rather than
 * as an absolute date, so it stays correct if the page is left open past
 * midnight.
 */
export function useWeek() {
  const today = useSyncExternalStore(
    subscribeToNothing,
    getTodaySnapshot,
    getServerToday,
  );

  const [weekOffset, setWeekOffset] = useState(0);

  const weekStart = useMemo(
    () => (today ? addDays(startOfWeek(today), weekOffset * 7) : null),
    [today, weekOffset],
  );

  const dates = useMemo(() => (weekStart ? weekDates(weekStart) : []), [weekStart]);

  const goToPrevious = useCallback(() => setWeekOffset((offset) => offset - 1), []);
  const goToNext = useCallback(() => setWeekOffset((offset) => offset + 1), []);
  const goToToday = useCallback(() => setWeekOffset(0), []);

  return {
    weekStart,
    today,
    dates,
    isReady: weekStart !== null,
    isCurrentWeek: weekOffset === 0,
    goToPrevious,
    goToNext,
    goToToday,
  };
}
