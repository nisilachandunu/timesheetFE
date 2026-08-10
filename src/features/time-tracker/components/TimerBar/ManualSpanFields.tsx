"use client";

import { useState, type RefObject } from "react";
import { Icon } from "@/components/ui";
import {
  HOUR,
  formatDuration,
  fromTimeInputValue,
  parseDuration,
  toTimeInputValue,
} from "../../utils";
import { cn } from "@/lib/cn";

export interface ManualSpanFieldsProps {
  /** Lets the bar's description field submit on Enter — the times live here. */
  submitRef?: RefObject<HTMLButtonElement | null>;
  onAdd: (span: { start: number; end: number }) => void;
}

/* Native `<input type="time">` so the platform's own clock picker and keypad
   come along for free. */
const TIME_FIELD = cn(
  "w-[104px] h-9 px-2 rounded-[8px] bg-surface-low",
  "text-[0.8125rem] font-semibold tabular-nums text-on-background text-center",
  "transition-[background-color,box-shadow] duration-fast ease-[ease]",
  "hover:bg-surface-container",
  "focus:outline-none focus:shadow-[0_0_0_2px_var(--color-focus-ring)]",
);

/** Rounds down to the minute — a manual span has no business carrying seconds. */
function floorToMinute(ms: number): number {
  return Math.floor(ms / 60000) * 60000;
}

/**
 * The start / end / duration trio, plus the button that files the entry.
 *
 * Mounted only while the composer is in manual mode, which is what anchors the
 * fields to "now": the defaults are a mount-time decision rather than something
 * an effect has to go back and correct, so switching modes twice in an
 * afternoon does not leave this morning's times sitting in the fields.
 *
 * Defaults to the hour just gone, since the common case for typing times in by
 * hand is filing work you have only now remembered to log.
 */
export function ManualSpanFields({ submitRef, onAdd }: ManualSpanFieldsProps) {
  const [start, setStart] = useState(() => floorToMinute(Date.now() - HOUR));
  const [end, setEnd] = useState(() => floorToMinute(Date.now()));
  /* Held as text while it is being typed: "2:" is not a duration yet, and
     reformatting mid-keystroke would fight the user. */
  const [durationDraft, setDurationDraft] = useState<string | null>(null);

  const duration = Math.max(0, end - start);

  /** Returns the end time the draft resolves to, so a submit can use it too. */
  const commitDuration = (): number => {
    if (durationDraft === null) return end;
    const parsed = parseDuration(durationDraft);
    setDurationDraft(null);
    // Unparseable input leaves the span alone — the field simply re-renders
    // from `duration` rather than wiping what was already there.
    if (parsed === null) return end;
    setEnd(start + parsed);
    return start + parsed;
  };

  return (
    <>
      <span className="flex items-center gap-1.5 shrink-0">
        <input
          type="time"
          className={TIME_FIELD}
          aria-label="Start time"
          value={toTimeInputValue(start)}
          onChange={(event) => {
            const parsed = fromTimeInputValue(event.target.value, start);
            if (parsed !== null) setStart(parsed);
          }}
        />
        <span className="text-xs text-outline" aria-hidden="true">
          –
        </span>
        <input
          type="time"
          className={TIME_FIELD}
          aria-label="End time"
          // Anchored to the start's day, so a span running past midnight is
          // resolved by the tracker rather than by this field.
          value={toTimeInputValue(end)}
          onChange={(event) => {
            const parsed = fromTimeInputValue(event.target.value, start);
            if (parsed !== null) setEnd(parsed);
          }}
        />
        <input
          className={cn(
            "w-[68px] h-9 px-2 rounded-[8px] bg-transparent",
            "text-[0.9375rem] font-bold tabular-nums text-on-background text-center",
            "transition-[background-color,box-shadow] duration-fast ease-[ease]",
            "hover:bg-surface-low",
            "focus:outline-none focus:bg-surface-low",
            "focus:shadow-[0_0_0_2px_var(--color-focus-ring)]",
          )}
          aria-label="Duration"
          inputMode="numeric"
          value={durationDraft ?? formatDuration(duration)}
          onChange={(event) => setDurationDraft(event.target.value)}
          onBlur={commitDuration}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commitDuration();
            }
          }}
        />
      </span>

      <button
        ref={submitRef}
        type="button"
        className={cn(
          "inline-flex items-center justify-center gap-1.5 shrink-0",
          "h-9 px-4 rounded-[9px] text-[0.8125rem] font-bold tracking-wider uppercase",
          "bg-primary text-on-primary shadow-md",
          "transition-[background-color,box-shadow,transform] duration-base ease-out-expo",
          "hover:bg-secondary hover:shadow-focus-primary hover:-translate-y-px",
          "active:translate-y-0",
        )}
        onClick={() => onAdd({ start, end: commitDuration() })}
      >
        <Icon name="add" size={17} />
        Add
      </button>
    </>
  );
}
