"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { POPOVER_LAYER_ATTR, useDismissable, usePopoverPosition } from "@/hooks";
import { MONTHS, WEEKDAYS, parseISODate, toISODate, weekdayIndex } from "../../utils";
import { cn } from "@/lib/cn";

/* Cells shared by the day, month and year pickers. */
const CELL = cn(
  "flex items-center justify-center rounded-[8px] text-[0.8125rem]",
  "text-on-background",
  "transition-[background-color,color] duration-[130ms] ease-[ease]",
);
const CELL_SELECTED = "text-on-primary bg-primary font-semibold";
const PICKER_GRID = "grid grid-cols-[repeat(3,1fr)] gap-1";

const NAV_BUTTON = cn(
  "inline-flex items-center justify-center w-[26px] h-[26px] rounded-[7px]",
  "text-on-surface-variant",
  "transition-[background-color,color] duration-[130ms] ease-[ease]",
  "hover:bg-surface-low hover:text-on-background",
);

export interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (iso: string) => void;
  required?: boolean;
  /** ISO yyyy-mm-dd — days before this are shown but not selectable. */
  min?: string;
  errorText?: string;
}

type PickerMode = "days" | "month" | "year";

/** The 6x7 grid of dates a month view needs, including the leading and
    trailing days that fill out the first and last weeks. */
function buildMonthGrid(monthStart: Date): Date[] {
  const gridStart = new Date(monthStart);
  gridStart.setDate(gridStart.getDate() - weekdayIndex(monthStart));
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    return d;
  });
}

/** A century-ish span centred on today, wide enough to cover any leave or
    back-dated task without needing to page year-by-year to reach it. */
function buildYearRange(): number[] {
  const thisYear = new Date().getFullYear();
  return Array.from({ length: 111 }, (_, i) => thisYear - 80 + i);
}

/**
 * Custom calendar popover standing in for the native `<input type="date">`
 * picker — the OS calendar it opens can't be themed at all, which is what
 * made it look bolted onto an otherwise polished modal.
 *
 * Portaled to `document.body` and positioned with `fixed` coordinates: the
 * modal panel scrolls its own overflow, and an inline popover spilling past
 * the panel's edge would otherwise force a scrollbar onto the whole modal
 * just to fit it.
 */
export function DateField({ id, label, value, onChange, required, min, errorText }: DateFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState<PickerMode>("days");
  const selected = value ? parseISODate(value) : null;
  const [viewMonth, setViewMonth] = useState(() => {
    const base = selected ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const yearListRef = useRef<HTMLDivElement>(null);
  const selectedYearRef = useRef<HTMLButtonElement>(null);
  const dismissRefs = useMemo(() => [triggerRef, popoverRef], []);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(dismissRefs, isOpen, close);
  const position = usePopoverPosition(triggerRef, popoverRef, isOpen);

  const open = () => {
    const base = selected ?? new Date();
    setViewMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    setPickerMode("days");
    setIsOpen(true);
  };

  useEffect(() => {
    if (pickerMode !== "year") return;
    const list = yearListRef.current;
    const item = selectedYearRef.current;
    if (!list || !item) return;
    // Set scrollTop directly rather than calling scrollIntoView, which walks
    // up and scrolls every scrollable ancestor — including the modal panel
    // behind this popover, dragging the field out from under it.
    list.scrollTop = item.offsetTop - list.clientHeight / 2 + item.offsetHeight / 2;
  }, [pickerMode]);

  const minDate = min ? parseISODate(min) : null;
  const today = toISODate(new Date());
  const grid = buildMonthGrid(viewMonth);
  const years = useMemo(() => buildYearRange(), []);

  const changeMonth = (delta: number) => {
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  return (
    <div className="flex flex-col gap-1 min-w-0">
      <label className="text-label-sm font-semibold text-on-surface-variant" htmlFor={id}>
        {label}
        {required && <span className="ml-[3px] text-error">*</span>}
      </label>

      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={cn(
          // Matches TextInput's field chrome.
          "group flex items-center justify-between gap-2 w-full",
          "py-[clamp(9px,1.7vh,12px)] px-4",
          "border border-solid border-outline-variant rounded-md",
          "bg-surface-lowest text-body-md text-left",
          "transition-[border-color,box-shadow] duration-fast ease-[ease]",
          "hover:border-outline",
          "aria-expanded:outline-none aria-expanded:border-primary",
          "aria-expanded:shadow-[0_0_0_3px_var(--color-focus-ring)]",
          errorText && "border-error",
        )}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : open())}
      >
        <span className={selected ? "text-on-background" : "text-outline"}>
          {selected
            ? `${selected.getDate()} ${MONTHS[selected.getMonth()]} ${selected.getFullYear()}`
            : "Select date"}
        </span>
        <Icon name="calendar_today" size={17} className={cn(
            "shrink-0 text-outline transition-colors duration-fast ease-[ease]",
            "group-aria-expanded:text-primary",
          )} />
      </button>

      {errorText && (
        <span className="text-label-sm text-error" role="alert">
          {errorText}
        </span>
      )}

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className={cn(
              // Fixed + portaled (see below) so this floats above the modal
              // instead of stretching its scroll container to fit.
              "fixed z-[1000] w-[268px] overflow-y-auto p-3",
              // Last-resort cap for very short viewports; usePopoverPosition
              // flips the popover above the trigger when it will not fit below.
              "max-h-[90vh]",
              "rounded-[14px] bg-surface-lowest",
              "border border-solid border-hairline-strong shadow-panel",
              "origin-top-left animate-popover-in motion-reduce:animate-none",
            )}
            role="dialog"
            aria-label={`${label} calendar`}
            {...{ [POPOVER_LAYER_ATTR]: "" }}
            /* Rendered before it has been measured so it has a size to
               measure — kept invisible for that one pass, which happens in
               a layout effect and so never reaches the screen. */
            style={
              position
                ? { top: position.top, left: position.left }
                : { top: 0, left: 0, visibility: "hidden" }
            }
          >
            {pickerMode === "days" && (
              <>
                <div className="flex items-center justify-between mb-2.5">
                  <button
                    type="button"
                    className={NAV_BUTTON}
                    onClick={() => changeMonth(-1)}
                    aria-label="Previous month"
                  >
                    <Icon name="chevron_left" size={18} />
                  </button>
                  <span className="flex items-center gap-1">
                    <button
                      type="button"
                      className={cn(
                "py-[3px] px-[7px] rounded-[6px] text-[0.8125rem] font-bold",
                "text-on-background transition-colors duration-[130ms] ease-[ease]",
                "hover:bg-surface-low",
              )}
                      onClick={() => setPickerMode("month")}
                    >
                      {MONTHS[viewMonth.getMonth()]}
                    </button>
                    <button
                      type="button"
                      className={cn(
                "py-[3px] px-[7px] rounded-[6px] text-[0.8125rem] font-bold",
                "text-on-background transition-colors duration-[130ms] ease-[ease]",
                "hover:bg-surface-low",
              )}
                      onClick={() => setPickerMode("year")}
                    >
                      {viewMonth.getFullYear()}
                    </button>
                  </span>
                  <button
                    type="button"
                    className={NAV_BUTTON}
                    onClick={() => changeMonth(1)}
                    aria-label="Next month"
                  >
                    <Icon name="chevron_right" size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-[repeat(7,1fr)] mb-1">
                  {WEEKDAYS.map((day) => (
                    <span key={day} className="flex items-center justify-center h-[26px] text-[0.6875rem] font-semibold text-outline">
                      {day.slice(0, 2)}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-[repeat(7,1fr)] gap-0.5">
                  {grid.map((date) => {
                    const iso = toISODate(date);
                    const inMonth = date.getMonth() === viewMonth.getMonth();
                    const isSelected = iso === value;
                    const isToday = iso === today;
                    const isDisabled = minDate ? date < minDate : false;

                    return (
                      <button
                        key={iso}
                        type="button"
                        className={cn(
                          CELL,
                          "h-[30px]",
                          "enabled:hover:bg-surface-low",
                          "disabled:text-outline disabled:opacity-40",
                          "disabled:cursor-default",
                          !inMonth && "text-outline",
                          isToday && !isSelected && "font-bold text-accent-text",
                          isSelected &&
                            "text-on-primary bg-primary font-semibold enabled:hover:bg-primary",
                        )}
                        disabled={isDisabled}
                        onClick={() => {
                          onChange(iso);
                          close();
                        }}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {pickerMode === "month" && (
              <>
                <div className="flex items-center justify-between mb-2.5">
                  <button
                    type="button"
                    className={NAV_BUTTON}
                    onClick={() => setPickerMode("days")}
                    aria-label="Back to calendar"
                  >
                    <Icon name="arrow_back" size={17} />
                  </button>
                  <span className="text-[0.8125rem] font-bold text-on-background">Select month</span>
                  <span className="w-[26px] h-[26px]" aria-hidden="true" />
                </div>

                <div className={PICKER_GRID}>
                  {MONTHS.map((month, index) => (
                    <button
                      key={month}
                      type="button"
                      className={cn(
                        CELL,
                        "h-9 hover:bg-surface-low",
                        index === viewMonth.getMonth() &&
                          cn(CELL_SELECTED, "hover:bg-primary"),
                      )}
                      onClick={() => {
                        setViewMonth(new Date(viewMonth.getFullYear(), index, 1));
                        setPickerMode("days");
                      }}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </>
            )}

            {pickerMode === "year" && (
              <>
                <div className="flex items-center justify-between mb-2.5">
                  <button
                    type="button"
                    className={NAV_BUTTON}
                    onClick={() => setPickerMode("days")}
                    aria-label="Back to calendar"
                  >
                    <Icon name="arrow_back" size={17} />
                  </button>
                  <span className="text-[0.8125rem] font-bold text-on-background">Select year</span>
                  <span className="w-[26px] h-[26px]" aria-hidden="true" />
                </div>

                <div className={cn(
                PICKER_GRID,
                // Positioned so each year button's offsetTop is measured
                // against this list, which the centre-on-open scroll assumes.
                "relative max-h-[216px] overflow-y-auto",
              )} ref={yearListRef}>
                  {years.map((year) => {
                    const isSelected = year === viewMonth.getFullYear();
                    return (
                      <button
                        key={year}
                        ref={isSelected ? selectedYearRef : undefined}
                        type="button"
                        className={cn(
                          CELL,
                          "h-9 hover:bg-surface-low",
                          isSelected && cn(CELL_SELECTED, "hover:bg-primary"),
                        )}
                        onClick={() => {
                          setViewMonth(new Date(year, viewMonth.getMonth(), 1));
                          setPickerMode("days");
                        }}
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
