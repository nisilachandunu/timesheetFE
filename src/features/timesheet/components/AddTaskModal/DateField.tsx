"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { POPOVER_LAYER_ATTR, useDismissable, usePopoverPosition } from "@/hooks";
import { MONTHS, WEEKDAYS, parseISODate, toISODate, weekdayIndex } from "../../utils";
import styles from "./DateField.module.css";

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
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={`${styles.trigger} ${errorText ? styles.triggerError : ""}`}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => (isOpen ? close() : open())}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected
            ? `${selected.getDate()} ${MONTHS[selected.getMonth()]} ${selected.getFullYear()}`
            : "Select date"}
        </span>
        <Icon name="calendar_today" size={17} className={styles.calendarIcon} />
      </button>

      {errorText && (
        <span className={styles.errorText} role="alert">
          {errorText}
        </span>
      )}

      {isOpen &&
        createPortal(
          <div
            ref={popoverRef}
            className={styles.popover}
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
                <div className={styles.calendarHead}>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={() => changeMonth(-1)}
                    aria-label="Previous month"
                  >
                    <Icon name="chevron_left" size={18} />
                  </button>
                  <span className={styles.headLabels}>
                    <button
                      type="button"
                      className={styles.headLabelButton}
                      onClick={() => setPickerMode("month")}
                    >
                      {MONTHS[viewMonth.getMonth()]}
                    </button>
                    <button
                      type="button"
                      className={styles.headLabelButton}
                      onClick={() => setPickerMode("year")}
                    >
                      {viewMonth.getFullYear()}
                    </button>
                  </span>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={() => changeMonth(1)}
                    aria-label="Next month"
                  >
                    <Icon name="chevron_right" size={18} />
                  </button>
                </div>

                <div className={styles.weekdayRow}>
                  {WEEKDAYS.map((day) => (
                    <span key={day} className={styles.weekdayCell}>
                      {day.slice(0, 2)}
                    </span>
                  ))}
                </div>

                <div className={styles.dayGrid}>
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
                        className={[
                          styles.day,
                          inMonth ? "" : styles.dayOutside,
                          isSelected ? styles.daySelected : "",
                          isToday && !isSelected ? styles.dayToday : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
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
                <div className={styles.calendarHead}>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={() => setPickerMode("days")}
                    aria-label="Back to calendar"
                  >
                    <Icon name="arrow_back" size={17} />
                  </button>
                  <span className={styles.monthLabel}>Select month</span>
                  <span className={styles.navButtonSpacer} aria-hidden="true" />
                </div>

                <div className={styles.monthGrid}>
                  {MONTHS.map((month, index) => (
                    <button
                      key={month}
                      type="button"
                      className={`${styles.monthCell} ${
                        index === viewMonth.getMonth() ? styles.monthCellSelected : ""
                      }`}
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
                <div className={styles.calendarHead}>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={() => setPickerMode("days")}
                    aria-label="Back to calendar"
                  >
                    <Icon name="arrow_back" size={17} />
                  </button>
                  <span className={styles.monthLabel}>Select year</span>
                  <span className={styles.navButtonSpacer} aria-hidden="true" />
                </div>

                <div className={styles.yearList} ref={yearListRef}>
                  {years.map((year) => {
                    const isSelected = year === viewMonth.getFullYear();
                    return (
                      <button
                        key={year}
                        ref={isSelected ? selectedYearRef : undefined}
                        type="button"
                        className={`${styles.yearCell} ${isSelected ? styles.yearCellSelected : ""}`}
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
