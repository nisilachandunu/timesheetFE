"use client";

import { useMemo } from "react";
import { PageHeader } from "@/features/dashboard";
import { TRACKER_PAGE } from "../../constants";
import { useToday } from "../../hooks";
import { TrackerBoard } from "./TrackerBoard";
import { TrackerSkeleton } from "./TrackerSkeleton";
import { cn } from "@/lib/cn";

export function TimeTrackerScreen() {
  const todayMs = useToday();
  const today = useMemo(() => new Date(todayMs), [todayMs]);

  return (
    <div
      className={cn(
        "flex flex-col gap-[clamp(14px,2vh,20px)]",
        // Fills the shell's content area so the list below can be capped at the
        // space actually on screen, and scroll inside itself rather than
        // handing a second scrollbar to the page.
        "h-full",
      )}
    >
      {/* Today is resolved after mount — see useToday — so the tracker gets a
          high-fidelity skeleton rather than a blank state on first paint.

          The board renders its own header rather than one being hoisted up
          here, because the header's actions slot carried the idle-detection
          control, whose state only exists once the board has mounted. That
          feature is disabled — see TrackerBoard — but the split is kept so
          restoring it stays a matter of uncommenting. */}
      {todayMs === 0 ? (
        <>
          <PageHeader {...TRACKER_PAGE} />
          <TrackerSkeleton />
        </>
      ) : (
        <TrackerBoard today={today} />
      )}
    </div>
  );
}
