"use client";

import { useCallback, useMemo, useState } from "react";
import { startOfDay, startOfWeek } from "@/lib/date";
import { RUNNING_STORAGE_KEY, SEED_ENTRIES } from "../constants";
import type { EntryDraft, RunningEntry, TimeEntry, TrackerMode } from "../types";
import { HOUR, MINUTE, groupByDay, totalDuration } from "../utils";

/** A single entry longer than a day is a slip, not a shift. */
export const MAX_ENTRY_MS = 24 * HOUR;

const EMPTY_DRAFT: EntryDraft = {
  description: "",
  tags: [],
  billable: false,
};

let nextId = 0;
function createId(): string {
  nextId += 1;
  return `e-new-${nextId}`;
}

/** Materialises the seed entries against the day the page was opened. */
function buildSeedEntries(today: Date): TimeEntry[] {
  return SEED_ENTRIES.map((seed, index) => {
    const day = new Date(today);
    day.setDate(day.getDate() + seed.dayOffset);
    const midnight = startOfDay(day).getTime();

    return {
      id: `e-seed-${index}`,
      description: seed.description,
      projectId: seed.projectId,
      tags: seed.tags ?? [],
      billable: seed.billable ?? false,
      start: midnight + seed.at * MINUTE,
      end: midnight + seed.until * MINUTE,
    };
  });
}

function readRunning(): RunningEntry | null {
  try {
    const raw = window.localStorage.getItem(RUNNING_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;

    const candidate = parsed as Partial<RunningEntry>;
    if (typeof candidate.startedAt !== "number") return null;

    return {
      description: typeof candidate.description === "string" ? candidate.description : "",
      projectId: typeof candidate.projectId === "string" ? candidate.projectId : undefined,
      tags: Array.isArray(candidate.tags)
        ? candidate.tags.filter((tag): tag is string => typeof tag === "string")
        : [],
      billable: candidate.billable === true,
      startedAt: candidate.startedAt,
    };
  } catch {
    // Blocked storage, or a payload written by an older shape — start idle.
    return null;
  }
}

function writeRunning(running: RunningEntry | null) {
  try {
    if (running) {
      window.localStorage.setItem(RUNNING_STORAGE_KEY, JSON.stringify(running));
    } else {
      window.localStorage.removeItem(RUNNING_STORAGE_KEY);
    }
  } catch {
    // Persisting is best-effort; the in-memory timer still runs.
    void 0;
  }
}

/**
 * Normalises a span so it always moves forward in time. An end before its start
 * means the work crossed midnight — the honest reading of "10 PM to 2 AM" — so
 * the end rolls onto the next day rather than collapsing to zero.
 */
function normaliseSpan(start: number, end: number): { start: number; end: number } {
  let resolved = end;
  while (resolved < start) resolved += 24 * HOUR;
  return { start, end: resolved };
}

/**
 * Owns the tracker's entries, the timer that is running, and the draft the next
 * entry is composed from.
 *
 * Entries are held as one flat, unordered list; the list's day grouping and
 * every total are derived from it, so an edit never has to be applied in two
 * places. Only the running timer is persisted — a stopwatch that dies on
 * refresh is a broken stopwatch — while the entries themselves wait for the
 * backend, as the timesheet's do.
 *
 * Mounted on the client only (the screen gates it behind hydration), so it may
 * read the clock and `localStorage` while initialising.
 */
export function useTimeTracker() {
  const [entries, setEntries] = useState<TimeEntry[]>(() => buildSeedEntries(new Date()));
  const [running, setRunning] = useState<RunningEntry | null>(readRunning);
  const [draft, setDraftState] = useState<EntryDraft>(EMPTY_DRAFT);
  const [mode, setMode] = useState<TrackerMode>("timer");

  /* The composer edits the running timer once one exists, so typing a
     description into a live timer is not silently discarded on stop. */
  const composer: EntryDraft = running ?? draft;

  /* Persisting and creating ids are side effects, so they run in the event
     handler rather than inside a `setState` updater — an updater can be
     re-invoked (StrictMode does it deliberately) and would file the entry
     twice. */

  const setComposer = useCallback(
    (patch: Partial<EntryDraft>) => {
      if (running) {
        const next = { ...running, ...patch };
        writeRunning(next);
        setRunning(next);
        return;
      }
      setDraftState((current) => ({ ...current, ...patch }));
    },
    [running],
  );

  /* Takes no arguments on purpose: it is wired straight to a click handler, and
     a parameter here would quietly receive the event object. Starting from an
     existing entry goes through `continueEntry`. */
  const start = useCallback(() => {
    // Restarting while a timer runs takes over the live span rather than
    // orphaning it — the composer is showing that timer, not the draft.
    const base = running ?? draft;
    const next: RunningEntry = {
      description: base.description,
      projectId: base.projectId,
      tags: base.tags,
      billable: base.billable,
      startedAt: Date.now(),
    };
    writeRunning(next);
    setRunning(next);
  }, [draft, running]);

  const stop = useCallback(() => {
    if (!running) return;
    /* Sub-minute spans are almost always a mis-click on START. Anything
       shorter than a minute is rounded up to one so the entry still lands
       somewhere visible in a list that reads in minutes. */
    const entry: TimeEntry = {
      id: createId(),
      description: running.description,
      projectId: running.projectId,
      tags: running.tags,
      billable: running.billable,
      start: running.startedAt,
      end: Math.max(Date.now(), running.startedAt + MINUTE),
    };
    setEntries((rows) => [...rows, entry]);
    writeRunning(null);
    setRunning(null);
    setDraftState(EMPTY_DRAFT);
  }, [running]);

  /** Abandons the running timer without filing an entry. */
  const discard = useCallback(() => {
    writeRunning(null);
    setRunning(null);
  }, []);

  // IDLE DETECTION (disabled) — see ./useIdleDetection.ts
  // /**
  //  * Cuts the running timer at `cutoff`, files the work up to that point, and
  //  * either restarts at `resumeAt` or leaves the tracker idle.
  //  *
  //  * This is how idle time is excluded. The alternative — sliding `startedAt`
  //  * forward by the idle duration — keeps one row and the right total, but the
  //  * row then claims to have started at a time nobody was working, and a second
  //  * exclusion drifts it further. Splitting keeps every timestamp true; the cost
  //  * is one extra row, which is the honest shape of what happened.
  //  */
  // const splitRunning = useCallback(
  //   (cutoff: number, resumeAt: number | null) => {
  //     if (!running) return;
  //     const end = Math.max(running.startedAt, cutoff);
  //
  //     /* Nothing worth filing when the timer had barely started before the
  //        machine went idle — the whole span was the idle period. */
  //     if (end - running.startedAt >= MINUTE) {
  //       setEntries((rows) => [
  //         ...rows,
  //         {
  //           id: createId(),
  //           description: running.description,
  //           projectId: running.projectId,
  //           tags: running.tags,
  //           billable: running.billable,
  //           start: running.startedAt,
  //           end,
  //         },
  //       ]);
  //     }
  //
  //     if (resumeAt === null) {
  //       writeRunning(null);
  //       setRunning(null);
  //       setDraftState(EMPTY_DRAFT);
  //       return;
  //     }
  //
  //     const next: RunningEntry = { ...running, startedAt: resumeAt };
  //     writeRunning(next);
  //     setRunning(next);
  //   },
  //   [running],
  // );

  /** Files an entry directly from the manual composer's start and end times. */
  const addManual = useCallback(
    (span: { start: number; end: number }) => {
      const { start: from, end: to } = normaliseSpan(span.start, span.end);
      const entry: TimeEntry = {
        id: createId(),
        description: draft.description,
        projectId: draft.projectId,
        tags: draft.tags,
        billable: draft.billable,
        start: from,
        end: Math.min(to, from + MAX_ENTRY_MS),
      };
      setEntries((rows) => [...rows, entry]);
      setDraftState(EMPTY_DRAFT);
    },
    [draft],
  );

  const updateEntry = useCallback(
    (id: string, patch: Partial<Omit<TimeEntry, "id">>) => {
      setEntries((rows) =>
        rows.map((row) => {
          if (row.id !== id) return row;
          const merged = { ...row, ...patch };
          const span = normaliseSpan(merged.start, merged.end);
          return { ...merged, ...span };
        }),
      );
    },
    [],
  );

  /** Moves an entry's end so the span lasts exactly `ms`. */
  const setEntryDuration = useCallback(
    (id: string, ms: number) => {
      const capped = Math.min(Math.max(MINUTE, ms), MAX_ENTRY_MS);
      setEntries((rows) =>
        rows.map((row) => (row.id === id ? { ...row, end: row.start + capped } : row)),
      );
    },
    [],
  );

  const duplicateEntry = useCallback((id: string) => {
    setEntries((rows) => {
      const source = rows.find((row) => row.id === id);
      if (!source) return rows;
      return [...rows, { ...source, id: createId() }];
    });
  }, []);

  const removeEntry = useCallback((id: string) => {
    setEntries((rows) => rows.filter((row) => row.id !== id));
  }, []);

  /** Starts a fresh timer carrying an existing entry's description and tags. */
  const continueEntry = useCallback(
    (id: string) => {
      const source = entries.find((row) => row.id === id);
      if (!source) return;
      const next: RunningEntry = {
        description: source.description,
        projectId: source.projectId,
        tags: source.tags,
        billable: source.billable,
        startedAt: Date.now(),
      };
      writeRunning(next);
      setRunning(next);
      setMode("timer");
    },
    [entries],
  );

  const days = useMemo(() => groupByDay(entries), [entries]);

  /** Logged since Monday, excluding whatever is still running. */
  const weekTotal = useMemo(() => {
    const from = startOfWeek(new Date()).getTime();
    return totalDuration(entries.filter((entry) => entry.start >= from));
  }, [entries]);

  return {
    entries,
    days,
    weekTotal,
    running,
    composer,
    mode,
    setMode,
    setComposer,
    start,
    stop,
    discard,
    // IDLE DETECTION (disabled)
    // splitRunning,
    addManual,
    updateEntry,
    setEntryDuration,
    duplicateEntry,
    removeEntry,
    continueEntry,
  };
}
