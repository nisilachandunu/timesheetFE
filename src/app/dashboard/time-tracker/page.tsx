import type { Metadata } from "next";
import { TimeTrackerScreen } from "@/features/time-tracker";

export const metadata: Metadata = {
  title: "Time Tracker - TimesheetOS",
};

export default function TimeTrackerPage() {
  return <TimeTrackerScreen />;
}
