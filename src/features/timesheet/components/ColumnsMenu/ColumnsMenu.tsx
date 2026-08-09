"use client";

import { useCallback, useRef, useState } from "react";
import { Icon } from "@/components/ui";
import { useDismissable } from "@/hooks";
import { COLUMN_GROUPS, DAY_KEYS, WEEKEND_KEYS } from "../../constants";
import type { ColumnGroupKey, ColumnLayout } from "../../types";
import { formatWeekday } from "../../utils";
import { cn } from "@/lib/cn";

const CHECKBOX =
  "w-[15px] h-[15px] shrink-0 accent-primary cursor-pointer disabled:cursor-default";

/* Up/down read as left/right once the list is understood as column order —
   the aria-labels say left/right so assistive tech is unambiguous. */
const MOVE = cn(
  "inline-flex items-center justify-center w-6 h-6 rounded-[6px]",
  "text-on-surface-variant",
  "transition-[background-color,color] duration-[140ms] ease-[ease]",
  "enabled:hover:bg-accent-tint enabled:hover:text-accent-text",
  "disabled:opacity-30 disabled:cursor-default",
);

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
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-[7px] h-9 px-3 rounded-[8px]",
          "text-[0.8125rem] font-semibold text-on-surface-variant",
          "bg-surface-lowest",
          "transition-[background-color,border-color,color] duration-fast ease-[ease]",
          "hover:text-on-background hover:border-hairline-strong hover:bg-surface-low",
          isOpen &&
            "text-on-background border-hairline-strong bg-surface-low",
        )}
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Icon name="view_column" size={18} />
        Columns
        {hiddenCount > 0 && <span
            className={cn(
              "inline-flex items-center justify-center min-w-[17px] h-[17px]",
              "px-[5px] rounded-[5px] text-[0.625rem] font-bold",
              "text-on-primary bg-primary",
            )}
          >
            {hiddenCount}
          </span>}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute top-[calc(100%+8px)] right-0 z-40 w-[288px] p-3",
            "rounded-[14px] bg-surface-lowest",
            "shadow-panel",
            "origin-top-right animate-menu-in-columns",
          )}
          role="dialog"
          aria-label="Customise columns"
        >
          <div className="flex items-center justify-between gap-2.5">
            <span className="text-[0.8125rem] font-bold text-on-background">Columns</span>
            <button
              type="button"
              className={cn(
                "text-xs font-semibold text-accent-text rounded-sm",
                "disabled:text-outline disabled:cursor-default",
              )}
              onClick={onReset}
              disabled={!isCustomised}
            >
              Reset
            </button>
          </div>

          <p className="my-1.5 mb-2.5 text-[0.6875rem] leading-[1.45] text-on-surface-variant">
            Drag a column header to reorder, or drag its edge to resize.
          </p>

          <ul className="flex flex-col gap-px list-none">
            {layout.order.map((key) => {
              const def = COLUMN_GROUPS[key];
              const isHidden = hidden.has(key);
              const movableIndex = movable.indexOf(key);

              return (
                <li key={key} className="flex flex-col">
                  <div
                    className={cn(
                      "flex items-center gap-2 rounded-[8px] py-0.5 pr-0.5 pl-1.5",
                      "transition-colors duration-[140ms] ease-[ease]",
                      "hover:bg-surface-low",
                    )}
                  >
                    <label className="flex items-center gap-[9px] flex-1 min-w-0 py-[5px] text-[0.8125rem] cursor-pointer">
                      <input
                        type="checkbox"
                        className={CHECKBOX}
                        checked={!isHidden}
                        disabled={def.pinned}
                        onChange={() => onToggleColumn(key)}
                      />
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap text-on-background">
                        {key === "days" ? "Day columns" : def.label}
                      </span>
                      {def.pinned && <span className="shrink-0 text-[0.625rem] font-semibold tracking-wider uppercase text-outline">
                          Pinned
                        </span>}
                    </label>

                    {!def.pinned && (
                      <span className="inline-flex shrink-0">
                        <button
                          type="button"
                          className={MOVE}
                          onClick={() => onMoveColumn(key, -1)}
                          disabled={movableIndex <= 0}
                          aria-label={`Move ${def.label} left`}
                        >
                          <Icon name="keyboard_arrow_up" size={17} />
                        </button>
                        <button
                          type="button"
                          className={MOVE}
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
                    <div
                      className={cn(
                        "flex flex-wrap gap-y-1 gap-x-3 my-0.5 mb-1.5 py-2 px-2.5",
                        "rounded-[9px] bg-surface-low",
                      )}
                    >
                      {dates.map((date, index) => {
                        const dayKey = `day-${index}`;
                        return (
                          <label key={dayKey} className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant cursor-pointer">
                            <input
                              type="checkbox"
                              className={CHECKBOX}
                              checked={!hidden.has(dayKey)}
                              onChange={() => onToggleColumn(dayKey)}
                            />
                            {formatWeekday(date)}
                          </label>
                        );
                      })}
                      <button
                        type="button"
                        className="basis-full mt-0.5 text-left text-[0.6875rem] font-semibold text-accent-text"
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
