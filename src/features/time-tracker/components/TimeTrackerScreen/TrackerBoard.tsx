"use client";

import { PageHeader } from "@/features/dashboard";
import { TRACKER_PAGE } from "../../constants";
import { useTimeTracker } from "../../hooks";
import { EntryList } from "../EntryList";
import { FavouritesBar } from "../FavouritesBar";
import { TimerBar } from "../TimerBar";

// IDLE DETECTION (disabled) — see ../../hooks/useIdleDetection.ts
// import { useState } from "react";
// import { IDLE_THRESHOLD_MS } from "../../constants";
// import { useIdleDetection } from "../../hooks";
// import type { IdleWindow } from "../../types";
// import { IdleControl } from "../IdleControl";
// import { IdleDialog } from "../IdleDialog";

export interface TrackerBoardProps {
  /** Local midnight today, for the list's day labels. */
  today: Date;
}

/**
 * The tracker itself, split from the screen so it mounts only once the client
 * has taken over: it seeds from the real clock and restores a running timer from
 * storage, neither of which the server can answer for.
 *
 * Renders the page header too. That is here rather than in the screen because
 * the header's actions slot carried the idle-detection control, which needed
 * state that only exists once this has mounted — kept that way so restoring the
 * feature stays a matter of uncommenting.
 */
export function TrackerBoard({ today }: TrackerBoardProps) {
  const tracker = useTimeTracker();

  // IDLE DETECTION (disabled) — see ../../hooks/useIdleDetection.ts
  //
  // /* Tagged with the timer it belongs to. Without that, stopping the timer
  //    while the dialog is up and later starting a new one would re-raise this
  //    same stale window against work it has nothing to do with. */
  // const [pendingIdle, setPendingIdle] = useState<
  //   { window: IdleWindow; startedAt: number } | null
  // >(null);
  //
  // const idle = useIdleDetection({
  //   active: tracker.running !== null,
  //   thresholdMs: IDLE_THRESHOLD_MS,
  //   onAway: (window) => {
  //     if (!tracker.running) return;
  //     setPendingIdle({ window, startedAt: tracker.running.startedAt });
  //   },
  // });
  //
  // const resolve = (action?: (window: IdleWindow) => void) => {
  //   if (pendingIdle && action) action(pendingIdle.window);
  //   setPendingIdle(null);
  // };
  //
  // const isStale =
  //   !pendingIdle ||
  //   !tracker.running ||
  //   tracker.running.startedAt !== pendingIdle.startedAt;
  //
  // const idleControl = (
  //   <IdleControl
  //     availability={idle.availability}
  //     onRequest={idle.requestPermission}
  //   />
  // );
  //
  // const idleDialog =
  //   pendingIdle && !isStale && tracker.running ? (
  //     <IdleDialog
  //       window={pendingIdle.window}
  //       description={tracker.running.description}
  //       onKeep={() => resolve()}
  //       onDiscard={() => resolve((w) => tracker.splitRunning(w.from, w.to))}
  //       onDiscardAndStop={() => resolve((w) => tracker.splitRunning(w.from, null))}
  //     />
  //   ) : null;

  return (
    <>
      <PageHeader
        {...TRACKER_PAGE}
        /* IDLE DETECTION (disabled) */
        /* actions={idleControl} */
      />

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

      <FavouritesBar
        tasks={tracker.favouriteTasks}
        onStart={tracker.startTask}
        onToggleFavourite={tracker.toggleFavourite}
      />

      <EntryList
        days={tracker.days}
        weekTotal={tracker.weekTotal}
        today={today}
        favourites={tracker.favourites}
        onChangeEntry={tracker.updateEntry}
        onSetDuration={tracker.setEntryDuration}
        onContinue={tracker.continueEntry}
        onDuplicate={tracker.duplicateEntry}
        onDelete={tracker.removeEntry}
        onToggleFavourite={tracker.toggleFavourite}
      />

      {/* IDLE DETECTION (disabled) */}
      {/* {idleDialog} */}
    </>
  );
}
