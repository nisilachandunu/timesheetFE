import type { Metadata } from "next";
import { TimesheetScreen } from "@/features/timesheet";

export const metadata: Metadata = {
  title: "Timesheet - TimesheetOS",
};

export default function TimesheetPage() {
  return <TimesheetScreen />;
}
