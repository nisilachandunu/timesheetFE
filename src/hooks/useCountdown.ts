"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCountdownResult {
  /** Whole seconds remaining. */
  secondsLeft: number;
  /** Remaining time as m:ss, e.g. "4:07". */
  formatted: string;
  isExpired: boolean;
  /** Restart from `durationSeconds` (or an explicit override). */
  restart: (durationSeconds?: number) => void;
}

function format(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Counts down once per second from `durationSeconds` to zero.
 *
 * Ticks are derived from a wall-clock deadline rather than by decrementing a
 * counter, so the timer stays accurate if the tab is backgrounded and the
 * interval is throttled. The deadline is established on mount (not during
 * render) to keep render pure and the server/client markup identical.
 */
export function useCountdown(durationSeconds: number): UseCountdownResult {
  const deadlineRef = useRef<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);

  useEffect(() => {
    deadlineRef.current = Date.now() + durationSeconds * 1000;

    const tick = () => {
      if (deadlineRef.current === null) return;
      const remaining = Math.max(
        0,
        Math.ceil((deadlineRef.current - Date.now()) / 1000),
      );
      setSecondsLeft(remaining);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [durationSeconds]);

  const restart = useCallback(
    (override?: number) => {
      const next = override ?? durationSeconds;
      deadlineRef.current = Date.now() + next * 1000;
      setSecondsLeft(next);
    },
    [durationSeconds],
  );

  return {
    secondsLeft,
    formatted: format(secondsLeft),
    isExpired: secondsLeft === 0,
    restart,
  };
}
