import type {
  ApprovalStatus,
  ColumnGroupDef,
  ColumnGroupKey,
  MainTaskOption,
  TaskRow,
  TaskStatus,
} from "./types";

export const LAYOUT_STORAGE_KEY = "timesheetos:timesheet-columns";

/* ==========================================================================
   Columns
   ========================================================================== */

/* `minWidth` is the floor the grid compresses to on a narrow screen (see
   useFittedColumns) as well as the floor for a manual resize. Together the
   minimums must fit the content area of a 1280px laptop — roughly 930px once
   the sidebar and page padding are taken out — or the grid scrolls
   horizontally on the most common screen we have. */
export const COLUMN_GROUPS: Record<ColumnGroupKey, ColumnGroupDef> = {
  task: {
    key: "task",
    label: "Task",
    align: "left",
    // Pinned: it is the row's identity, and it stays frozen while the day
    // columns scroll horizontally.
    pinned: true,
    minWidth: 180,
    defaultWidth: 300,
  },
  category: {
    key: "category",
    label: "Category",
    align: "left",
    minWidth: 100,
    defaultWidth: 124,
  },
  days: {
    key: "days",
    label: "Days",
    align: "center",
    minWidth: 46,
    defaultWidth: 62,
  },
  total: {
    key: "total",
    label: "Total",
    align: "center",
    minWidth: 64,
    defaultWidth: 78,
  },
  status: {
    key: "status",
    label: "Status",
    align: "left",
    minWidth: 100,
    defaultWidth: 124,
  },
  approval: {
    key: "approval",
    label: "Approval",
    align: "left",
    minWidth: 90,
    defaultWidth: 116,
  },
  actions: {
    key: "actions",
    label: "Actions",
    align: "center",
    minWidth: 52,
    defaultWidth: 60,
  },
};

export const DEFAULT_COLUMN_ORDER: ColumnGroupKey[] = [
  "task",
  "category",
  "days",
  "total",
  "status",
  "approval",
  "actions",
];

/** Day columns are addressed as `day-0` (Monday) … `day-6` (Sunday). */
export const DAY_KEYS = Array.from({ length: 7 }, (_, i) => `day-${i}`);

export const WEEKEND_KEYS = ["day-5", "day-6"];

/* ==========================================================================
   Status presentation
   ========================================================================== */

export const TASK_STATUS_META: Record<
  TaskStatus,
  { label: string; tone: "neutral" | "accent" | "success" }
> = {
  "not-started": { label: "Not started", tone: "neutral" },
  "in-progress": { label: "In progress", tone: "accent" },
  completed: { label: "Completed", tone: "success" },
};

export const APPROVAL_STATUS_META: Record<
  ApprovalStatus,
  { label: string; tone: "neutral" | "accent" | "success" | "danger" } | null
> = {
  none: null,
  pending: { label: "Pending", tone: "neutral" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

/* ==========================================================================
   Mock data
   Replace with the API response once the backend exists — the grid reads
   only `TaskRow[]` and an `EntryMap`.
   ========================================================================== */

export const INITIAL_TASKS: TaskRow[] = [
  {
    id: "t-1",
    name: "Timesheet module — grid rework",
    group: "project",
    projectId: "p-fze",
    projectName: "FZE Project",
    mainTaskId: "development",
    mainTaskLabel: "Development",
    category: "Billable",
    status: "in-progress",
    approval: "none",
    startDate: "2026-08-03",
  },
  {
    id: "t-2",
    name: "Sprint planning & estimation",
    group: "project",
    projectId: "p-fze",
    projectName: "FZE Project",
    mainTaskId: "meetings",
    mainTaskLabel: "Meetings",
    category: "Billable",
    status: "in-progress",
    approval: "none",
    startDate: "2026-08-03",
  },
  {
    id: "t-3",
    name: "Migration scripts review",
    group: "project",
    projectId: "p-atlas",
    projectName: "Atlas Rollout",
    mainTaskId: "code-review",
    mainTaskLabel: "Code Review",
    category: "Billable",
    status: "not-started",
    approval: "none",
    startDate: "2026-08-03",
    endDate: "2026-08-14",
  },
  {
    id: "t-4",
    name: "Annual leave",
    group: "non-project",
    category: "Leave",
    status: "completed",
    approval: "approved",
    startDate: "2026-08-03",
  },
  {
    id: "t-5",
    name: "Team stand-up",
    group: "non-project",
    category: "Non-Billable",
    status: "in-progress",
    approval: "none",
    startDate: "2026-08-03",
  },
];

export const CATEGORIES: TaskRow["category"][] = [
  "Billable",
  "Non-Billable",
  "Leave",
];

/* ==========================================================================
   Main tasks
   The work-breakdown items an employee can log a project task under. Keyed by
   project id; a project without an explicit list falls back to
   DEFAULT_MAIN_TASKS so the Add Task modal always has something to offer.
   ========================================================================== */

export const PROJECT_MAIN_TASKS: Record<string, MainTaskOption[]> = {
  "p-fze": [
    { id: "development", label: "Development" },
    { id: "code-review", label: "Code Review" },
    { id: "testing", label: "Testing" },
    { id: "meetings", label: "Meetings" },
  ],
  "p-atlas": [
    { id: "migration", label: "Migration" },
    { id: "code-review", label: "Code Review" },
    { id: "documentation", label: "Documentation" },
    { id: "meetings", label: "Meetings" },
  ],
};

export const DEFAULT_MAIN_TASKS: MainTaskOption[] = [
  { id: "general", label: "General" },
  { id: "meetings", label: "Meetings" },
];

/**
 * Seed hours for the week on screen, expressed as weekday offsets so the
 * sample data lands on whichever week the user opens first.
 */
export const SEED_HOURS: Record<string, number[]> = {
  //     Mon  Tue  Wed  Thu  Fri  Sat  Sun
  "t-1": [4, 3.5, 5, 0, 0, 0, 0],
  "t-2": [1.5, 1, 0, 0, 0, 0, 0],
  "t-4": [2, 0, 1, 0, 0, 0, 0],
  "t-5": [0.5, 0.5, 0.5, 0, 0, 0, 0],
};
