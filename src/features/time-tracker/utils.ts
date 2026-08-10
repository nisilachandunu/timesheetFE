import { MONTHS, WEEKDAYS, isSameDay, startOfDay, toISODate, weekdayIndex } from "@/lib/date";
import type { DayGroup, TimeEntry } from "./types";

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;

/** A full working week — what the list's week total is measured against. */
export const WEEK_TARGET_HOURS = 40;

/* ==========================================================================
   Durations
   ========================================================================== */

/**
 * "00:00:00" — the stopwatch readout. Hours are not capped at 24: a timer left
 * running over a weekend should say so rather than silently wrap.
 */
export function formatStopwatch(ms: number): string {
  const total = Math.max(0, Math.floor(ms / SECOND));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return [hours, minutes, seconds]
    .map((part) => `${part}`.padStart(2, "0"))
    .join(":");
}

/**
 * "2:00", "0:30", "34:30" — hours and minutes, hours unpadded. Used for
 * entry, day and week totals, where seconds are noise.
 */
export function formatDuration(ms: number): string {
  const minutes = Math.max(0, Math.round(ms / MINUTE));
  return `${Math.floor(minutes / 60)}:${`${minutes % 60}`.padStart(2, "0")}`;
}

// IDLE DETECTION (disabled) — its only callers were the idle dialog and control.
// /**
//  * "12 min", "1 h 05 min", "2 h" — for prose, where "0:12" reads as a clock time
//  * rather than as a length of time.
//  */
// export function formatHumanDuration(ms: number): string {
//   const minutes = Math.max(0, Math.round(ms / MINUTE));
//   const hours = Math.floor(minutes / 60);
//   const rest = minutes % 60;
//   if (hours === 0) return `${rest} min`;
//   if (rest === 0) return `${hours} h`;
//   return `${hours} h ${`${rest}`.padStart(2, "0")} min`;
// }

/**
 * Parses a duration the way people type one into a timesheet: "2:30", "2.5",
 * "2,5" and "150m" all mean the same thing. Returns null when the input is not
 * a duration, so the caller can reject it rather than write NaN into state.
 */
export function parseDuration(raw: string): number | null {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) return null;

  // "2:30" — hours and minutes.
  const colon = trimmed.match(/^(\d{1,3}):([0-5]?\d)$/);
  if (colon) return Number(colon[1]) * HOUR + Number(colon[2]) * MINUTE;

  // "150m" — bare minutes.
  const bareMinutes = trimmed.match(/^(\d{1,5})m$/);
  if (bareMinutes) return Number(bareMinutes[1]) * MINUTE;

  // "2.5" / "2,5" / "2h" — decimal hours.
  const decimal = trimmed.replace(/h$/, "").replace(",", ".");
  if (!/^\d*\.?\d+$/.test(decimal)) return null;
  const hours = Number(decimal);
  if (!Number.isFinite(hours)) return null;

  return Math.round(hours * HOUR);
}

/* ==========================================================================
   Times of day
   ========================================================================== */

/** "1:00 PM" — the 12-hour clock the entry rows read in. */
export function formatClockTime(ms: number): string {
  const date = new Date(ms);
  const hours = date.getHours();
  const suffix = hours < 12 ? "AM" : "PM";
  // 0 and 12 both display as 12 on a 12-hour clock.
  const display = hours % 12 === 0 ? 12 : hours % 12;
  return `${display}:${`${date.getMinutes()}`.padStart(2, "0")} ${suffix}`;
}

/** "09:30" — the value an `<input type="time">` expects. */
export function toTimeInputValue(ms: number): string {
  const date = new Date(ms);
  return `${`${date.getHours()}`.padStart(2, "0")}:${`${date.getMinutes()}`.padStart(2, "0")}`;
}

/**
 * Resolves an `<input type="time">` value against the calendar day `on` falls
 * in, so editing a time never moves an entry to another date. Seconds are
 * dropped: the field cannot express them, and keeping the old ones would make
 * a "2:00 PM" entry sit at 2:00:37.
 */
export function fromTimeInputValue(value: string, on: number): number | null {
  const match = value.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  const day = startOfDay(new Date(on));
  return day.getTime() + hours * HOUR + minutes * MINUTE;
}

/** "Today", "Yesterday", or "Wed, 5 Aug" for anything older. */
export function formatDayLabel(date: Date, today: Date): string {
  if (isSameDay(date, today)) return "Today";

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (isSameDay(date, yesterday)) return "Yesterday";

  const stamp = `${WEEKDAYS[weekdayIndex(date)]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
  // The year only earns its place once the date leaves the current one.
  return date.getFullYear() === today.getFullYear()
    ? stamp
    : `${stamp} ${date.getFullYear()}`;
}

/* ==========================================================================
   Entries
   ========================================================================== */

export function entryDuration(entry: TimeEntry): number {
  return Math.max(0, entry.end - entry.start);
}

export function totalDuration(entries: TimeEntry[]): number {
  return entries.reduce((sum, entry) => sum + entryDuration(entry), 0);
}

/**
 * Buckets entries into calendar days, newest day first and newest entry first
 * within each day — the order a tracker is read in, since the thing you just
 * stopped is the thing you are looking for.
 *
 * An entry belongs to the day it *started* on. A span that runs past midnight
 * would otherwise split across two groups and stop matching its own duration.
 */
export function groupByDay(entries: TimeEntry[]): DayGroup[] {
  const groups = new Map<string, DayGroup>();

  for (const entry of entries) {
    const date = startOfDay(new Date(entry.start));
    const key = toISODate(date);
    let group = groups.get(key);
    if (!group) {
      group = { key, date, entries: [], total: 0 };
      groups.set(key, group);
    }
    group.entries.push(entry);
    group.total += entryDuration(entry);
  }

  const ordered = [...groups.values()].sort((a, b) => b.date.getTime() - a.date.getTime());
  for (const group of ordered) {
    group.entries.sort((a, b) => b.start - a.start);
  }
  return ordered;
}
