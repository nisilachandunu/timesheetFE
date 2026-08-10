"use client";

import { useId, useRef, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui";
import { useTicker } from "../../hooks";
import type { EntryDraft, RunningEntry, TrackerMode } from "../../types";
import { formatStopwatch } from "../../utils";
import { BillableToggle } from "../BillableToggle";
import { ProjectPicker } from "../ProjectPicker";
import { TagPicker } from "../TagPicker";
import { ManualSpanFields } from "./ManualSpanFields";
import { cn } from "@/lib/cn";

export interface TimerBarProps {
  /** The draft being composed — the running timer's own fields once one runs. */
  composer: EntryDraft;
  running: RunningEntry | null;
  mode: TrackerMode;
  onModeChange: (mode: TrackerMode) => void;
  onComposerChange: (patch: Partial<EntryDraft>) => void;
  onStart: () => void;
  onStop: () => void;
  onDiscard: () => void;
  onAddManual: (span: { start: number; end: number }) => void;
}

/* Borderless field: the bar itself is the input's chrome, so a second box
   drawn inside it would only add weight. */
const DESCRIPTION_FIELD = cn(
  "flex-1 min-w-[160px] h-9 px-1 bg-transparent",
  "text-body-md text-on-background",
  "placeholder:text-outline focus:outline-none",
);

const ACTION_BUTTON = cn(
  "inline-flex items-center justify-center gap-1.5 shrink-0",
  "h-9 px-4 rounded-[9px] text-[0.8125rem] font-bold tracking-wider uppercase",
  "shadow-md",
  "transition-[background-color,box-shadow,transform] duration-base ease-out-expo",
  "hover:-translate-y-px active:translate-y-0",
);

const MODE_BUTTON = cn(
  "inline-flex items-center justify-center w-8 h-8 rounded-[7px] text-outline",
  "transition-[background-color,color] duration-fast ease-[ease]",
  "hover:text-on-surface-variant",
  "aria-pressed:text-accent-text aria-pressed:bg-accent-tint",
);

/**
 * The composer at the top of the tracker: what you are working on, which project
 * it belongs to, and either a running stopwatch or a start/end pair typed in by
 * hand.
 *
 * The per-second re-render lives here rather than in the screen, so a ticking
 * timer never re-renders the entry list behind it.
 */
export function TimerBar({
  composer,
  running,
  mode,
  onModeChange,
  onComposerChange,
  onStart,
  onStop,
  onDiscard,
  onAddManual,
}: TimerBarProps) {
  const descriptionId = useId();
  const now = useTicker(running !== null);
  const elapsed = running ? Math.max(0, now - running.startedAt) : 0;

  /* Manual mode's own submit lives inside ManualSpanFields, which owns the
     times; Enter in the description has to reach it from out here. */
  const manualSubmitRef = useRef<HTMLButtonElement>(null);

  const handleDescriptionKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (mode === "manual") manualSubmitRef.current?.click();
    else if (running) onStop();
    else onStart();
  };

  return (
    <div
      className={cn(
        "flex items-center shrink-0 gap-2 py-2.5 px-3.5 rounded-[14px]",
        "bg-surface-lowest shadow-card",
        "animate-toolbar-entrance motion-reduce:animate-none",
        // Below this the bar can no longer hold one line, so it stacks: the
        // description takes the first row and the controls the second.
        "max-[900px]:flex-wrap",
        // A live timer gets a violet rim, so the running state is legible from
        // the shape of the bar and not only from the digits.
        running &&
          "shadow-[0_0_0_1px_var(--color-accent-tint-border),0_8px_24px_-12px_var(--color-accent-tint-border)]",
      )}
    >
      <label className="sr-only" htmlFor={descriptionId}>
        What are you working on?
      </label>
      <input
        id={descriptionId}
        className={DESCRIPTION_FIELD}
        placeholder="What are you working on?"
        maxLength={160}
        value={composer.description}
        onChange={(event) => onComposerChange({ description: event.target.value })}
        onKeyDown={handleDescriptionKeyDown}
      />

      <ProjectPicker
        value={composer.projectId}
        onChange={(projectId) => onComposerChange({ projectId })}
      />

      <span className="flex items-center gap-0.5 shrink-0">
        <TagPicker value={composer.tags} onChange={(tags) => onComposerChange({ tags })} />
        <BillableToggle
          value={composer.billable}
          onChange={(billable) => onComposerChange({ billable })}
        />
      </span>

      {mode === "manual" ? (
        <ManualSpanFields submitRef={manualSubmitRef} onAdd={onAddManual} />
      ) : (
        <>
          <span
            className={cn(
              "min-w-[104px] shrink-0 px-1 text-center",
              "text-[1.1875rem] font-bold tracking-[-0.01em] tabular-nums",
              running ? "text-on-background" : "text-outline",
            )}
            /* Not a live region: a value that re-announces every second would
               make the page unusable with a screen reader on. */
            role={running ? "timer" : undefined}
            aria-live="off"
          >
            {formatStopwatch(elapsed)}
          </span>

          <button
            type="button"
            className={cn(
              ACTION_BUTTON,
              running
                ? "bg-error text-on-error hover:shadow-[0_4px_20px_var(--color-error-ring)]"
                : "bg-primary text-on-primary hover:bg-secondary hover:shadow-focus-primary",
            )}
            onClick={() => (running ? onStop() : onStart())}
          >
            <Icon name={running ? "stop" : "play_arrow"} size={18} filled />
            {running ? "Stop" : "Start"}
          </button>

          {running && (
            <button
              type="button"
              className={cn(
                "inline-flex items-center justify-center w-8 h-8 shrink-0",
                "rounded-[8px] text-outline",
                "transition-[background-color,color] duration-fast ease-[ease]",
                "hover:bg-surface-low hover:text-error",
              )}
              onClick={onDiscard}
              aria-label="Discard running timer"
              title="Discard without logging"
            >
              <Icon name="delete" size={18} />
            </button>
          )}
        </>
      )}

      {/* Mode switch, set apart from the composer's own controls — it changes
          how time is entered rather than what is being entered. Hidden while a
          timer runs: switching to manual would leave it running out of sight. */}
      {!running && (
        <span
          className="flex items-center gap-0.5 shrink-0 p-0.5 ml-0.5 rounded-[9px] bg-surface-low"
          role="group"
          aria-label="Entry mode"
        >
          <button
            type="button"
            className={MODE_BUTTON}
            aria-pressed={mode === "timer"}
            aria-label="Timer mode"
            title="Timer"
            onClick={() => onModeChange("timer")}
          >
            <Icon name="timer" size={18} filled={mode === "timer"} />
          </button>
          <button
            type="button"
            className={MODE_BUTTON}
            aria-pressed={mode === "manual"}
            aria-label="Manual mode"
            title="Enter times manually"
            onClick={() => onModeChange("manual")}
          >
            <Icon name="more_time" size={18} filled={mode === "manual"} />
          </button>
        </span>
      )}
    </div>
  );
}
