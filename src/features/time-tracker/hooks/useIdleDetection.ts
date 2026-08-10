/* ─────────────────────────────────────────────────────────────────────────
   IDLE DETECTION (disabled)

   Switched off on request. The implementation is preserved verbatim below,
   commented out line by line so an editor can toggle it back in one action.

   To restore: uncomment this file, delete this banner, then grep the repo for
   "IDLE DETECTION (disabled)" and uncomment every block it marks.
   ───────────────────────────────────────────────────────────────────────── */
// "use client";
//
// import { useCallback, useEffect, useRef, useState } from "react";
// import type { IdleWindow } from "../types";
//
// /**
//  * `unsupported` — the browser has no Idle Detection API, so this feature is off.
//  * The rest mirror the `idle-detection` permission.
//  */
// export type IdleAvailability = "unsupported" | "prompt" | "granted" | "denied";
//
// /** The permission's name is not in TypeScript's `PermissionName` union. */
// const PERMISSION = "idle-detection" as PermissionName;
//
// function isSupported(): boolean {
//   return typeof window !== "undefined" && "IdleDetector" in window;
// }
//
// export interface UseIdleDetectionOptions {
//   /** Watch only while this is true — there is nothing to correct when idle. */
//   active: boolean;
//   /**
//    * How long without input counts as away, in milliseconds. The spec's floor is
//    * 60_000; anything lower is rejected by the browser.
//    */
//   thresholdMs: number;
//   /** Called once, on the return to activity, with the window that was missed. */
//   onAway: (window: IdleWindow) => void;
// }
//
// /**
//  * Watches whether the *machine* has gone idle while a timer runs.
//  *
//  * This deliberately uses the Idle Detection API and nothing else. Page-level
//  * `mousemove`/`keydown` listeners only see input that lands on this tab, so an
//  * hour spent working in another application reads as an hour idle — a prompt
//  * offering to delete real work. `IdleDetector` reports the OS-wide idle state
//  * instead, so other applications count as activity and only genuinely leaving
//  * the machine, or locking the screen, counts as away.
//  *
//  * There is deliberately no fallback for browsers without it. A wall-clock gap
//  * check would look like an easy substitute, but a background tab that the
//  * browser freezes produces exactly the same gap as a coffee break, which
//  * reintroduces the false positive this hook exists to avoid. Where the API is
//  * missing, the honest answer is to leave the feature off.
//  */
// export function useIdleDetection({
//   active,
//   thresholdMs,
//   onAway,
// }: UseIdleDetectionOptions) {
//   const [availability, setAvailability] = useState<IdleAvailability>(() =>
//     isSupported() ? "prompt" : "unsupported",
//   );
//
//   /* Held in a ref so a caller passing an inline arrow does not tear the
//      detector down and rebuild it on every render. */
//   const onAwayRef = useRef(onAway);
//   useEffect(() => {
//     onAwayRef.current = onAway;
//   });
//
//   /* Reads the permission without prompting, so the control can show the real
//      state on load — and follows it, since it can be revoked from site settings
//      while the page is open. */
//   useEffect(() => {
//     if (!isSupported()) return;
//
//     const controller = new AbortController();
//     navigator.permissions
//       .query({ name: PERMISSION })
//       .then((status) => {
//         if (controller.signal.aborted) return;
//         setAvailability(status.state);
//         status.addEventListener("change", () => setAvailability(status.state), {
//           signal: controller.signal,
//         });
//       })
//       .catch(() => {
//         // Some Chromium builds reject the query for this name even though the
//         // API is present. Falling back to "prompt" leaves the user a button;
//         // the request itself is the authority either way.
//         if (!controller.signal.aborted) setAvailability("prompt");
//       });
//
//     return () => controller.abort();
//   }, []);
//
//   useEffect(() => {
//     if (!active || availability !== "granted" || !isSupported()) return;
//
//     const controller = new AbortController();
//     const detector = new IdleDetector();
//
//     /* When the away period began, or null while the user is present. Kept in a
//        closure rather than in state: nothing renders from it, and a re-render
//        between the two transitions would lose the start of the window. */
//     let awaySince: number | null = null;
//
//     detector.addEventListener(
//       "change",
//       () => {
//         const now = Date.now();
//         // A locked screen is away immediately; `userState` only turns "idle"
//         // after the threshold, so that transition is backdated to when the
//         // inactivity actually started.
//         const away = detector.userState === "idle" || detector.screenState === "locked";
//
//         if (away) {
//           if (awaySince === null) {
//             awaySince =
//               detector.screenState === "locked" ? now : Math.max(0, now - thresholdMs);
//           }
//           return;
//         }
//
//         if (awaySince === null) return;
//         const from = awaySince;
//         awaySince = null;
//         // A screen locked and unlocked inside the threshold is someone
//         // glancing away, not someone leaving.
//         if (now - from >= thresholdMs) onAwayRef.current({ from, to: now });
//       },
//       { signal: controller.signal },
//     );
//
//     detector.start({ threshold: thresholdMs, signal: controller.signal }).catch(() => {
//       // Aborted by the cleanup below, or the permission was revoked between the
//       // check and the start. Either way there is nothing to watch.
//     });
//
//     return () => controller.abort();
//   }, [active, availability, thresholdMs]);
//
//   /** Must be called from a user gesture — the browser denies it otherwise. */
//   const requestPermission = useCallback(() => {
//     if (!isSupported()) return;
//     IdleDetector.requestPermission()
//       .then(setAvailability)
//       .catch(() => setAvailability("denied"));
//   }, []);
//
//   return { availability, requestPermission };
// }
