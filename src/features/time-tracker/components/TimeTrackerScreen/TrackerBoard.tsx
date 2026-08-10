"use client";

import { useTimeTracker } from "../../hooks";
import { EntryList } from "../EntryList";
import { TimerBar } from "../TimerBar";

export interface TrackerBoardProps {
  /** Local midnight today, for the list's day labels. */
  today: Date;
}

/**
 * The tracker itself, split from the screen so it mounts only once the client
 * has taken over: it seeds from the real clock and restores a running timer
 * from storage, neither of which the server can answer for.
 */
export function TrackerBoard({ today }: TrackerBoardProps) {
  const tracker = useTimeTracker();

  return (
    <>
      <TimerBar
        composer={tracker.composer}
        running={tracker.running}
        mode={tracker.mode}
        onModeChange={tracker.setMode}
        onComposerChange={tracker.setComposer}
        onStart={tracker.start}
        onStop={tracker.stop}
        onDiscard={tracker.discard}
        onAddManual={tracker.addManual}
      />

      <EntryList
        days={tracker.days}
        weekTotal={tracker.weekTotal}
        today={today}
        onChangeEntry={tracker.updateEntry}
        onSetDuration={tracker.setEntryDuration}
        onContinue={tracker.continueEntry}
        onDuplicate={tracker.duplicateEntry}
        onDelete={tracker.removeEntry}
      />
    </>
  );
}
