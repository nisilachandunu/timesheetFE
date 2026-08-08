"use client";

import { useState, type KeyboardEvent } from "react";
import { MAX_HOURS_PER_DAY, formatHours, parseHours } from "../../utils";
import { cn } from "@/lib/cn";

export interface HourCellProps {
  value: number;
  disabled?: boolean;
  /** Names the cell for screen readers: task name plus the full date. */
  label: string;
  /** De-emphasised styling for Saturday and Sunday. */
  weekend?: boolean;
  onChange: (hours: number) => void;
  /** Arrow/Enter navigation, delegated to the grid which owns the ref map. */
  onNavigate?: (rowDelta: number, dayDelta: number) => void;
  registerRef?: (node: HTMLInputElement | null) => void;
}

/**
 * A single day's hours.
 *
 * The raw text is held locally while focused so partial input ("7.", ".5")
 * survives keystrokes, but every valid change is committed immediately so the
 * row, day and week totals stay live as the user types.
 */
export function HourCell({
  value,
  disabled = false,
  label,
  weekend = false,
  onChange,
  onNavigate,
  registerRef,
}: HourCellProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const handleChange = (raw: string) => {
    const parsed = parseHours(raw);
    // Reject the keystroke outright rather than writing NaN into state.
    if (parsed === null) return;
    // parseHours clamps the committed value at 24h, but without this the
    // field would keep echoing whatever was typed ("99") even though the row
    // total already reflects the capped value — the box would be lying.
    setDraft(parsed === MAX_HOURS_PER_DAY ? formatHours(parsed) : raw);
    onChange(parsed);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!onNavigate) return;

    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        onNavigate(-1, 0);
        break;
      case "ArrowDown":
      case "Enter":
        event.preventDefault();
        onNavigate(1, 0);
        break;
      case "ArrowLeft":
        // Only leave the cell when the caret is already at its start.
        if (event.currentTarget.selectionStart === 0) {
          event.preventDefault();
          onNavigate(0, -1);
        }
        break;
      case "ArrowRight":
        if (event.currentTarget.selectionStart === event.currentTarget.value.length) {
          event.preventDefault();
          onNavigate(0, 1);
        }
        break;
      case "Escape":
        event.currentTarget.blur();
        break;
      default:
        break;
    }
  };

  return (
    <input
      ref={registerRef}
      type="text"
      inputMode="decimal"
      className={cn(
        // Bare by default: a filled cell is signalled by the number itself,
        // not by a box around it. Tinting every entered cell turned the grid
        // into a wall of boxes and buried the values.
        "w-full h-9 px-1 text-center text-sm font-semibold tabular-nums",
        "tracking-[-0.01em] text-on-background bg-transparent rounded-[8px]",
        "border border-solid border-transparent",
        "transition-[background-color,border-color,box-shadow] duration-[130ms] ease-[ease]",
        // Empty cells recede so the eye lands only on days with hours.
        "placeholder:text-outline placeholder:font-normal placeholder:opacity-40",
        "enabled:hover:border-hairline-strong",
        "focus:outline-none focus:bg-surface-lowest focus:border-primary",
        "focus:shadow-[0_0_0_3px_var(--color-focus-ring)]",
        "disabled:cursor-default disabled:text-on-surface-variant",
        "disabled:bg-transparent disabled:border-transparent",
        value > 0 && "text-on-background",
        // Weekend hours are real but rarely the point, so they sit a step
        // back. Listed after `filled` because the original rule order let
        // .weekend win over .filled for a weekend cell that has hours.
        weekend && "text-on-surface-variant font-medium",
      )}
      value={draft ?? formatHours(value)}
      placeholder="–"
      aria-label={label}
      disabled={disabled}
      onChange={(event) => handleChange(event.target.value)}
      // Selecting on focus makes overwriting a value a single keystroke.
      onFocus={(event) => event.currentTarget.select()}
      onBlur={() => setDraft(null)}
      onKeyDown={handleKeyDown}
    />
  );
}
