"use client";

import { useCallback, useMemo, useState } from "react";
import { INITIAL_TASKS, SEED_HOURS } from "../constants";
import type { Category, EntryMap, SheetStatus, TaskRow } from "../types";
import { addDays, clampHours, entryKey, startOfWeek } from "../utils";

/**
 * One band of rows in the grid. Grouping is deliberately a single level —
 * nesting projects under a "Project tasks" super-heading produced two
 * stacked headings that looked alike but meant different things.
 */
export interface TaskGroupSection {
  /** Project id, or "non-project" for the catch-all group. */
  id: string;
  name: string;
  kind: "project" | "non-project";
  tasks: TaskRow[];
}

let nextId = 0;
function createId(): string {
  nextId += 1;
  return `t-new-${nextId}`;
}

/**
 * Owns the week's rows and hour entries.
 *
 * Entries are keyed by task *and date*, so moving between weeks simply reads a
 * different slice of the same map — no per-week bookkeeping.
 *
 * Takes `today` rather than the displayed week: the sample hours belong to the
 * current week specifically, and deriving them keeps the seed out of an effect.
 */
export function useTimesheet(today: Date | null) {
  const [rows, setRows] = useState<TaskRow[]>(INITIAL_TASKS);
  /* Only the user's own edits live in state. A zero here is meaningful — it
     shadows a seeded value — so entries are merged rather than replaced. */
  const [edits, setEdits] = useState<EntryMap>({});
  const [status, setStatus] = useState<SheetStatus>("draft");
  const [isDirty, setIsDirty] = useState(false);

  const seed = useMemo<EntryMap>(() => {
    if (!today) return {};
    const weekStart = startOfWeek(today);
    const initial: EntryMap = {};
    for (const [taskId, hours] of Object.entries(SEED_HOURS)) {
      hours.forEach((value, index) => {
        if (value > 0) initial[entryKey(taskId, addDays(weekStart, index))] = value;
      });
    }
    return initial;
  }, [today]);

  const entries = useMemo<EntryMap>(() => ({ ...seed, ...edits }), [seed, edits]);

  /** A submitted sheet is read-only until it is reopened. */
  const isLocked = status !== "draft";

  const setEntry = useCallback(
    (taskId: string, date: Date, hours: number) => {
      if (isLocked) return;
      const key = entryKey(taskId, date);
      const value = clampHours(hours);

      setEdits((current) => {
        if ((current[key] ?? seed[key] ?? 0) === value) return current;
        const next = { ...current };
        // A zero is only worth storing when it has a seeded value to clear;
        // otherwise drop the key so the map stays sparse.
        if (value === 0 && !(key in seed)) delete next[key];
        else next[key] = value;
        return next;
      });
      setIsDirty(true);
    },
    [isLocked, seed],
  );

  const addTask = useCallback(
    (input: {
      group: TaskRow["group"];
      name: string;
      category: Category;
      project?: { id: string; name: string };
      mainTask?: { id: string; label: string };
      startDate: string;
      endDate?: string;
    }) => {
      if (isLocked) return null;
      const task: TaskRow = {
        id: createId(),
        name: input.name,
        group: input.group,
        projectId: input.project?.id,
        projectName: input.project?.name,
        mainTaskId: input.mainTask?.id,
        mainTaskLabel: input.mainTask?.label,
        category: input.category,
        status: "not-started",
        approval: "none",
        startDate: input.startDate,
        endDate: input.endDate,
      };
      setRows((current) => [...current, task]);
      setIsDirty(true);
      return task.id;
    },
    [isLocked],
  );

  const removeTask = useCallback(
    (taskId: string) => {
      if (isLocked) return;
      setRows((current) => current.filter((row) => row.id !== taskId));
      /* Any seeded entries for this task are left behind harmlessly: every
         total iterates over `rows`, so an orphaned key is never read. */
      setEdits((current) => {
        const next: EntryMap = {};
        for (const [key, value] of Object.entries(current)) {
          if (!key.startsWith(`${taskId}|`)) next[key] = value;
        }
        return next;
      });
      setIsDirty(true);
    },
    [isLocked],
  );

  /* No backend yet — "saving" just marks the sheet clean. */
  const save = useCallback(() => setIsDirty(false), []);

  const complete = useCallback(() => {
    setRows((current) =>
      current.map((row) =>
        row.approval === "none" ? { ...row, approval: "pending" } : row,
      ),
    );
    setStatus("submitted");
    setIsDirty(false);
  }, []);

  const reopen = useCallback(() => {
    setRows((current) =>
      current.map((row) =>
        row.approval === "pending" ? { ...row, approval: "none" } : row,
      ),
    );
    setStatus("draft");
  }, []);

  /** Rows grouped into the bands the grid renders, projects first. */
  const groups = useMemo<TaskGroupSection[]>(() => {
    const projects: TaskGroupSection[] = [];
    const byProject = new Map<string, TaskGroupSection>();
    const nonProject: TaskRow[] = [];

    for (const row of rows) {
      if (row.group === "non-project" || !row.projectId) {
        nonProject.push(row);
        continue;
      }
      let section = byProject.get(row.projectId);
      if (!section) {
        section = {
          id: row.projectId,
          name: row.projectName ?? "Project",
          kind: "project",
          tasks: [],
        };
        byProject.set(row.projectId, section);
        projects.push(section);
      }
      section.tasks.push(row);
    }

    /* The catch-all group is always present, even when empty, so the button
       that adds a non-project task never disappears. */
    return [
      ...projects,
      {
        id: "non-project",
        name: "Non-project",
        kind: "non-project",
        tasks: nonProject,
      },
    ];
  }, [rows]);

  return {
    rows,
    groups,
    entries,
    status,
    isDirty,
    isLocked,
    setEntry,
    addTask,
    removeTask,
    save,
    complete,
    reopen,
  };
}
