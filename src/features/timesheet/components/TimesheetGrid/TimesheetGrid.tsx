"use client";

import {
  Fragment,
  useCallback,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { Icon } from "@/components/ui";
import { APPROVAL_STATUS_META, COLUMN_GROUPS, TASK_STATUS_META } from "../../constants";
import { useFittedColumns, type TaskGroupSection } from "../../hooks";
import type {
  Category,
  ColumnAlign,
  ColumnGroupKey,
  EntryMap,
  RenderedColumn,
  TaskRow,
} from "../../types";
import {
  STANDARD_DAY_HOURS,
  dayTotal,
  formatDayMonth,
  formatFullDate,
  formatTotal,
  getEntry,
  parseISODate,
  rowTotal,
} from "../../utils";
import { HourCell } from "../HourCell";
import { StatusChip } from "../StatusChip";
import styles from "./TimesheetGrid.module.css";

export interface TimesheetGridProps {
  columns: RenderedColumn[];
  groups: TaskGroupSection[];
  rows: TaskRow[];
  entries: EntryMap;
  dates: Date[];
  isLocked: boolean;
  onSetEntry: (taskId: string, date: Date, hours: number) => void;
  /** Opens the add-task modal — task creation itself happens on submit. */
  onRequestAddTask: (
    group: TaskRow["group"],
    project?: { id: string; name: string },
  ) => void;
  onRemoveTask: (taskId: string) => void;
  onResizeColumn: (group: ColumnGroupKey, width: number) => void;
  onReorderColumn: (key: ColumnGroupKey, target: ColumnGroupKey) => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const ALIGN_CLASS: Record<ColumnAlign, string> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
};

const CATEGORY_CLASS: Record<Category, string> = {
  Billable: styles.catBillable,
  "Non-Billable": styles.catNonBillable,
  Leave: styles.catLeave,
};

/**
 * Main task and assignment window aren't worth a dedicated column — most rows
 * won't need to distinguish them at a glance — but the modal collects them,
 * so they surface on hover rather than vanishing after creation.
 */
function taskDetails(row: TaskRow): string | undefined {
  const parts: string[] = [];
  if (row.mainTaskLabel) parts.push(row.mainTaskLabel);
  if (row.startDate) {
    const start = formatFullDate(parseISODate(row.startDate));
    parts.push(row.endDate ? `${start} – ${formatFullDate(parseISODate(row.endDate))}` : `From ${start}`);
  }
  return parts.length > 0 ? parts.join(" • ") : undefined;
}

export function TimesheetGrid({
  columns: preferredColumns,
  groups,
  rows,
  entries,
  dates,
  isLocked,
  onSetEntry,
  onRequestAddTask,
  onRemoveTask,
  onResizeColumn,
  onReorderColumn,
}: TimesheetGridProps) {
  /* Everything below renders the *fitted* columns — same columns, widths
     compressed to whatever the viewport can actually show. */
  const { scrollerRef, columns } = useFittedColumns(preferredColumns);

  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [dragKey, setDragKey] = useState<ColumnGroupKey | null>(null);
  const [dropKey, setDropKey] = useState<ColumnGroupKey | null>(null);

  /* Hour inputs, keyed `${taskId}|${columnKey}`, so arrow-key navigation can
     jump straight to a neighbouring cell without a ref per row. */
  const cellRefs = useRef(new Map<string, HTMLInputElement | null>());

  const dayColumns = useMemo(
    () => columns.filter((column) => column.group === "days"),
    [columns],
  );

  /* The seven day columns are the grid's centre of gravity. Fencing them off
     splits the table into three scannable zones — identity, days, summary —
     which is what lets the whole row be read in one pass. */
  const zoneEdges = useMemo(() => {
    const firstDay = columns.findIndex((column) => column.group === "days");
    let lastDay = -1;
    columns.forEach((column, index) => {
      if (column.group === "days") lastDay = index;
    });
    return {
      // Skip the opening fence when the frozen task column already draws one.
      openKey:
        firstDay > 1 && columns[firstDay - 1]?.group !== "task"
          ? columns[firstDay]?.key
          : null,
      closeKey:
        lastDay >= 0 && lastDay < columns.length - 1 ? columns[lastDay]?.key : null,
    };
  }, [columns]);

  const zoneClass = (column: RenderedColumn) =>
    [
      column.key === zoneEdges.openKey ? styles.zoneOpen : "",
      column.key === zoneEdges.closeKey ? styles.zoneClose : "",
    ]
      .filter(Boolean)
      .join(" ");

  const toggleCollapse = useCallback((key: string) => {
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  /** Rows in visual order, skipping anything inside a collapsed group. */
  const visibleRows = useMemo(() => {
    const list: TaskRow[] = [];
    for (const group of groups) {
      if (collapsed.has(group.id)) continue;
      list.push(...group.tasks);
    }
    return list;
  }, [groups, collapsed]);

  const navigate = useCallback(
    (taskId: string, columnKey: string, rowDelta: number, dayDelta: number) => {
      const rowIndex = visibleRows.findIndex((row) => row.id === taskId);
      const dayIndex = dayColumns.findIndex((column) => column.key === columnKey);
      if (rowIndex < 0 || dayIndex < 0) return;

      const nextRow = clamp(rowIndex + rowDelta, 0, visibleRows.length - 1);
      const nextDay = clamp(dayIndex + dayDelta, 0, dayColumns.length - 1);
      const target = cellRefs.current.get(
        `${visibleRows[nextRow].id}|${dayColumns[nextDay].key}`,
      );
      target?.focus();
    },
    [visibleRows, dayColumns],
  );

  /* --- Column resizing --- */

  const startResize = (event: PointerEvent<HTMLElement>, column: RenderedColumn) => {
    event.preventDefault();
    event.stopPropagation();

    const handle = event.currentTarget;
    const startX = event.clientX;
    const startWidth = column.width;
    handle.setPointerCapture(event.pointerId);

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      onResizeColumn(column.group, startWidth + (moveEvent.clientX - startX));
    };
    const onUp = () => {
      handle.releasePointerCapture(event.pointerId);
      handle.removeEventListener("pointermove", onMove);
      handle.removeEventListener("pointerup", onUp);
    };

    handle.addEventListener("pointermove", onMove);
    handle.addEventListener("pointerup", onUp);
  };

  /** Keyboard equivalent of dragging the column edge. */
  const resizeByKey = (event: KeyboardEvent<HTMLElement>, column: RenderedColumn) => {
    const step = event.shiftKey ? 32 : 12;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onResizeColumn(column.group, column.width - step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onResizeColumn(column.group, column.width + step);
    }
  };

  /* --- Column reordering --- */

  const handleDragStart = (event: DragEvent<HTMLElement>, group: ColumnGroupKey) => {
    if (COLUMN_GROUPS[group].pinned) return;
    setDragKey(group);
    event.dataTransfer.effectAllowed = "move";
    // Firefox will not start a drag without payload.
    event.dataTransfer.setData("text/plain", group);
  };

  const handleDragOver = (event: DragEvent<HTMLElement>, group: ColumnGroupKey) => {
    if (!dragKey || COLUMN_GROUPS[group].pinned || group === dragKey) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDropKey(group);
  };

  const handleDrop = (event: DragEvent<HTMLElement>, group: ColumnGroupKey) => {
    event.preventDefault();
    if (dragKey && group !== dragKey) onReorderColumn(dragKey, group);
    setDragKey(null);
    setDropKey(null);
  };

  const endDrag = () => {
    setDragKey(null);
    setDropKey(null);
  };

  /* --- Cells --- */

  const renderCell = (column: RenderedColumn, row: TaskRow, index: number) => {
    const align = ALIGN_CLASS[column.align];

    switch (column.group) {
      case "task":
        // Assigned by a manager, not the employee filling in hours — the name
        // is display-only text, not an input.
        return (
          <th key={column.key} scope="row" className={`${styles.cell} ${styles.taskCell}`}>
            <span className={styles.taskInner}>
              <span className={styles.rowIndex}>{index + 1}</span>
              <span className={styles.taskName} title={taskDetails(row)}>
                {row.name || <span className={styles.taskNamePlaceholder}>Untitled task</span>}
              </span>
            </span>
          </th>
        );

      case "category":
        // Set when the task was assigned, likewise read-only here.
        return (
          <td key={column.key} className={`${styles.cell} ${zoneClass(column)}`}>
            <span
              className={`${styles.categoryChip} ${CATEGORY_CLASS[row.category]}`}
            >
              {row.category}
            </span>
          </td>
        );

      case "days": {
        const date = column.date!;
        return (
          <td
            key={column.key}
            className={`${styles.cell} ${styles.dayCell} ${zoneClass(column)} ${
              column.isWeekend ? styles.weekendCell : ""
            } ${column.isToday ? styles.todayCell : ""}`}
          >
            <HourCell
              value={getEntry(entries, row.id, date)}
              disabled={isLocked}
              weekend={column.isWeekend}
              label={`${row.name || "Untitled task"}, ${formatFullDate(date)}`}
              onChange={(hours) => onSetEntry(row.id, date, hours)}
              onNavigate={(rowDelta, dayDelta) =>
                navigate(row.id, column.key, rowDelta, dayDelta)
              }
              registerRef={(node) => {
                cellRefs.current.set(`${row.id}|${column.key}`, node);
              }}
            />
          </td>
        );
      }

      case "total": {
        const total = rowTotal(entries, row.id, dates);
        return (
          <td
            key={column.key}
            className={`${styles.cell} ${align} ${styles.totalCell} ${zoneClass(column)}`}
          >
            <span className={total > 0 ? styles.totalValue : styles.totalEmpty}>
              {total > 0 ? `${formatTotal(total)}h` : "–"}
            </span>
          </td>
        );
      }

      case "status": {
        const meta = TASK_STATUS_META[row.status];
        return (
          <td key={column.key} className={`${styles.cell} ${align} ${zoneClass(column)}`}>
            <StatusChip label={meta.label} tone={meta.tone} />
          </td>
        );
      }

      case "approval": {
        const meta = APPROVAL_STATUS_META[row.approval];
        return (
          <td key={column.key} className={`${styles.cell} ${align} ${zoneClass(column)}`}>
            {meta ? (
              <StatusChip label={meta.label} tone={meta.tone} />
            ) : (
              <span className={styles.muted}>–</span>
            )}
          </td>
        );
      }

      case "actions":
        return (
          <td
            key={column.key}
            className={`${styles.cell} ${styles.actionsCell} ${zoneClass(column)}`}
          >
            <button
              type="button"
              className={styles.remove}
              disabled={isLocked}
              onClick={() => onRemoveTask(row.id)}
              aria-label={`Remove ${row.name || "untitled task"}`}
              title="Remove task"
            >
              <Icon name="delete" size={18} />
            </button>
          </td>
        );

      default:
        return <td key={column.key} className={styles.cell} />;
    }
  };

  const renderTaskRows = (tasks: TaskRow[], startDelayMs: number = 0) =>
    tasks.map((row, index) => {
      const delay = startDelayMs + (index + 1) * 55;
      return (
        <tr
          key={row.id}
          // The rail stops half way down the final row, closing the branch.
          className={`${styles.taskRow} ${
            index === tasks.length - 1 ? styles.lastInGroup : ""
          }`}
          style={{ "--row-delay": `${Math.min(delay, 800)}ms` } as React.CSSProperties}
        >
          {columns.map((column) => renderCell(column, row, index))}
        </tr>
      );
    });

  const emptyRow = (key: string, message: string) => (
    <tr key={key}>
      <td colSpan={columns.length} className={styles.emptyCell}>
        <span className={styles.groupBar}>{message}</span>
      </td>
    </tr>
  );

  return (
    <div className={styles.scroller} ref={scrollerRef}>
      <table className={styles.table} style={{ minWidth: `${totalOf(columns)}px` }}>
        <colgroup>
          {columns.map((column) => (
            <col key={column.key} style={{ width: `${column.width}px` }} />
          ))}
        </colgroup>

        <thead className={styles.head}>
          <tr>
            {columns.map((column) => {
              const def = COLUMN_GROUPS[column.group];
              const isDay = column.group === "days";
              const movable = !def.pinned;

              return (
                <th
                  key={column.key}
                  scope="col"
                  draggable={movable}
                  onDragStart={(event) => handleDragStart(event, column.group)}
                  onDragOver={(event) => handleDragOver(event, column.group)}
                  onDrop={(event) => handleDrop(event, column.group)}
                  onDragEnd={endDrag}
                  className={[
                    styles.headCell,
                    ALIGN_CLASS[column.align],
                    zoneClass(column),
                    def.pinned ? styles.headTaskCell : "",
                    isDay ? styles.headDay : "",
                    column.isWeekend ? styles.weekendCell : "",
                    column.isToday ? styles.todayCell : "",
                    dragKey === column.group ? styles.dragging : "",
                    dropKey === column.group ? styles.dropTarget : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className={styles.headInner}>
                    {isDay ? (
                      <>
                        <span className={styles.dayName}>{column.label}</span>
                        <span className={styles.dayDate}>
                          {formatDayMonth(column.date!)}
                        </span>
                        {column.isToday && (
                          <span className="sr-only"> (today)</span>
                        )}
                      </>
                    ) : (
                      /* The delete column needs no heading — the icons speak
                         for themselves and a label just adds noise. */
                      column.group !== "actions" && def.label
                    )}
                  </span>

                  <span
                    role="separator"
                    aria-orientation="vertical"
                    aria-label={`Resize ${def.label} column`}
                    tabIndex={0}
                    draggable={false}
                    className={styles.resizer}
                    onPointerDown={(event) => startResize(event, column)}
                    onKeyDown={(event) => resizeByKey(event, column)}
                    // Stops the header's own drag from hijacking the handle.
                    onDragStart={(event) => event.preventDefault()}
                  />
                </th>
              );
            })}
          </tr>
        </thead>

        <tbody>
          {(() => {
            let runningDelay = 100;
            return groups.map((group) => {
              const groupDelay = runningDelay;
              const taskCount = !collapsed.has(group.id) ? group.tasks.length : 0;
              runningDelay += (1 + taskCount) * 55;

              return (
                <Fragment key={group.id}>
                  <GroupRow
                    colSpan={columns.length}
                    group={group}
                    entries={entries}
                    dates={dates}
                    isCollapsed={collapsed.has(group.id)}
                    isLocked={isLocked}
                    delayMs={Math.min(groupDelay, 800)}
                    onToggle={() => toggleCollapse(group.id)}
                    onAdd={() =>
                      onRequestAddTask(
                        group.kind,
                        group.kind === "project"
                          ? { id: group.id, name: group.name }
                          : undefined,
                      )
                    }
                  />
                  {!collapsed.has(group.id) &&
                    (group.tasks.length > 0
                      ? renderTaskRows(group.tasks, groupDelay)
                      : emptyRow(
                          `${group.id}-empty`,
                          group.kind === "project"
                            ? "No tasks in this project yet."
                            : "No non-project tasks this week.",
                        ))}
                </Fragment>
              );
            });
          })()}
        </tbody>

        <tfoot className={styles.foot}>
          <tr>
            {columns.map((column) => {
              if (column.group === "task") {
                return (
                  <th
                    key={column.key}
                    scope="row"
                    className={`${styles.footCell} ${styles.footTaskCell}`}
                  >
                    Daily total
                  </th>
                );
              }

              if (column.group === "days") {
                const total = dayTotal(entries, rows, column.date!);
                const filled = Math.min(1, total / STANDARD_DAY_HOURS);
                return (
                  <td
                    key={column.key}
                    className={`${styles.footCell} ${styles.dayCell} ${zoneClass(
                      column,
                    )} ${column.isWeekend ? styles.weekendCell : ""} ${
                      column.isToday ? styles.todayCell : ""
                    }`}
                  >
                    <span className={total > 0 ? styles.footValue : styles.footEmpty}>
                      {total > 0 ? formatTotal(total) : "–"}
                    </span>
                    {/* Progress against a standard day, so a short day is
                        visible without reading the number. Hidden when empty —
                        a row of flat bars reads as clutter. */}
                    {total > 0 && (
                      <span className={styles.meter} aria-hidden="true">
                        <span
                          className={`${styles.meterFill} ${
                            total >= STANDARD_DAY_HOURS ? styles.meterFull : ""
                          }`}
                          style={{ transform: `scaleX(${filled})` }}
                        />
                      </span>
                    )}
                  </td>
                );
              }

              if (column.group === "total") {
                const total = dates.reduce(
                  (sum, date) => sum + dayTotal(entries, rows, date),
                  0,
                );
                return (
                  <td
                    key={column.key}
                    className={`${styles.footCell} ${styles.grandTotal} ${zoneClass(
                      column,
                    )}`}
                  >
                    {formatTotal(total)}h
                  </td>
                );
              }

              return (
                <td
                  key={column.key}
                  className={`${styles.footCell} ${zoneClass(column)}`}
                />
              );
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function totalOf(columns: RenderedColumn[]): number {
  return columns.reduce((sum, column) => sum + column.width, 0);
}

interface GroupRowProps {
  colSpan: number;
  group: TaskGroupSection;
  entries: EntryMap;
  dates: Date[];
  isCollapsed: boolean;
  isLocked: boolean;
  delayMs?: number;
  onToggle: () => void;
  onAdd: () => void;
}

/**
 * A group band.
 *
 * Deliberately styled as *content*, not as a second table header: sentence
 * case with an icon tile, versus the uppercase micro-caps used for column
 * headings. When both were uppercase they read as the same kind of thing.
 *
 * The tree rail drawn on each task cell below joins the rows to this band, so
 * the project/task relationship is visible rather than implied by order.
 *
 * Its contents are pinned to the left edge so the group's identity and its add
 * button survive horizontal scrolling.
 */
function GroupRow({
  colSpan,
  group,
  entries,
  dates,
  isCollapsed,
  isLocked,
  delayMs,
  onToggle,
  onAdd,
}: GroupRowProps) {
  const hours = group.tasks.reduce(
    (sum, task) => sum + rowTotal(entries, task.id, dates),
    0,
  );

  return (
    <tr
      className={styles.groupRow}
      style={
        delayMs !== undefined
          ? ({ "--row-delay": `${delayMs}ms` } as React.CSSProperties)
          : undefined
      }
    >
      <td
        colSpan={colSpan}
        className={`${styles.groupCell} ${
          group.kind === "non-project" ? styles.groupCellMuted : ""
        }`}
      >
        <div className={styles.groupRowFlex}>
          {/* Sticky to the scroller's left edge — the group's identity. */}
          <div className={styles.groupBar}>
            <button
              type="button"
              className={styles.collapse}
              onClick={onToggle}
              aria-expanded={!isCollapsed}
            >
              <Icon
                name="expand_more"
                size={18}
                className={`${styles.chevron} ${isCollapsed ? styles.chevronClosed : ""}`}
              />
              <span
                className={`${styles.groupIcon} ${
                  group.kind === "non-project" ? styles.groupIconMuted : ""
                }`}
                aria-hidden="true"
              >
                <Icon name={group.kind === "project" ? "folder" : "inbox"} size={15} />
              </span>
              <span className={styles.groupName}>{group.name}</span>
            </button>

            <span className={styles.groupCount}>{group.tasks.length}</span>

            {hours > 0 && (
              <span className={styles.groupHours}>{formatTotal(hours)}h</span>
            )}
          </div>

          {/* Sticky to the scroller's right edge — the group's action. */}
          {!isLocked && (
            <div className={styles.groupBarEnd}>
              <button type="button" className={styles.addTask} onClick={onAdd}>
                <Icon name="add" size={16} />
                Add task
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
}
