"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { POPOVER_LAYER_ATTR, useDismissable, usePopoverPosition } from "@/hooks";
import { cn } from "@/lib/cn";

export interface EntryMenuProps {
  onDuplicate: () => void;
  onDelete: () => void;
}

const ITEM = cn(
  "flex items-center gap-2.5 w-full py-[9px] px-2.5 rounded-[9px]",
  "text-sm text-left text-on-background",
  "transition-colors duration-[130ms] ease-[ease] hover:bg-surface-low",
);

/** The row's overflow menu: the actions that are not worth a column each. */
export function EntryMenu({ onDuplicate, onDelete }: EntryMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dismissRefs = useMemo(() => [triggerRef, menuRef], []);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(dismissRefs, isOpen, close);
  const position = usePopoverPosition(triggerRef, menuRef, isOpen);

  const run = (action: () => void) => {
    action();
    close();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 shrink-0",
          "rounded-[8px] text-outline",
          "transition-[background-color,color] duration-fast ease-[ease]",
          "hover:bg-surface-low hover:text-on-background",
          "aria-expanded:bg-surface-low aria-expanded:text-on-background",
        )}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Entry actions"
        onClick={() => setIsOpen((open) => !open)}
      >
        <Icon name="more_vert" size={19} />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={cn(
              "fixed z-[1000] w-[184px] p-1.5",
              "rounded-[14px] bg-surface-lowest",
              "border border-solid border-hairline-strong shadow-panel",
              "origin-top animate-menu-in-columns motion-reduce:animate-none",
            )}
            role="menu"
            tabIndex={-1}
            {...{ [POPOVER_LAYER_ATTR]: "" }}
            style={position ? { top: position.top, left: position.left } : { top: 0, left: 0, visibility: "hidden" }}
          >
            <button type="button" role="menuitem" className={ITEM} onClick={() => run(onDuplicate)}>
              <Icon name="content_copy" size={16} className="shrink-0 text-outline" />
              Duplicate
            </button>
            <button
              type="button"
              role="menuitem"
              className={cn(ITEM, "text-error")}
              onClick={() => run(onDelete)}
            >
              <Icon name="delete" size={16} className="shrink-0" />
              Delete
            </button>
          </div>,
          document.body,
        )}
    </>
  );
}
