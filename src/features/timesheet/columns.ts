import { COLUMN_GROUPS } from "./constants";
import type { ColumnGroupKey, ColumnLayout, RenderedColumn } from "./types";
import { formatWeekday, isSameDay, isWeekend } from "./utils";

/**
 * Flattens the stored group order into the columns actually rendered,
 * expanding the `days` group into one column per visible date.
 */
export function buildColumns(
  layout: ColumnLayout,
  dates: Date[],
  today: Date | null,
): RenderedColumn[] {
  const hidden = new Set(layout.hidden);
  const columns: RenderedColumn[] = [];

  for (const groupKey of layout.order) {
    if (hidden.has(groupKey)) continue;

    if (groupKey === "days") {
      const def = COLUMN_GROUPS.days;
      dates.forEach((date, index) => {
        if (hidden.has(`day-${index}`)) return;
        columns.push({
          key: `day-${index}`,
          group: "days",
          label: formatWeekday(date),
          align: "center",
          // Every day shares one width, so dragging any day edge resizes
          // the whole block — resizing seven columns by hand is busywork.
          width: layout.widths.days ?? def.defaultWidth,
          minWidth: def.minWidth,
          date,
          isWeekend: isWeekend(date),
          isToday: today ? isSameDay(date, today) : false,
        });
      });
      continue;
    }

    const def = COLUMN_GROUPS[groupKey as ColumnGroupKey];
    columns.push({
      key: def.key,
      group: def.key,
      label: def.label,
      align: def.align,
      width: layout.widths[def.key] ?? def.defaultWidth,
      minWidth: def.minWidth,
    });
  }

  return columns;
}

/** Total pixel width, used to give the table a floor so columns keep shape. */
export function totalWidth(columns: RenderedColumn[]): number {
  return columns.reduce((sum, column) => sum + column.width, 0);
}
