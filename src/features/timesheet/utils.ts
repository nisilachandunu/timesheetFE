import { toISODate } from "@/lib/date";
import type { EntryMap, TaskRow } from "./types";

/* The calendar helpers this feature is built on now live in `@/lib/date`, so
   the time tracker can group its entries by the same day arithmetic. They are
   re-exported here because every consumer in this feature reaches for them via
   `../../utils`, and that is still the right place to ask from inside it. */
export * from "@/lib/date";

/** A full working day, used for the daily-target meter under each column. */
export const STANDARD_DAY_HOURS = 8;

/** A day cannot hold more hours than this — the hard ceiling on any entry. */
export const MAX_HOURS_PER_DAY = 24;

/* ==========================================================================
   Hours
   ========================================================================== */

/** Trims trailing zeros: 8 → "8", 7.5 → "7.5". Zero renders as "". */
export function formatHours(hours: number): string {
  if (!hours) return "";
  return `${Math.round(hours * 100) / 100}`;
}

/** Same as `formatHours` but always shows a value, for totals. */
export function formatTotal(hours: number): string {
  return `${Math.round(hours * 100) / 100}`;
}

/**
 * Parses what people actually type into a timesheet: "8", "7.5", "7,5",
 * "7:30" and ".5" all work. Returns null when the input is not a number, so
 * the caller can reject the keystroke instead of writing NaN into state.
 */
export function parseHours(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return 0;

  // "7:30" — hours and minutes.
  const colon = trimmed.match(/^(\d{1,2}):([0-5]?\d)$/);
  if (colon) {
    const hours = Number(colon[1]) + Number(colon[2]) / 60;
    return clampHours(hours);
  }

  if (!/^\d*[.,]?\d*$/.test(trimmed)) return null;
  const value = Number(trimmed.replace(",", "."));
  if (!Number.isFinite(value)) return null;

  return clampHours(value);
}

export function clampHours(hours: number): number {
  return Math.max(0, Math.min(MAX_HOURS_PER_DAY, Math.round(hours * 100) / 100));
}

/* ==========================================================================
   Totals
   ========================================================================== */

export function entryKey(taskId: string, date: Date): string {
  return `${taskId}|${toISODate(date)}`;
}

export function getEntry(entries: EntryMap, taskId: string, date: Date): number {
  return entries[entryKey(taskId, date)] ?? 0;
}

/** Total across the week for one task. */
export function rowTotal(entries: EntryMap, taskId: string, dates: Date[]): number {
  return round2(dates.reduce((sum, date) => sum + getEntry(entries, taskId, date), 0));
}

/** Total across all visible tasks for one day. */
export function dayTotal(entries: EntryMap, rows: TaskRow[], date: Date): number {
  return round2(rows.reduce((sum, row) => sum + getEntry(entries, row.id, date), 0));
}

export function weekTotal(entries: EntryMap, rows: TaskRow[], dates: Date[]): number {
  return round2(
    dates.reduce((sum, date) => sum + dayTotal(entries, rows, date), 0),
  );
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
