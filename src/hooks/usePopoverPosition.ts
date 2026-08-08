"use client";

import { useLayoutEffect, useState, type RefObject } from "react";

export interface PopoverPosition {
  top: number;
  left: number;
  /** The trigger's width, for menus sized to match the field they open from. */
  triggerWidth: number;
}

/** Breathing room kept between the popover and the viewport edges. */
const VIEWPORT_MARGIN = 8;
/** Gap between the trigger and the popover it opens. */
const TRIGGER_GAP = 6;

/**
 * Positions a popover that is portaled to `document.body` and laid out with
 * `position: fixed`.
 *
 * Portaling is what lets the popover escape a scrollable ancestor — inside
 * one, an absolutely-positioned popover that overflows forces a scrollbar
 * onto that ancestor instead of floating above it. But escaping the ancestor
 * means escaping its scrolling too: a fixed popover placed past the bottom
 * of the viewport simply cannot be reached. So placement is viewport-aware,
 * flipping above the trigger when below can't fit it.
 *
 * Returns `null` until the popover has been measured. Render it hidden on
 * that first pass — it has to be in the DOM to have a size to measure.
 */
export function usePopoverPosition(
  triggerRef: RefObject<HTMLElement | null>,
  popoverRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
): PopoverPosition | null {
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const update = () => {
      const trigger = triggerRef.current;
      const popover = popoverRef.current;
      if (!trigger || !popover) return;

      const rect = trigger.getBoundingClientRect();
      // offsetHeight rather than scrollHeight: it reflects the height the
      // popover actually renders at, already capped by its own CSS
      // max-height, so the flip decision matches what the user will see.
      const height = popover.offsetHeight;
      const width = popover.offsetWidth;

      const roomBelow = window.innerHeight - rect.bottom - TRIGGER_GAP - VIEWPORT_MARGIN;
      const roomAbove = rect.top - TRIGGER_GAP - VIEWPORT_MARGIN;
      // Flip only when below genuinely cannot fit it and above is roomier,
      // so the ordinary case stays anchored downward as users expect.
      const flip = height > roomBelow && roomAbove > roomBelow;

      const top = flip
        ? Math.max(VIEWPORT_MARGIN, rect.top - TRIGGER_GAP - height)
        : rect.bottom + TRIGGER_GAP;
      const left = Math.max(
        VIEWPORT_MARGIN,
        Math.min(rect.left, window.innerWidth - width - VIEWPORT_MARGIN),
      );

      setPosition((current) =>
        current &&
        current.top === top &&
        current.left === left &&
        current.triggerWidth === rect.width
          ? current
          : { top, left, triggerWidth: rect.width },
      );
    };

    update();

    // Re-measures when the popover's own content changes size — e.g. the
    // date picker swapping between its day grid and its year list.
    const observer = new ResizeObserver(update);
    if (popoverRef.current) observer.observe(popoverRef.current);
    // Capture phase, so scrolling of any ancestor container counts, not
    // just the window.
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen, triggerRef, popoverRef]);

  return isOpen ? position : null;
}
