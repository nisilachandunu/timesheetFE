/**
 * A project an entry can be booked against. Carries its own colour so the dot
 * beside an entry identifies the project at a glance, the way the sidebar's
 * section accents do.
 */
export interface TrackerProject {
  id: string;
  name: string;
  /** Solid hex, used for the dot and the picker's swatch. */
  color: string;
}

/**
 * One logged stretch of work.
 *
 * `start`/`end` are epoch milliseconds rather than dates: a stopwatch measures
 * an interval, and durations then fall out of plain subtraction with no
 * calendar arithmetic in the hot path. Day grouping converts back once, at the
 * point where it is actually a calendar question.
 */
export interface TimeEntry {
  id: string;
  description: string;
  /** Absent for unassigned work — rendered as "No project". */
  projectId?: string;
  tags: string[];
  /** Charged to the client. Drives the `$` affordance on the row. */
  billable: boolean;
  start: number;
  end: number;
}

/**
 * The entry being timed right now. It has no `end` — that is what "running"
 * means — and it becomes a `TimeEntry` the moment the timer is stopped.
 */
export interface RunningEntry {
  description: string;
  projectId?: string;
  tags: string[];
  billable: boolean;
  startedAt: number;
}

/** The draft an entry is composed from, shared by both input modes. */
export interface EntryDraft {
  description: string;
  projectId?: string;
  tags: string[];
  billable: boolean;
}

/**
 * Timer mode runs a stopwatch; manual mode takes a start and end time and
 * files the entry immediately. Same draft, two ways of putting a span on it.
 */
export type TrackerMode = "timer" | "manual";

/** A day's worth of entries, newest first, as the list renders them. */
export interface DayGroup {
  /** ISO yyyy-mm-dd — stable across re-renders, unlike a Date. */
  key: string;
  date: Date;
  entries: TimeEntry[];
  /** Sum of the group's entry durations, in milliseconds. */
  total: number;
}
