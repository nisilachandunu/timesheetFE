"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { RenderedColumn } from "../types";

/**
 * Squeezes columns into the space actually available.
 *
 * The stored widths are the *preferred* widths — comfortable on a wide
 * monitor, but their sum (~1240px by default) is wider than the content area
 * of a 1366px laptop once the sidebar and page padding are taken out. Without
 * this the grid simply overflowed and the last columns lived off-screen.
 *
 * Each column gives up the same proportion of its slack — the distance
 * between its preferred and its minimum width — so the layout keeps its shape
 * instead of one column absorbing the whole deficit. Columns already at their
 * minimum are left alone; if even the minimums don't fit, the grid scrolls
 * horizontally as before, which is the honest outcome on a genuinely narrow
 * screen.
 */
export function fitColumns(
  columns: RenderedColumn[],
  available: number,
): RenderedColumn[] {
  // Before the first measurement `available` is 0 — render at preferred
  // widths, which is also what the server rendered.
  if (available <= 0) return columns;

  const natural = columns.reduce((sum, column) => sum + column.width, 0);
  if (natural <= available) return columns;

  const slack = columns.map((column) => Math.max(0, column.width - column.minWidth));
  const totalSlack = slack.reduce((sum, value) => sum + value, 0);
  if (totalSlack === 0) return columns;

  const ratio = Math.min(1, (natural - available) / totalSlack);

  return columns.map((column, index) =>
    slack[index] === 0
      ? column
      : { ...column, width: Math.round(column.width - slack[index] * ratio) },
  );
}

export function useFittedColumns(columns: RenderedColumn[]) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(0);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return;

    // clientWidth rather than the observer's contentRect: it already excludes
    // the vertical scrollbar, which is space the table cannot use.
    const measure = () => setAvailable(node.clientWidth);
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const fitted = useMemo(() => fitColumns(columns, available), [columns, available]);

  return { scrollerRef, columns: fitted };
}
