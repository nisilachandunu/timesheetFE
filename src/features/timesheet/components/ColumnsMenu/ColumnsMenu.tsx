"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { useDismissable } from "@/hooks";
import { COLUMN_GROUPS, DAY_KEYS, WEEKEND_KEYS } from "../../constants";
import type { ColumnGroupKey, ColumnLayout } from "../../types";
import { formatWeekday } from "../../utils";
import styles from "./ColumnsMenu.module.css";

export interface ColumnsMenuProps {
  layout: ColumnLayout;
  dates: Date[];
  isCustomised: boolean;
  onToggleColumn: (key: string) => void;
  onMoveColumn: (key: ColumnGroupKey, direction: -1 | 1) => void;
  onReset: () => void;
}

/**
 * Column customisation popover: visibility, order and a reset.
 *
 * Reordering is offered as move up/down buttons rather than drag-only, so the
 * feature is reachable by keyboard — dragging the header is the shortcut, not
 * the only route.
 */
export function ColumnsMenu({
  layout,
  dates,
  isCustomised,
  onToggleColumn,
  onMoveColumn,
  onReset,
}: ColumnsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(rootRef, isOpen, close);

  const hidden = new Set(layout.hidden);
  const daysHidden = hidden.has("days");
  // Individual days only count while the block itself is visible, otherwise
  // hiding the block would inflate the badge by seven.
  const hiddenCount =
    layout.order.filter((key) => hidden.has(key)).length +
    (daysHidden ? 0 : DAY_KEYS.filter((key) => hidden.has(key)).length);

  const movable = layout.order.filter((key) => !COLUMN_GROUPS[key].pinned);
  const weekendsHidden = WEEKEND_KEYS.every((key) => hidden.has(key));

  /* Toggling each key blindly would flip a half-hidden weekend into the
     other half-hidden state, so drive both keys to the same target. */
  const toggleWeekends = () => {
    WEEKEND_KEYS.forEach((key) => {
      if (hidden.has(key) === weekendsHidden) onToggleColumn(key);
    });
  };

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ""}`}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Icon name="view_column" size={18} />
        Columns
        {hiddenCount > 0 && <span className={styles.badge}>{hiddenCount}</span>}
      </button>

      {isOpen && (
        <div className={styles.menu} role="dialog" aria-label="Customise columns">
          <div className={styles.menuHead}>
            <span className={styles.menuTitle}>Columns</span>
            <button
              type="button"
              className={styles.reset}
              onClick={onReset}
              disabled={!isCustomised}
            >
              Reset
            </button>
          </div>

          <p className={styles.hint}>
            Drag a column header to reorder, or drag its edge to resize.
          </p>

          <ul className={styles.list}>
            {layout.order.map((key) => {
              const def = COLUMN_GROUPS[key];
              const isHidden = hidden.has(key);
              const movableIndex = movable.indexOf(key);

              return (
                <li key={key} className={styles.group}>
                  <div className={styles.row}>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        checked={!isHidden}
                        disabled={def.pinned}
                        onChange={() => onToggleColumn(key)}
                      />
                      <span className={styles.name}>
                        {key === "days" ? "Day columns" : def.label}
                      </span>
                      {def.pinned && <span className={styles.pinned}>Pinned</span>}
                    </label>

                    {!def.pinned && (
                      <span className={styles.moves}>
                        <button
                          type="button"
                          className={styles.move}
                          onClick={() => onMoveColumn(key, -1)}
                          disabled={movableIndex <= 0}
                          aria-label={`Move ${def.label} left`}
                        >
                          <Icon name="keyboard_arrow_up" size={17} />
                        </button>
                        <button
                          type="button"
                          className={styles.move}
                          onClick={() => onMoveColumn(key, 1)}
                          disabled={movableIndex === movable.length - 1}
                          aria-label={`Move ${def.label} right`}
                        >
                          <Icon name="keyboard_arrow_down" size={17} />
                        </button>
                      </span>
                    )}
                  </div>

                  {/* Individual days nest under the block they belong to. */}
                  {key === "days" && !isHidden && (
                    <div className={styles.days}>
                      {dates.map((date, index) => {
                        const dayKey = `day-${index}`;
                        return (
                          <label key={dayKey} className={styles.day}>
                            <input
                              type="checkbox"
                              className={styles.checkbox}
                              checked={!hidden.has(dayKey)}
                              onChange={() => onToggleColumn(dayKey)}
                            />
                            {formatWeekday(date)}
                          </label>
                        );
                      })}
                      <button
                        type="button"
                        className={styles.quick}
                        onClick={toggleWeekends}
                      >
                        {weekendsHidden ? "Show weekends" : "Hide weekends"}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
