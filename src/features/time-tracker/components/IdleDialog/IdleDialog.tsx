/* ─────────────────────────────────────────────────────────────────────────
   IDLE DETECTION (disabled)

   Switched off on request. The implementation is preserved verbatim below,
   commented out line by line so an editor can toggle it back in one action.

   To restore: uncomment this file, delete this banner, then grep the repo for
   "IDLE DETECTION (disabled)" and uncomment every block it marks.
   ───────────────────────────────────────────────────────────────────────── */
// "use client";
//
// import { useId, useRef } from "react";
// import { Button, Icon } from "@/components/ui";
// import { useDismissable } from "@/hooks";
// import type { IdleWindow } from "../../types";
// import { formatClockTime, formatHumanDuration } from "../../utils";
// import { cn } from "@/lib/cn";
//
// export interface IdleDialogProps {
//   window: IdleWindow;
//   /** The running timer's description, for naming what kept running. */
//   description: string;
//   /** Leave the idle time in the running entry. */
//   onKeep: () => void;
//   /** Cut the idle time out and carry on timing. */
//   onDiscard: () => void;
//   /** Cut the idle time out and leave the tracker idle. */
//   onDiscardAndStop: () => void;
// }
//
// /**
//  * Raised when the machine has been idle past the threshold while a timer ran.
//  *
//  * Keeping is the safe answer, so it is what a dismissal resolves to — Escape and
//  * a click outside both mean "leave my time alone". Discarding is the primary
//  * button only because it is the common answer, never the default one.
//  */
// export function IdleDialog({
//   window: idle,
//   description,
//   onKeep,
//   onDiscard,
//   onDiscardAndStop,
// }: IdleDialogProps) {
//   const panelRef = useRef<HTMLDivElement>(null);
//   useDismissable(panelRef, true, onKeep);
//
//   const titleId = useId();
//   const bodyId = useId();
//   const away = idle.to - idle.from;
//
//   return (
//     <div
//       className={cn(
//         "fixed inset-0 z-50 flex items-center justify-center p-4",
//         "bg-[rgba(11,8,28,0.5)] backdrop-blur-[3px]",
//         "animate-backdrop-in motion-reduce:animate-none",
//       )}
//       role="presentation"
//     >
//       <div
//         ref={panelRef}
//         className={cn(
//           "w-full max-w-[440px] rounded-[18px] bg-surface-lowest shadow-panel",
//           "origin-center animate-panel-in motion-reduce:animate-none",
//         )}
//         role="alertdialog"
//         aria-modal="true"
//         aria-labelledby={titleId}
//         aria-describedby={bodyId}
//       >
//         <div
//           className={cn(
//             "flex items-start gap-3 pt-[18px] px-5 pb-3.5",
//             "border-b border-solid border-hairline",
//             "max-[480px]:pt-4 max-[480px]:px-4 max-[480px]:pb-3",
//           )}
//         >
//           <span
//             className={cn(
//               "flex items-center justify-center w-10 h-10 shrink-0 rounded-[12px]",
//               "bg-primary",
//               "bg-[linear-gradient(140deg,rgba(255,255,255,0.32)_0%,transparent_62%)]",
//               "text-on-primary shadow-[0_8px_18px_-8px_var(--color-accent-tint-border)]",
//             )}
//             aria-hidden="true"
//           >
//             <Icon name="hourglass_empty" size={22} weight={500} />
//           </span>
//           <div className="flex-1 min-w-0 pt-0.5">
//             <h2
//               id={titleId}
//               className="text-[1.0625rem] font-bold tracking-[-0.015em] text-on-background"
//             >
//               You were away for {formatHumanDuration(away)}
//             </h2>
//             <p
//               id={bodyId}
//               className="mt-[3px] text-[0.8125rem] leading-normal text-on-surface-variant"
//             >
//               {description
//                 ? `The timer for “${description}” kept running.`
//                 : "Your timer kept running."}{" "}
//               Should that time count?
//             </p>
//           </div>
//         </div>
//
//         <div
//           className={cn(
//             "flex flex-col gap-3.5 pt-[18px] px-5 pb-5",
//             "max-[480px]:pt-3.5 max-[480px]:px-4 max-[480px]:pb-4",
//           )}
//         >
//           <div
//             className={cn(
//               "flex items-center justify-between gap-3 py-2.5 px-3.5 rounded-[12px]",
//               "bg-accent-tint-faint",
//             )}
//           >
//             <span className="flex items-center gap-2 min-w-0">
//               <Icon name="schedule" size={17} className="shrink-0 text-accent-text" />
//               <span className="text-[0.8125rem] font-semibold tabular-nums text-on-background">
//                 {formatClockTime(idle.from)} – {formatClockTime(idle.to)}
//               </span>
//             </span>
//             <span className="text-[0.8125rem] font-bold tabular-nums text-accent-text">
//               {formatHumanDuration(away)}
//             </span>
//           </div>
//
//           <p className="text-xs leading-normal text-outline">
//             Discarding files the work up to {formatClockTime(idle.from)} as its own
//             entry, so no timestamp is invented.
//           </p>
//
//           <div
//             className={cn(
//               "flex justify-end gap-2.5 mt-0.5 pt-3.5",
//               "border-t border-solid border-hairline",
//               "max-[520px]:flex-col-reverse max-[520px]:[&>*]:w-full",
//             )}
//           >
//             <Button variant="outline" fullWidth={false} onClick={onKeep}>
//               Keep it
//             </Button>
//             <Button variant="outline" fullWidth={false} onClick={onDiscardAndStop}>
//               <Icon name="stop" size={17} />
//               Discard &amp; stop
//             </Button>
//             <Button variant="primary" fullWidth={false} onClick={onDiscard}>
//               <Icon name="content_cut" size={17} />
//               Discard
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
