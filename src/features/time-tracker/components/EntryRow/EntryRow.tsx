"use client";

import { useState } from "react";
import { Icon } from "@/components/ui";
import type { TimeEntry } from "../../types";
import { entryDuration, formatDuration, parseDuration } from "../../utils";
import { BillableToggle } from "../BillableToggle";
import { EntryMenu } from "../EntryMenu";
import { ProjectPicker } from "../ProjectPicker";
import { TagPicker } from "../TagPicker";
import { TimeField } from "./TimeField";
import { cn } from "@/lib/cn";

export interface EntryRowProps {
  entry: TimeEntry;
  /** Whether this entry's task (its description + project) is starred. */
  isFavourite: boolean;
  onChange: (patch: Partial<Omit<TimeEntry, "id">>) => void;
  onSetDuration: (ms: number) => void;
  onContinue: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleFavourite: () => void;
}

/**
 * One logged span. Every field is edited in place — a tracker's entries are
 * corrected constantly ("that was actually the other project", "I forgot to
 * stop it"), and sending each of those through a dialog would be the slowest
 * possible path to a one-word change.
 */
export function EntryRow({
  entry,
  isFavourite,
  onChange,
  onSetDuration,
  onContinue,
  onDuplicate,
  onDelete,
  onToggleFavourite,
}: EntryRowProps) {
  /* The duration field is held as text while it is being typed: "2:" is not a
     duration yet, and reformatting mid-keystroke would fight the user. */
  const [durationDraft, setDurationDraft] = useState<string | null>(null);
  const duration = entryDuration(entry);

  const commitDuration = () => {
    if (durationDraft === null) return;
    const parsed = parseDuration(durationDraft);
    if (parsed !== null) onSetDuration(parsed);
    setDurationDraft(null);
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-1.5 min-h-[52px] py-1.5 px-3.5",
        "transition-colors duration-fast ease-[ease] hover:bg-surface-low",
        "animate-row-reveal motion-reduce:animate-none",
      )}
    >
      <div className="flex items-center flex-1 min-w-0 gap-1.5 max-[560px]:flex-wrap">
        <input
          className={cn(
            "min-w-0 flex-1 h-8 px-1.5 rounded-[7px] bg-transparent",
            "text-[0.875rem] text-on-background",
            "transition-[background-color,box-shadow] duration-fast ease-[ease]",
            "placeholder:text-outline",
            "hover:bg-surface-container",
            "focus:outline-none focus:bg-surface-container",
            "focus:shadow-[0_0_0_2px_var(--color-focus-ring)]",
          )}
          placeholder="Add description"
          maxLength={160}
          aria-label="Description"
          value={entry.description}
          onChange={(event) => onChange({ description: event.target.value })}
        />
        <ProjectPicker
          compact
          value={entry.projectId}
          onChange={(projectId) => onChange({ projectId })}
        />
      </div>

      <div className="flex items-center shrink-0 max-[720px]:hidden">
        <TagPicker
          variant="chips"
          value={entry.tags}
          onChange={(tags) => onChange({ tags })}
        />
      </div>

      <BillableToggle
        value={entry.billable}
        onChange={(billable) => onChange({ billable })}
      />

      {/* The span is the first thing to go on a narrow screen: the duration
          beside it carries the same information in a third of the width. */}
      <div className="flex items-center gap-0.5 shrink-0 max-[1080px]:hidden">
        <TimeField
          label="Start time"
          value={entry.start}
          onChange={(start) => onChange({ start })}
        />
        <span className="text-xs text-outline" aria-hidden="true">
          –
        </span>
        <TimeField
          label="End time"
          value={entry.end}
          onChange={(end) => onChange({ end })}
        />
      </div>

      <input
        className={cn(
          "w-[62px] h-8 shrink-0 px-1 rounded-[7px] bg-transparent",
          "text-[0.875rem] font-bold tabular-nums text-on-background text-center",
          "transition-[background-color,box-shadow] duration-fast ease-[ease]",
          "hover:bg-surface-container",
          "focus:outline-none focus:bg-surface-container",
          "focus:shadow-[0_0_0_2px_var(--color-focus-ring)]",
        )}
        inputMode="numeric"
        aria-label="Duration"
        value={durationDraft ?? formatDuration(duration)}
        onChange={(event) => setDurationDraft(event.target.value)}
        onBlur={commitDuration}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commitDuration();
            event.currentTarget.blur();
          }
        }}
      />

      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 shrink-0",
          "rounded-[8px]",
          "transition-[background-color,color] duration-fast ease-[ease]",
          "hover:bg-accent-tint",
          isFavourite
            ? "text-accent-text opacity-100"
            : "text-outline opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-accent-text",
        )}
        disabled={!entry.description.trim()}
        onClick={onToggleFavourite}
        aria-pressed={isFavourite}
        aria-label={
          isFavourite
            ? `Remove ${entry.description || "this entry"} from favourites`
            : `Add ${entry.description || "this entry"} to favourites`
        }
        title={isFavourite ? "Unstar" : "Star"}
      >
        <Icon name="star" size={18} filled={isFavourite} />
      </button>

      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 shrink-0",
          "rounded-[8px] text-outline",
          "transition-[background-color,color] duration-fast ease-[ease]",
          "hover:bg-accent-tint hover:text-accent-text",
        )}
        onClick={onContinue}
        aria-label={`Start a new timer for ${entry.description || "this entry"}`}
        title="Continue"
      >
        <Icon name="play_arrow" size={19} />
      </button>

      <EntryMenu onDuplicate={onDuplicate} onDelete={onDelete} />
    </div>
  );
}
