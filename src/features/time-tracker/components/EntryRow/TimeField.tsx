"use client";

import { useState, type KeyboardEvent } from "react";
import { formatClockTime, fromTimeInputValue, toTimeInputValue } from "../../utils";
import { cn } from "@/lib/cn";

export interface TimeFieldProps {
  label: string;
  /** Epoch milliseconds. */
  value: number;
  onChange: (ms: number) => void;
}

const SHELL = cn(
  "w-[86px] h-7 rounded-[7px] text-[0.8125rem] font-semibold tabular-nums text-center",
  "transition-[background-color,box-shadow] duration-fast ease-[ease]",
);

/**
 * A time of day that reads as text and edits as a control.
 *
 * A row carrying two permanently-visible `<input type="time">` fields is mostly
 * browser chrome — spinners and a picker button, twice over — and the times are
 * read far more often than they are changed. So the resting state is the
 * formatted time, and the native input (with its platform clock picker and
 * keypad) is swapped in on click.
 */
export function TimeField({ label, value, onChange }: TimeFieldProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // Escape is left to bubble on purpose — there is nothing to revert, since
    // each change is already committed — but Enter should hand focus back.
    if (event.key === "Enter") setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        type="button"
        className={cn(
          SHELL,
          "text-on-surface-variant hover:bg-surface-low hover:text-on-background",
        )}
        aria-label={`${label}: ${formatClockTime(value)}`}
        onClick={() => setIsEditing(true)}
      >
        {formatClockTime(value)}
      </button>
    );
  }

  return (
    <input
      type="time"
      // Focused on mount because the click that revealed it landed on the
      // button that has just unmounted.
      autoFocus
      className={cn(
        SHELL,
        "px-1.5 bg-surface-low text-on-background",
        "focus:outline-none focus:shadow-[0_0_0_2px_var(--color-focus-ring)]",
        // The picker button doubles this field's width and repeats an
        // affordance the field itself already is.
        "[&::-webkit-calendar-picker-indicator]:hidden",
      )}
      aria-label={label}
      value={toTimeInputValue(value)}
      onChange={(event) => {
        const parsed = fromTimeInputValue(event.target.value, value);
        if (parsed !== null) onChange(parsed);
      }}
      onBlur={() => setIsEditing(false)}
      onKeyDown={handleKeyDown}
    />
  );
}
