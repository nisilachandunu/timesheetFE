"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import { STANDARD_DAY_HOURS, formatTotal, formatWeekRange } from "../../utils";
import { cn } from "@/lib/cn";

/** A full working week — the bar under the total measures against this. */
const WEEK_TARGET = STANDARD_DAY_HOURS * 5;

const NAV_BUTTON = cn(
  "inline-flex items-center justify-center w-9 h-9 shrink-0 rounded-[8px]",
  "text-on-surface-variant",
  // Per-property easings (transform eases differently from the colours), so
  // the shorthand is spelled out rather than split into transition-* utilities.
  "[transition:background-color_var(--duration-fast)_ease,border-color_var(--duration-fast)_ease,color_var(--duration-fast)_ease,transform_var(--duration-fast)_var(--ease-out-expo)]",
  "hover:bg-surface-low hover:border-hairline-strong hover:text-on-background",
  "hover:-translate-y-px active:translate-y-px active:scale-[0.97]",
);

export interface TimesheetToolbarProps {
  weekStart: Date;
  isCurrentWeek: boolean;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  /** Column customisation control, rendered at the trailing edge. */
  children?: ReactNode;
}

export function TimesheetToolbar({
  weekStart,
  isCurrentWeek,
  total,
  onPrevious,
  onNext,
  onToday,
  children,
}: TimesheetToolbarProps) {
  const progress = Math.min(1, total / WEEK_TARGET);

  return (
    <div
      className={cn(
        // A band of the panel, so it keeps its height when the grid is
        // squeezed. The panel owns the border, radius and shadow.
        "flex items-center justify-between flex-wrap shrink-0 gap-3.5",
        "py-[13px] px-3.5 bg-surface-lowest",
        "animate-toolbar-entrance motion-reduce:animate-none",
      )}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        <button
          type="button"
          className={NAV_BUTTON}
          onClick={onPrevious}
          aria-label="Previous week"
        >
          <Icon name="chevron_left" size={20} />
        </button>

        <div
          className={cn(
            "flex items-center gap-[9px] min-w-0 px-1.5",
            "animate-label-slide motion-reduce:animate-none",
          )}
        >
          <span className="text-[0.9375rem] font-bold tracking-[-0.01em] whitespace-nowrap text-on-background">
            {formatWeekRange(weekStart)}
          </span>
          {isCurrentWeek && <span
              className={cn(
                "shrink-0 py-[3px] px-2 rounded-[6px] text-[0.625rem] font-bold",
                "tracking-wider uppercase whitespace-nowrap",
                "text-accent-text bg-accent-tint",
                "animate-chip-pop motion-reduce:animate-none",
              )}
            >
              This week
            </span>}
        </div>

        <button
          type="button"
          className={NAV_BUTTON}
          onClick={onNext}
          aria-label="Next week"
        >
          <Icon name="chevron_right" size={20} />
        </button>

        <button
          type="button"
          className={cn(
            "h-9 px-3 ml-0.5 rounded-[8px] text-[0.8125rem] font-semibold",
            "text-accent-text",
            "transition-[background-color,opacity,transform] duration-fast ease-[ease]",
            "enabled:hover:bg-accent-tint enabled:hover:-translate-y-px",
            "disabled:opacity-0 disabled:pointer-events-none",
          )}
          onClick={onToday}
          disabled={isCurrentWeek}
        >
          Today
        </button>
      </div>

      <div className="flex items-center gap-4 ml-auto max-[720px]:w-full max-[720px]:justify-between">
        <div
          className={cn(
            "flex flex-col gap-0.5 min-w-[132px]",
            "animate-total-slide motion-reduce:animate-none",
          )}
        >
          <span className="text-[0.6875rem] font-bold tracking-[0.08em] uppercase text-on-surface-variant">
            Logged this week
          </span>
          <span className="flex items-baseline gap-1 tabular-nums">
            <span className="text-[1.0625rem] font-bold tracking-[-0.02em] text-on-background">
              {formatTotal(total)}h
            </span>
            <span className="text-xs font-semibold text-outline">/ {WEEK_TARGET}h</span>
          </span>
          <span
            className="block w-full h-1 mt-[3px] rounded-full bg-hairline-strong overflow-hidden"
            aria-hidden="true"
          >
            <span
              className={cn(
                "block w-full h-full rounded-full origin-left",
                "transition-transform duration-[650ms] delay-[180ms]",
                "ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                total >= WEEK_TARGET
                  ? "bg-success-solid shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                  : "bg-primary shadow-[0_0_8px_rgba(106,57,219,0.4)]",
              )}
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
