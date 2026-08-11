"use client";

import { Icon } from "@/components/ui";
import type { DayGroup, TimeEntry } from "../../types";
import { formatDayLabel, formatDuration, taskKey } from "../../utils";
import { EntryRow } from "../EntryRow";
import { cn } from "@/lib/cn";

export interface EntryListProps {
  days: DayGroup[];
  /** Logged since Monday, in milliseconds. */
  weekTotal: number;
  /** Today, for the "Today" / "Yesterday" group labels. */
  today: Date;
  /** Starred task keys — see `taskKey`. */
  favourites: Set<string>;
  onChangeEntry: (id: string, patch: Partial<Omit<TimeEntry, "id">>) => void;
  onSetDuration: (id: string, ms: number) => void;
  onContinue: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFavourite: (key: string) => void;
}

const BAND_LABEL = "text-[0.6875rem] font-bold tracking-[0.08em] uppercase";

/**
 * Everything logged, newest first, bucketed into days.
 *
 * Panel, week band, day headings and rows are bands of one container rather
 * than a stack of cards — as separate cards the same content read as a dozen
 * unrelated widgets, which is the mistake the timesheet grid already learned
 * from.
 */
export function EntryList({
  days,
  weekTotal,
  today,
  favourites,
  onChangeEntry,
  onSetDuration,
  onContinue,
  onDuplicate,
  onDelete,
  onToggleFavourite,
}: EntryListProps) {
  return (
    <div
      className={cn(
        // flex-1 + min-h-0: takes the height the screen has left and scrolls
        // its rows inside itself, rather than growing the page.
        "flex flex-col flex-1 min-h-0 rounded-[14px] overflow-hidden",
        "bg-surface-lowest shadow-card",
        "animate-panel-entrance motion-reduce:animate-none",
      )}
    >
      <div className="flex items-center justify-between shrink-0 gap-3 py-3 px-3.5">
        <span className={cn(BAND_LABEL, "text-on-surface-variant")}>This week</span>
        <span className="flex items-baseline gap-2">
          <span className={cn(BAND_LABEL, "text-outline")}>Week total</span>
          <span className="text-[1.0625rem] font-bold tracking-[-0.02em] tabular-nums text-on-background">
            {formatDuration(weekTotal)}
          </span>
        </span>
      </div>

      {days.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 px-6 text-center">
          <Icon name="timer" size={30} className="text-outline-variant" />
          <p className="text-[0.9375rem] font-semibold text-on-background">
            Nothing logged yet
          </p>
          <p className="max-w-[320px] text-[0.8125rem] leading-normal text-on-surface-variant">
            Describe what you are working on and press Start — the entry lands
            here the moment you stop the timer.
          </p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          {days.map((group) => (
            <section key={group.key}>
              {/* Sticky: in a list that runs back over a fortnight, "which day
                  am I looking at" is the one thing that must not scroll away. */}
              <header
                className={cn(
                  "sticky top-0 z-10 flex items-center justify-between gap-3",
                  "py-2 px-3.5 bg-surface-low",
                )}
              >
                <span className="text-[0.8125rem] font-bold tracking-[-0.01em] text-on-background">
                  {formatDayLabel(group.date, today)}
                </span>
                <span className="flex items-baseline gap-1.5">
                  <span className={cn(BAND_LABEL, "text-outline")}>Total</span>
                  <span className="text-[0.875rem] font-bold tabular-nums text-on-background">
                    {formatDuration(group.total)}
                  </span>
                </span>
              </header>

              <div className="divide-y divide-solid divide-hairline-faint">
                {group.entries.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    isFavourite={favourites.has(taskKey(entry.description, entry.projectId))}
                    onChange={(patch) => onChangeEntry(entry.id, patch)}
                    onSetDuration={(ms) => onSetDuration(entry.id, ms)}
                    onContinue={() => onContinue(entry.id)}
                    onDuplicate={() => onDuplicate(entry.id)}
                    onDelete={() => onDelete(entry.id)}
                    onToggleFavourite={() =>
                      onToggleFavourite(taskKey(entry.description, entry.projectId))
                    }
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
