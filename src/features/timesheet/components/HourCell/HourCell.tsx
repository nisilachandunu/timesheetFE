"use client";

import { useState, type KeyboardEvent } from "react";
import { MAX_HOURS_PER_DAY, formatHours, parseHours } from "../../utils";
import styles from "./HourCell.module.css";

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

  const classes = [
    styles.input,
    weekend ? styles.weekend : "",
    value > 0 ? styles.filled : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <input
      ref={registerRef}
      type="text"
      inputMode="decimal"
      className={classes}
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
