"use client";

import { useMemo } from "react";
import { PageHeader } from "@/features/dashboard";
import { useToday } from "../../hooks";
import { TrackerBoard } from "./TrackerBoard";
import { cn } from "@/lib/cn";

/* Skeleton blocks: a plain tinted rectangle, repeated at several sizes. */
const SKEL = "bg-surface-high";

/** One placeholder entry row, at the density the real rows land at. */
function SkeletonRow({ width }: { width: number }) {
  return (
    <div className="flex items-center h-[52px] px-3.5 gap-3">
      <div className={cn("h-3.5 rounded-[4px]", SKEL)} style={{ width }} />
      <div className="w-[74px] h-3.5 rounded-[4px] ml-1 bg-accent-tint" />
      <div className="flex-1" />
      <div className={cn("w-[86px] h-3 rounded-[4px] max-[1080px]:hidden", SKEL)} />
      <div className={cn("w-[86px] h-3 rounded-[4px] max-[1080px]:hidden", SKEL)} />
      <div className={cn("w-[46px] h-3.5 rounded-[4px]", SKEL)} />
    </div>
  );
}

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
      <PageHeader
        title="Time Tracker"
        description="Run a timer as you work, or fill in the times by hand."
      />

      {todayMs === 0 ? (
        /* Today is resolved after mount — see useToday — so the tracker gets a
           high-fidelity skeleton rather than a blank state on first paint. */
        <div
          className="flex flex-col flex-1 gap-[clamp(14px,2vh,20px)] min-h-0"
          aria-hidden="true"
        >
          <div
            className={cn(
              "flex items-center shrink-0 gap-2 py-2.5 px-3.5 rounded-[14px]",
              "bg-surface-lowest shadow-card",
            )}
          >
            <div className={cn("flex-1 h-4 rounded-[5px]", SKEL)} />
            <div className="w-[70px] h-4 rounded-[5px] bg-accent-tint" />
            <div className={cn("w-8 h-8 rounded-[8px]", SKEL)} />
            <div className={cn("w-8 h-8 rounded-[8px]", SKEL)} />
            <div className={cn("w-[104px] h-5 rounded-[6px]", SKEL)} />
            <div className="w-[92px] h-9 rounded-[9px] bg-accent-tint" />
          </div>

          <div
            className={cn(
              "relative flex flex-col min-h-0 rounded-[14px] overflow-hidden",
              "bg-surface-lowest shadow-card",
              // Holographic shimmer sweeping the whole skeleton.
              "after:content-[''] after:absolute after:inset-0 after:-translate-x-full",
              "after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_25%,rgba(106,57,219,0.08)_50%,rgba(255,255,255,0.05)_75%,transparent_100%)]",
              "after:animate-shimmer-wave motion-reduce:after:animate-none",
              "after:pointer-events-none after:z-[5]",
            )}
          >
            <div className="flex items-center justify-between py-3 px-3.5">
              <div className={cn("w-[80px] h-2.5 rounded-[4px]", SKEL)} />
              <div className={cn("w-[110px] h-4 rounded-[5px]", SKEL)} />
            </div>
            <div className="flex items-center justify-between h-9 px-3.5 bg-surface-low">
              <div className={cn("w-[64px] h-3 rounded-[4px]", SKEL)} />
              <div className={cn("w-[70px] h-3 rounded-[4px]", SKEL)} />
            </div>
            <SkeletonRow width={150} />
            <SkeletonRow width={196} />
            <SkeletonRow width={124} />
            <div className="flex items-center justify-between h-9 px-3.5 bg-surface-low">
              <div className={cn("w-[86px] h-3 rounded-[4px]", SKEL)} />
              <div className={cn("w-[70px] h-3 rounded-[4px]", SKEL)} />
            </div>
            <SkeletonRow width={210} />
            <SkeletonRow width={140} />
          </div>
        </div>
      ) : (
        <TrackerBoard today={today} />
      )}
    </div>
  );
}
