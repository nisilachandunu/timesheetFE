/** Where a task sits in the grid's two top-level sections. */
export type TaskGroup = "project" | "non-project";

export type TaskStatus = "not-started" | "in-progress" | "completed";

/** "none" is an unsubmitted row — shown as an em dash rather than a chip. */
export type ApprovalStatus = "none" | "pending" | "approved" | "rejected";

/** Lifecycle of the week as a whole, driven by Save / Complete. */
export type SheetStatus = "draft" | "submitted" | "approved";

export type Category = "Billable" | "Non-Billable" | "Leave";

/** A work-breakdown item a project task is logged under, e.g. "Development". */
export interface MainTaskOption {
  id: string;
  label: string;
}

export interface TaskRow {
  id: string;
  name: string;
  group: TaskGroup;
  /** Project grouping. Absent for non-project tasks. */
  projectId?: string;
  projectName?: string;
  /** Set only for project tasks — non-project work has no work-breakdown item. */
  mainTaskId?: string;
  mainTaskLabel?: string;
  category: Category;
  status: TaskStatus;
  approval: ApprovalStatus;
  /** ISO yyyy-mm-dd. The window the task is assigned for. */
  startDate?: string;
  /** ISO yyyy-mm-dd. Open-ended when absent. */
  endDate?: string;
}

/**
 * Hours keyed by `${taskId}|${yyyy-mm-dd}`. Keying by date rather than by
 * weekday index means navigating between weeks needs no remapping.
 */
export type EntryMap = Record<string, number>;

/* ==========================================================================
   Column model

   Columns are ordered as *groups* rather than as a flat list: the seven day
   columns move and hide as one block, which keeps them in chronological
   order no matter how the user rearranges everything else.
   ========================================================================== */

export type ColumnGroupKey =
  | "task"
  | "category"
  | "days"
  | "total"
  | "status"
  | "approval"
  | "actions";

export type ColumnAlign = "left" | "center" | "right";

export interface ColumnGroupDef {
  key: ColumnGroupKey;
  label: string;
  align: ColumnAlign;
  /** Pinned columns can be neither hidden nor moved (the task column). */
  pinned?: boolean;
  minWidth: number;
  defaultWidth: number;
}

/** A single rendered column — the day block expands into seven of these. */
export interface RenderedColumn {
  /** Unique per column: a group key, or `day-0`…`day-6`. */
  key: string;
  group: ColumnGroupKey;
  label: string;
  align: ColumnAlign;
  width: number;
  minWidth: number;
  /** Set only for day columns. */
  date?: Date;
  isWeekend?: boolean;
  isToday?: boolean;
}

export interface ColumnLayout {
  order: ColumnGroupKey[];
  /** Group keys and/or individual day keys (`day-5`, `day-6`). */
  hidden: string[];
  /** Keyed by group — every day column shares the `days` width. */
  widths: Record<string, number>;
}
