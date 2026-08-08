"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { POPOVER_LAYER_ATTR, useDismissable, usePopoverPosition } from "@/hooks";
import type { MainTaskOption } from "../../types";
import { cn } from "@/lib/cn";

/* Matches TextInput's field chrome (same height, border, radius) so the
   dropdown reads as part of the same form language, not a separate widget. */
const TRIGGER = cn(
  "group flex items-center justify-between gap-2 w-full h-11 px-4",
  "border border-solid border-outline-variant rounded-md",
  "bg-surface-lowest text-body-md text-left",
  "transition-[border-color,box-shadow] duration-fast ease-[ease]",
  "hover:border-outline",
  "aria-expanded:border-primary",
  "aria-expanded:shadow-[0_0_0_3px_var(--color-focus-ring)]",
);

/* Placeholder shares TextInput's ::placeholder colour and weight — no italic,
   so the two "empty field" states in this form read as one language. */
const LABEL_TEXT = "overflow-hidden text-ellipsis whitespace-nowrap text-sm";

export interface MainTaskSelectProps {
  id: string;
  options: MainTaskOption[];
  value: string;
  onChange: (id: string) => void;
}

/**
 * Custom listbox standing in for a native `<select>` — the browser's own
 * option list can't be themed, which is what made the old dropdown feel out
 * of step with the rest of this modal. Styled as a popover to match
 * ColumnsMenu, the other popover surface in this app. Required-field
 * enforcement is left to the caller's `canSubmit` check, same as every
 * other field in this form.
 *
 * The menu is portaled to `document.body` and positioned with `fixed`
 * coordinates rather than living inline under the trigger — the modal panel
 * scrolls its own overflow, and an inline absolutely-positioned menu that
 * spills past the panel's edge would force a scrollbar onto the whole modal
 * just to fit it.
 */
export function MainTaskSelect({ id, options, value, onChange }: MainTaskSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const dismissRefs = useMemo(() => [triggerRef, menuRef], []);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(dismissRefs, isOpen, close);
  const position = usePopoverPosition(triggerRef, menuRef, isOpen);

  const selected = options.find((option) => option.id === value);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={TRIGGER}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span
          className={cn(
            LABEL_TEXT,
            selected ? "text-on-background" : "text-outline",
          )}
        >
          {selected ? selected.label : "Select main task"}
        </span>
        <Icon
          name="expand_more"
          size={19}
          className={cn(
            "shrink-0 text-outline",
            "transition-[color,transform] duration-fast ease-[ease]",
            "group-aria-expanded:text-primary",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            className={cn(
              // Fixed + portaled (see the note above) so this floats above the
              // modal instead of stretching its scroll container to fit.
              "fixed z-[1000] max-h-[240px] overflow-y-auto p-1.5",
              "rounded-[14px] bg-surface-lowest list-none",
              "border border-solid border-hairline-strong shadow-panel",
              "origin-top animate-menu-in-select motion-reduce:animate-none",
            )}
            role="listbox"
            aria-label="Main task"
            tabIndex={-1}
            {...{ [POPOVER_LAYER_ATTR]: "" }}
            /* Rendered before it has been measured so it has a size to
               measure — kept invisible for that one pass, which happens in
               a layout effect and so never reaches the screen. */
            style={
              position
                ? { top: position.top, left: position.left, width: position.triggerWidth }
                : { top: 0, left: 0, visibility: "hidden" }
            }
          >
            {options.map((option) => {
              const isSelected = option.id === value;
              return (
                <li key={option.id} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    className={cn(
                      "flex items-center justify-between gap-2 w-full",
                      "py-[9px] px-2.5 rounded-[9px] text-sm text-left",
                      "text-on-background",
                      "transition-colors duration-[130ms] ease-[ease]",
                      "hover:bg-surface-low",
                      isSelected &&
                        "text-accent-text bg-accent-tint hover:bg-accent-tint",
                    )}
                    onClick={() => {
                      onChange(option.id);
                      close();
                    }}
                  >
                    {option.label}
                    {isSelected && <Icon name="check" size={17} className="shrink-0 text-accent-text" />}
                  </button>
                </li>
              );
            })}
          </ul>,
          document.body,
        )}
    </>
  );
}
