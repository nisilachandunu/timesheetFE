import type { NavLink, UserProfile } from "./types";

/**
 * One accent per workspace section, used by both the sidebar nav and the
 * page header so a section reads the same colour wherever it appears.
 */
export const SECTION_ACCENTS = {
  timesheet: { accent: "#6d5ae8", accentSoft: "rgba(109, 90, 232, 0.14)" },
  tracker: { accent: "#0f8fd6", accentSoft: "rgba(15, 143, 214, 0.15)" },
  holiday: { accent: "#0f9b8e", accentSoft: "rgba(15, 155, 142, 0.15)" },
  settings: { accent: "#8b5cf6", accentSoft: "rgba(139, 92, 246, 0.15)" },
} as const;

export const NAV_LINKS: NavLink[] = [
  {
    href: "/dashboard/timesheet",
    label: "Timesheet",
    icon: "schedule",
    ...SECTION_ACCENTS.timesheet,
  },
  {
    href: "/dashboard/time-tracker",
    label: "Time Tracker",
    icon: "timer",
    ...SECTION_ACCENTS.tracker,
  },
  {
    href: "/dashboard/holiday-calendar",
    label: "Holiday Calendar",
    icon: "calendar_month",
    ...SECTION_ACCENTS.holiday,
  },
];

export const SETTINGS_LINK: NavLink = {
  href: "/dashboard/settings",
  label: "Settings",
  icon: "settings",
  ...SECTION_ACCENTS.settings,
};

/**
 * Placeholder until authentication is wired to a backend — replace with the
 * signed-in user from the session.
 */
export const CURRENT_USER: UserProfile = {
  name: "Nisila Bambarenda",
  email: "nisila.bambarenda@innovative-e.com",
  designation: "Associate Software Engineer",
  role: "Employee",
};
