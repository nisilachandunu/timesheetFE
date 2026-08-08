"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { POPOVER_LAYER_ATTR, useDismissable, usePopoverPosition } from "@/hooks";
import type { MainTaskOption } from "../../types";
import styles from "./MainTaskSelect.module.css";

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
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : "Select main task"}
        </span>
        <Icon
          name="expand_more"
          size={19}
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <ul
            ref={menuRef}
            className={styles.menu}
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
                    className={`${styles.option} ${isSelected ? styles.optionSelected : ""}`}
                    onClick={() => {
                      onChange(option.id);
                      close();
                    }}
                  >
                    {option.label}
                    {isSelected && <Icon name="check" size={17} className={styles.checkIcon} />}
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
