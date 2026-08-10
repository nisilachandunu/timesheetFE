/* ─────────────────────────────────────────────────────────────────────────
   IDLE DETECTION (disabled)

   Switched off on request. The implementation is preserved verbatim below,
   commented out line by line so an editor can toggle it back in one action.

   To restore: uncomment this file, delete this banner, then grep the repo for
   "IDLE DETECTION (disabled)" and uncomment every block it marks.
   ───────────────────────────────────────────────────────────────────────── */
// "use client";
//
// import { Icon } from "@/components/ui";
// import { IDLE_THRESHOLD_MS } from "../../constants";
// import type { IdleAvailability } from "../../hooks";
// import { formatHumanDuration } from "../../utils";
// import { cn } from "@/lib/cn";
//
// export interface IdleControlProps {
//   availability: IdleAvailability;
//   onRequest: () => void;
// }
//
// const BASE = cn(
//   "inline-flex items-center gap-1.5 h-9 px-3 rounded-[9px]",
//   "text-[0.8125rem] font-semibold whitespace-nowrap",
//   "transition-[background-color,color] duration-fast ease-[ease]",
// );
//
// const AWAY = formatHumanDuration(IDLE_THRESHOLD_MS);
//
// /**
//  * Turns OS-level idle detection on, and reports why it is off when it is.
//  *
//  * A button rather than something armed on load, because the browser only grants
//  * the `idle-detection` permission from a user gesture. The unavailable states
//  * are shown rather than hidden — a feature that silently is not running is worse
//  * than one that says it cannot.
//  */
// export function IdleControl({ availability, onRequest }: IdleControlProps) {
//   if (availability === "granted") {
//     return (
//       <span
//         className={cn(BASE, "text-success-text bg-success-tint")}
//         title={`On. Away for more than ${AWAY} while a timer runs and you will be asked what to do with the time. Revoke from your browser's site settings.`}
//       >
//         <Icon name="visibility" size={17} />
//         <span className="max-[900px]:hidden">Idle detection on</span>
//       </span>
//     );
//   }
//
//   if (availability === "prompt") {
//     return (
//       <button
//         type="button"
//         className={cn(
//           BASE,
//           "text-accent-text bg-accent-tint hover:bg-accent-tint-border",
//         )}
//         onClick={onRequest}
//         title={`Ask the browser for permission to see whether the machine is idle. Away for more than ${AWAY} while a timer runs and you will be asked what to do with the time.`}
//       >
//         <Icon name="visibility" size={17} />
//         <span className="max-[900px]:hidden">Enable idle detection</span>
//       </button>
//     );
//   }
//
//   const reason =
//     availability === "denied"
//       ? "Blocked. Allow idle detection for this site in your browser's settings to turn it back on."
//       : "Unavailable: this needs a Chromium-based browser such as Chrome or Edge. Firefox and Safari do not implement the Idle Detection API.";
//
//   return (
//     <span
//       className={cn(BASE, "text-outline bg-hairline-faint cursor-not-allowed")}
//       title={reason}
//       aria-label={reason}
//     >
//       <Icon name="visibility_off" size={17} />
//       <span className="max-[900px]:hidden">
//         Idle detection {availability === "denied" ? "blocked" : "unavailable"}
//       </span>
//     </span>
//   );
// }
