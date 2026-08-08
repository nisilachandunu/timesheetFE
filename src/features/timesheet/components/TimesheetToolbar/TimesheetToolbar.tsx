"use client";

import type { ReactNode } from "react";
import { Icon } from "@/components/ui";
import { STANDARD_DAY_HOURS, formatTotal, formatWeekRange } from "../../utils";
import styles from "./TimesheetToolbar.module.css";

/** A full working week — the bar under the total measures against this. */
const WEEK_TARGET = STANDARD_DAY_HOURS * 5;

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
    <div className={styles.toolbar}>
      <div className={styles.weekNav}>
        <button
          type="button"
          className={styles.navButton}
          onClick={onPrevious}
          aria-label="Previous week"
        >
          <Icon name="chevron_left" size={20} />
        </button>

        <div className={styles.weekLabel}>
          <span className={styles.weekRange}>{formatWeekRange(weekStart)}</span>
          {isCurrentWeek && <span className={styles.currentChip}>This week</span>}
        </div>

        <button
          type="button"
          className={styles.navButton}
          onClick={onNext}
          aria-label="Next week"
        >
          <Icon name="chevron_right" size={20} />
        </button>

        <button
          type="button"
          className={styles.today}
          onClick={onToday}
          disabled={isCurrentWeek}
        >
          Today
        </button>
      </div>

      <div className={styles.trailing}>
        <div className={styles.totalBlock}>
          <span className={styles.totalLabel}>Logged this week</span>
          <span className={styles.totalRow}>
            <span className={styles.totalValue}>{formatTotal(total)}h</span>
            <span className={styles.totalTarget}>/ {WEEK_TARGET}h</span>
          </span>
          <span className={styles.bar} aria-hidden="true">
            <span
              className={`${styles.barFill} ${total >= WEEK_TARGET ? styles.barFull : ""}`}
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
