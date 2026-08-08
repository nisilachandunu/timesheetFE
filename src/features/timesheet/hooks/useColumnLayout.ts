"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  COLUMN_GROUPS,
  DAY_KEYS,
  DEFAULT_COLUMN_ORDER,
  LAYOUT_STORAGE_KEY,
} from "../constants";
import type { ColumnGroupKey, ColumnLayout } from "../types";

const KNOWN_GROUPS = new Set<string>(DEFAULT_COLUMN_ORDER);
const KNOWN_HIDEABLE = new Set<string>([...DEFAULT_COLUMN_ORDER, ...DAY_KEYS]);

/* Frozen so the server snapshot is referentially stable — useSyncExternalStore
   re-renders forever if getServerSnapshot returns a fresh object each call. */
export const DEFAULT_LAYOUT: ColumnLayout = Object.freeze({
  order: DEFAULT_COLUMN_ORDER,
  hidden: [] as string[],
  widths: {} as Record<string, number>,
}) as ColumnLayout;

const listeners = new Set<() => void>();
let cached: ColumnLayout | null = null;

/**
 * Reconciles a stored layout against the columns the code currently defines:
 * unknown keys are dropped and newly added columns are appended. Without this
 * a shipped column change would leave existing users with a broken grid.
 */
function reconcile(raw: unknown): ColumnLayout {
  if (!raw || typeof raw !== "object") return DEFAULT_LAYOUT;
  const value = raw as Partial<ColumnLayout>;

  const storedOrder = Array.isArray(value.order)
    ? value.order.filter((key): key is ColumnGroupKey => KNOWN_GROUPS.has(key))
    : [];
  const seen = new Set(storedOrder);
  const order = [
    ...storedOrder,
    ...DEFAULT_COLUMN_ORDER.filter((key) => !seen.has(key)),
  ];

  // The pinned column always leads, whatever the stored order claims.
  const pinned = order.filter((key) => COLUMN_GROUPS[key].pinned);
  const rest = order.filter((key) => !COLUMN_GROUPS[key].pinned);

  const hidden = Array.isArray(value.hidden)
    ? value.hidden.filter(
        (key): key is string =>
          typeof key === "string" &&
          KNOWN_HIDEABLE.has(key) &&
          !(KNOWN_GROUPS.has(key) && COLUMN_GROUPS[key as ColumnGroupKey].pinned),
      )
    : [];

  const widths: Record<string, number> = {};
  if (value.widths && typeof value.widths === "object") {
    for (const [key, width] of Object.entries(value.widths)) {
      if (!KNOWN_GROUPS.has(key) || typeof width !== "number") continue;
      const def = COLUMN_GROUPS[key as ColumnGroupKey];
      widths[key] = Math.max(def.minWidth, Math.min(720, Math.round(width)));
    }
  }

  return { order: [...pinned, ...rest], hidden, widths };
}

function read(): ColumnLayout {
  try {
    const stored = window.localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (!stored) return DEFAULT_LAYOUT;
    return reconcile(JSON.parse(stored));
  } catch {
    // Blocked storage or malformed JSON — fall back to the shipped layout.
    return DEFAULT_LAYOUT;
  }
}

function getSnapshot(): ColumnLayout {
  if (cached === null) cached = read();
  return cached;
}

function getServerSnapshot(): ColumnLayout {
  return DEFAULT_LAYOUT;
}

function subscribe(onChange: () => void): () => void {
  listeners.add(onChange);

  const onStorage = (event: StorageEvent) => {
    if (event.key === LAYOUT_STORAGE_KEY) {
      cached = null;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function commit(next: ColumnLayout) {
  cached = next;
  try {
    window.localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Persisting is best-effort; the in-memory layout still updates.
  }
  listeners.forEach((listener) => listener());
}

export function useColumnLayout() {
  const layout = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleColumn = useCallback((key: string) => {
    const current = getSnapshot();
    const hidden = new Set(current.hidden);
    if (hidden.has(key)) hidden.delete(key);
    else hidden.add(key);
    commit({ ...current, hidden: [...hidden] });
  }, []);

  /** Shows or hides all seven day columns at once. */
  const setDaysVisible = useCallback((visible: boolean) => {
    const current = getSnapshot();
    const hidden = new Set(current.hidden);
    if (visible) {
      hidden.delete("days");
      DAY_KEYS.forEach((key) => hidden.delete(key));
    } else {
      hidden.add("days");
    }
    commit({ ...current, hidden: [...hidden] });
  }, []);

  /** Moves a column one slot left (-1) or right (+1) among unpinned columns. */
  const moveColumn = useCallback((key: ColumnGroupKey, direction: -1 | 1) => {
    const current = getSnapshot();
    if (COLUMN_GROUPS[key].pinned) return;

    const order = [...current.order];
    const from = order.indexOf(key);
    const to = from + direction;
    if (from < 0 || to < 0 || to >= order.length) return;
    if (COLUMN_GROUPS[order[to]].pinned) return;

    [order[from], order[to]] = [order[to], order[from]];
    commit({ ...current, order });
  }, []);

  /** Drops `key` at the position currently held by `targetKey`. */
  const reorderColumn = useCallback(
    (key: ColumnGroupKey, targetKey: ColumnGroupKey) => {
      const current = getSnapshot();
      if (key === targetKey) return;
      if (COLUMN_GROUPS[key].pinned || COLUMN_GROUPS[targetKey].pinned) return;

      const order = [...current.order];
      const from = order.indexOf(key);
      const to = order.indexOf(targetKey);
      if (from < 0 || to < 0) return;

      order.splice(from, 1);
      order.splice(to, 0, key);
      commit({ ...current, order });
    },
    [],
  );

  const setWidth = useCallback((groupKey: ColumnGroupKey, width: number) => {
    const current = getSnapshot();
    const def = COLUMN_GROUPS[groupKey];
    const clamped = Math.max(def.minWidth, Math.min(720, Math.round(width)));
    commit({ ...current, widths: { ...current.widths, [groupKey]: clamped } });
  }, []);

  const reset = useCallback(() => {
    commit(DEFAULT_LAYOUT);
  }, []);

  const isCustomised =
    layout.hidden.length > 0 ||
    Object.keys(layout.widths).length > 0 ||
    layout.order.join() !== DEFAULT_COLUMN_ORDER.join();

  return {
    layout,
    isCustomised,
    toggleColumn,
    setDaysVisible,
    moveColumn,
    reorderColumn,
    setWidth,
    reset,
  };
}
