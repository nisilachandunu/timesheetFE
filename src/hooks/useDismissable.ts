"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Surfaces marked with this attribute are treated as a layer floating above
 * whatever is behind them. A pointer landing inside one belongs to that
 * layer alone, so surfaces underneath must not read it as an outside click.
 */
export const POPOVER_LAYER_ATTR = "data-popover-layer";

/** Open surfaces, oldest first, so Escape can peel just the topmost one. */
const openSurfaces: object[] = [];

/**
 * Closes a transient surface (menu, popover, drawer) when the user clicks
 * outside of `ref` or presses Escape.
 *
 * `ref` may be a single element or a list — a list is for surfaces split
 * across two DOM subtrees, e.g. a trigger plus a popover portaled to
 * `document.body` so it can escape a scrollable ancestor; a click landing in
 * either still counts as "inside". Pass a stable array (`useMemo`) so the
 * listeners aren't torn down and re-registered on every render.
 */
export function useDismissable(
  ref: RefObject<HTMLElement | null> | RefObject<HTMLElement | null>[],
  isOpen: boolean,
  onDismiss: () => void,
) {
  // Held in a ref so a caller passing an inline arrow can't re-run the
  // effect every render — that churn would keep re-pushing this surface to
  // the top of `openSurfaces` and break Escape's layer ordering.
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  });

  useEffect(() => {
    if (!isOpen) return;

    const refs = Array.isArray(ref) ? ref : [ref];
    const surface = {};
    openSurfaces.push(surface);

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (refs.some((r) => r.current?.contains(target))) return;

      // A click inside a popover layered above this surface belongs to that
      // layer. Dismissing here would tear down the surface the user is
      // actually working in — e.g. picking a date in a portaled calendar
      // would close the whole modal out from under it.
      const element = target instanceof Element ? target : target.parentElement;
      if (element?.closest(`[${POPOVER_LAYER_ATTR}]`)) return;

      dismissRef.current();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // Escape closes the topmost surface only, so a date picker open over
      // a modal collapses back to the modal rather than dismissing both.
      if (openSurfaces[openSurfaces.length - 1] !== surface) return;
      dismissRef.current();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      const index = openSurfaces.indexOf(surface);
      if (index !== -1) openSurfaces.splice(index, 1);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, isOpen]);
}
