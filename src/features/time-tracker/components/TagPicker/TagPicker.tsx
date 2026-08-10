"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { POPOVER_LAYER_ATTR, useDismissable, usePopoverPosition } from "@/hooks";
import { TAGS } from "../../constants";
import { cn } from "@/lib/cn";

export interface TagPickerProps {
  value: string[];
  onChange: (tags: string[]) => void;
  /**
   * `icon` keeps the trigger to a single button with a count — the composer
   * bar is already crowded. `chips` spells the tags out on the trigger itself,
   * which is what a logged row wants: the tags are information there, not a
   * setting to go looking for.
   */
  variant?: "icon" | "chips";
  disabled?: boolean;
}

const CHIP = cn(
  "inline-flex items-center h-[21px] px-[7px] rounded-[6px]",
  "text-[0.6875rem] font-semibold whitespace-nowrap",
  "text-on-surface-variant bg-hairline-faint",
);

/**
 * Multi-select tag menu. Which tags are chosen is rendered on the trigger; the
 * menu itself is the same in both variants.
 */
export function TagPicker({
  value,
  onChange,
  variant = "icon",
  disabled = false,
}: TagPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dismissRefs = useMemo(() => [triggerRef, menuRef], []);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(dismissRefs, isOpen, close);
  const position = usePopoverPosition(triggerRef, menuRef, isOpen);

  const toggle = (tag: string) => {
    // Kept in TAGS order rather than click order, so the same set of tags
    // always renders in the same sequence on every row.
    const next = value.includes(tag)
      ? value.filter((current) => current !== tag)
      : TAGS.filter((current) => current === tag || value.includes(current));
    onChange(next);
  };

  const count = value.length;
  const asChips = variant === "chips" && count > 0;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={cn(
          "relative inline-flex items-center shrink-0 rounded-[8px] text-outline",
          "transition-[background-color,color] duration-fast ease-[ease]",
          "enabled:hover:bg-surface-low enabled:hover:text-on-surface-variant",
          "aria-expanded:bg-accent-tint aria-expanded:text-accent-text",
          "disabled:cursor-not-allowed",
          asChips
            ? "gap-1 h-8 px-1.5 max-w-[190px] overflow-hidden"
            : "justify-center w-8 h-8",
          !asChips && count > 0 && "text-accent-text",
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={count > 0 ? `Tags: ${value.join(", ")}` : "Add tags"}
        title={count > 0 ? value.join(", ") : "Add tags"}
        onClick={() => setIsOpen((open) => !open)}
      >
        {asChips ? (
          value.map((tag) => (
            <span key={tag} className={CHIP}>
              {tag}
            </span>
          ))
        ) : (
          <Icon name="sell" size={17} filled={count > 0} />
        )}
        {/* The count only earns its place on the icon variant — the chips
            already say how many there are. */}
        {variant === "icon" && count > 0 && (
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 flex items-center justify-center",
              "min-w-[15px] h-[15px] px-1 rounded-full",
              "text-[0.5625rem] font-bold leading-none",
              "text-on-primary bg-primary",
            )}
            aria-hidden="true"
          >
            {count}
          </span>
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={cn(
              "fixed z-[1000] w-[212px] max-h-[300px] overflow-y-auto p-1.5",
              "rounded-[14px] bg-surface-lowest",
              "border border-solid border-hairline-strong shadow-panel",
              "origin-top animate-menu-in-select motion-reduce:animate-none",
            )}
            role="listbox"
            aria-multiselectable="true"
            aria-label="Tags"
            tabIndex={-1}
            {...{ [POPOVER_LAYER_ATTR]: "" }}
            style={position ? { top: position.top, left: position.left } : { top: 0, left: 0, visibility: "hidden" }}
          >
            {TAGS.map((tag) => {
              const isSelected = value.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "flex items-center gap-2.5 w-full py-[9px] px-2.5 rounded-[9px]",
                    "text-sm text-left text-on-background",
                    "transition-colors duration-[130ms] ease-[ease] hover:bg-surface-low",
                  )}
                  onClick={() => toggle(tag)}
                >
                  {/* A tick box rather than the Checkbox component: the menu
                      stays keyboard-operable through its own option buttons,
                      and a real input inside one would take the focus. */}
                  <span
                    className={cn(
                      "flex items-center justify-center w-4 h-4 shrink-0 rounded-[5px]",
                      "border border-solid",
                      "transition-[background-color,border-color] duration-[130ms] ease-[ease]",
                      isSelected
                        ? "bg-primary border-primary text-on-primary"
                        : "border-outline-variant",
                    )}
                    aria-hidden="true"
                  >
                    {isSelected && <Icon name="check" size={13} weight={600} />}
                  </span>
                  {tag}
                </button>
              );
            })}

            {count > 0 && (
              <>
                <span className="block h-px my-1 mx-1 bg-hairline" aria-hidden="true" />
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-2 w-full py-2 px-2.5 rounded-[9px]",
                    "text-[0.8125rem] font-semibold text-left text-on-surface-variant",
                    "transition-colors duration-[130ms] ease-[ease] hover:bg-surface-low",
                  )}
                  onClick={() => onChange([])}
                >
                  <Icon name="backspace" size={15} className="shrink-0" />
                  Clear tags
                </button>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
