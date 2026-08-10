/* ─────────────────────────────────────────────────────────────────────────
   IDLE DETECTION (disabled)

   Switched off on request. The implementation is preserved verbatim below,
   commented out line by line so an editor can toggle it back in one action.

   To restore: uncomment this file, delete this banner, then grep the repo for
   "IDLE DETECTION (disabled)" and uncomment every block it marks.
   ───────────────────────────────────────────────────────────────────────── */
// /**
//  * Ambient types for the Idle Detection API.
//  *
//  * Not in TypeScript's DOM library: the spec is a Chromium incubation that
//  * Firefox and WebKit both declined to implement, so it never reached the
//  * baseline `lib.dom.d.ts` ships. Declared here rather than reached through
//  * `any` casts, so the call sites still get checked.
//  *
//  * Every consumer must go through `useIdleDetection`, which is what actually
//  * feature-detects it — the declaration below is a promise about the shape of
//  * the API, not about its presence.
//  *
//  * @see https://wicg.github.io/idle-detection/
//  */
//
// /** `null` until the detector has been started and has read the OS state. */
// type UserIdleState = "active" | "idle" | null;
// type ScreenIdleState = "locked" | "unlocked" | null;
//
// interface IdleDetectorEventMap {
//   change: Event;
// }
//
// interface IdleDetector extends EventTarget {
//   /** OS-wide: "idle" means no input to *any* application, not just this page. */
//   readonly userState: UserIdleState;
//   readonly screenState: ScreenIdleState;
//   onchange: ((this: IdleDetector, event: Event) => unknown) | null;
//
//   /**
//    * Begins watching. Rejects if the `idle-detection` permission has not been
//    * granted, and with an `AbortError` once `signal` is aborted.
//    *
//    * `threshold` is in milliseconds and the spec's minimum is 60_000.
//    */
//   start(options?: { threshold?: number; signal?: AbortSignal }): Promise<void>;
//
//   addEventListener<K extends keyof IdleDetectorEventMap>(
//     type: K,
//     listener: (this: IdleDetector, event: IdleDetectorEventMap[K]) => unknown,
//     options?: boolean | AddEventListenerOptions,
//   ): void;
//   addEventListener(
//     type: string,
//     listener: EventListenerOrEventListenerObject,
//     options?: boolean | AddEventListenerOptions,
//   ): void;
//   removeEventListener<K extends keyof IdleDetectorEventMap>(
//     type: K,
//     listener: (this: IdleDetector, event: IdleDetectorEventMap[K]) => unknown,
//     options?: boolean | EventListenerOptions,
//   ): void;
//   removeEventListener(
//     type: string,
//     listener: EventListenerOrEventListenerObject,
//     options?: boolean | EventListenerOptions,
//   ): void;
// }
//
// declare const IdleDetector: {
//   prototype: IdleDetector;
//   new (): IdleDetector;
//   /** Must be called from a user gesture, or it resolves to "denied". */
//   requestPermission(): Promise<PermissionState>;
// };
