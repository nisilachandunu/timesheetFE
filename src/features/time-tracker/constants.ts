import type { TrackerProject } from "./types";

/** The running timer survives a reload — see `useTimeTracker`. */
export const RUNNING_STORAGE_KEY = "timesheetos:tracker-running";

/* ==========================================================================
   Mock data
   Replace with the API response once the backend exists — the list reads only
   `TimeEntry[]`, and the pickers only `PROJECTS` / `TAGS`.
   ========================================================================== */

export const PROJECTS: TrackerProject[] = [
  { id: "p-acme", name: "ACME", color: "#2f8fd6" },
  { id: "p-atlas", name: "Atlas Rollout", color: "#e0803a" },
  { id: "p-fze", name: "FZE Project", color: "#8b5cf6" },
  { id: "p-office", name: "Office", color: "#d9a13b" },
  { id: "p-break", name: "Break", color: "#0f9b8e" },
];

export const TAGS = ["Billable", "Invoiced", "Overtime", "Internal", "Remote"];

/**
 * Seed entries, positioned relative to the day the page is opened so the
 * sample data always reads as "today" and "yesterday" rather than as whatever
 * date this file was written on.
 *
 * `at` and `until` are minutes from local midnight.
 */
interface SeedEntry {
  /** 0 = today, -1 = yesterday, … */
  dayOffset: number;
  description: string;
  projectId?: string;
  tags?: string[];
  billable?: boolean;
  at: number;
  until: number;
}

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

export const SEED_ENTRIES: SeedEntry[] = [
  {
    dayOffset: 0,
    description: "Illustrations",
    projectId: "p-acme",
    tags: ["Invoiced"],
    billable: true,
    at: h(13),
    until: h(15),
  },
  {
    dayOffset: 0,
    description: "Fixing bug #212",
    projectId: "p-fze",
    billable: true,
    at: h(9, 30),
    until: h(13),
  },
  {
    dayOffset: 0,
    description: "Filing tax return",
    projectId: "p-office",
    tags: ["Overtime"],
    at: h(8),
    until: h(9, 30),
  },
  {
    dayOffset: -1,
    description: "Developing new feature",
    projectId: "p-fze",
    tags: ["Overtime"],
    billable: true,
    at: h(15),
    until: h(18),
  },
  {
    dayOffset: -1,
    description: "Interface design",
    projectId: "p-acme",
    billable: true,
    at: h(13, 30),
    until: h(15),
  },
  {
    dayOffset: -1,
    description: "Lunch",
    projectId: "p-break",
    at: h(13),
    until: h(13, 30),
  },
  {
    dayOffset: -1,
    description: "Client sync",
    projectId: "p-acme",
    tags: ["Remote"],
    billable: true,
    at: h(10),
    until: h(12, 30),
  },
  {
    dayOffset: -2,
    description: "Migration scripts review",
    projectId: "p-atlas",
    billable: true,
    at: h(14),
    until: h(17, 30),
  },
  {
    dayOffset: -2,
    description: "Sprint planning & estimation",
    projectId: "p-fze",
    billable: true,
    at: h(9),
    until: h(11),
  },
  {
    dayOffset: -3,
    description: "Onboarding documentation",
    projectId: "p-atlas",
    tags: ["Internal"],
    at: h(11),
    until: h(13),
  },
  {
    dayOffset: -3,
    description: "Pairing on the grid rework",
    projectId: "p-fze",
    billable: true,
    at: h(14),
    until: h(18),
  },
];
