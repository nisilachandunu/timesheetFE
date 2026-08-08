import type { Metadata } from "next";
import { PageHeader } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Holiday Calendar - TimesheetOS",
};

export default function HolidayCalendarPage() {
  return <PageHeader title="Holiday Calendar" />;
}
