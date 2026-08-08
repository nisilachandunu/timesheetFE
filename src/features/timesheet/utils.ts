import type { EntryMap, TaskRow } from "./types";

/** A full working day, used for the daily-target meter under each column. */
export const STANDARD_DAY_HOURS = 8;

/** A day cannot hold more hours than this — the hard ceiling on any entry. */
export const MAX_HOURS_PER_DAY = 24;

export const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Indexed by `weekdayIndex()`, i.e. Monday-first. */
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ==========================================================================
   Dates
   All helpers build dates from local Y/M/D parts so a timezone offset can
   never shift an entry onto the neighbouring day.
   ========================================================================== */

/** 0 = Monday … 6 = Sunday. */
export function weekdayIndex(date: Date): number {
  return (date.getDay() + 6) % 7;
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

/** Monday of the week containing `date`. */
export function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() - weekdayIndex(d));
  return d;
}

export function addDays(date: Date, days: number): Date {
  const d = startOfDay(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** The seven dates of the week beginning at `weekStart`. */
export function weekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function toISODate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Inverse of toISODate — built from Y/M/D parts so it can't shift a day
    under a timezone offset the way `new Date(isoString)` can. */
export function parseISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISODate(a) === toISODate(b);
}

export function isWeekend(date: Date): boolean {
  return weekdayIndex(date) >= 5;
}

/* --- Formatting --- */

/** "Mon" — the weekday abbreviation. */
export function formatWeekday(date: Date): string {
  return WEEKDAYS[weekdayIndex(date)];
}

/** "3/8" — compact day/month for the column subheading. */
export function formatDayMonth(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

/** "3 Aug 2026" — used in cell tooltips and screen-reader labels. */
export function formatFullDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * "3 – 9 Aug 2026", collapsing the repeated month and year where possible:
 * "29 Jun – 5 Jul 2026", "28 Dec 2026 – 3 Jan 2027".
 */
export function formatWeekRange(weekStart: Date): string {
  const end = addDays(weekStart, 6);
  const sameYear = weekStart.getFullYear() === end.getFullYear();
  const sameMonth = sameYear && weekStart.getMonth() === end.getMonth();

  const left = sameMonth
    ? `${weekStart.getDate()}`
    : sameYear
      ? `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]}`
      : `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`;

  return `${left} – ${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()}`;
}

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
