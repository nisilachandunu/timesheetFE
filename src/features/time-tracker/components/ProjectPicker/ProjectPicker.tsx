"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui";
import { POPOVER_LAYER_ATTR, useDismissable, usePopoverPosition } from "@/hooks";
import { PROJECTS } from "../../constants";
import { cn } from "@/lib/cn";

export interface ProjectPickerProps {
  /** Currently booked project, or undefined for unassigned work. */
  value?: string;
  onChange: (projectId: string | undefined) => void;
  /** Row variant: quieter, sized to sit inline with an entry's description. */
  compact?: boolean;
  disabled?: boolean;
}

/** Lets the caller show a project's colour without owning the project list. */
export function findProject(projectId?: string) {
  return projectId ? PROJECTS.find((project) => project.id === projectId) : undefined;
}

/**
 * Project selector for the composer bar and for each logged row. A popover
 * listbox rather than a native `<select>`, matching MainTaskSelect — and each
 * option carries its project's colour, which is the thing the eye actually
 * scans the list by.
 */
export function ProjectPicker({
  value,
  onChange,
  compact = false,
  disabled = false,
}: ProjectPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dismissRefs = useMemo(() => [triggerRef, menuRef], []);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(dismissRefs, isOpen, close);
  const position = usePopoverPosition(triggerRef, menuRef, isOpen);

  const selected = findProject(value);

  const pick = (projectId: string | undefined) => {
    onChange(projectId);
    close();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={cn(
          "group inline-flex items-center gap-1.5 max-w-full shrink-0 rounded-[8px]",
          "font-semibold whitespace-nowrap",
          "transition-[background-color,color] duration-fast ease-[ease]",
          "enabled:hover:bg-accent-tint disabled:cursor-not-allowed",
          compact ? "h-6 px-1.5 text-xs -ml-1.5" : "h-9 px-2.5 text-[0.8125rem]",
          selected ? "text-[var(--project-color)]" : "text-accent-text",
          !selected && !compact && "aria-expanded:bg-accent-tint",
        )}
        style={selected ? { ["--project-color" as string]: selected.color } : undefined}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={selected ? `Project: ${selected.name}` : "Add a project"}
        onClick={() => setIsOpen((open) => !open)}
      >
        {selected ? (
          <>
            <span
              className="w-[7px] h-[7px] shrink-0 rounded-full bg-current"
              aria-hidden="true"
            />
            <span className="overflow-hidden text-ellipsis">{selected.name}</span>
          </>
        ) : (
          <>
            <Icon name="add_circle" size={compact ? 14 : 17} />
            <span className={compact ? "text-outline" : undefined}>Project</span>
          </>
        )}
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            className={cn(
              // Fixed + portaled so the menu floats clear of the entry list's
              // own scroll container instead of stretching it.
              "fixed z-[1000] w-[236px] max-h-[300px] overflow-y-auto p-1.5",
              "rounded-[14px] bg-surface-lowest",
              "border border-solid border-hairline-strong shadow-panel",
              "origin-top animate-menu-in-select motion-reduce:animate-none",
            )}
            role="listbox"
            aria-label="Project"
            tabIndex={-1}
            {...{ [POPOVER_LAYER_ATTR]: "" }}
            /* Rendered before it has been measured so it has a size to
               measure — hidden for that one pass, which happens in a layout
               effect and so never reaches the screen. */
            style={position ? { top: position.top, left: position.left } : { top: 0, left: 0, visibility: "hidden" }}
          >
            <button
              type="button"
              role="option"
              aria-selected={!value}
              className={cn(
                "flex items-center gap-2.5 w-full py-[9px] px-2.5 rounded-[9px]",
                "text-sm text-left text-on-surface-variant",
                "transition-colors duration-[130ms] ease-[ease] hover:bg-surface-low",
                !value && "text-accent-text bg-accent-tint hover:bg-accent-tint",
              )}
              onClick={() => pick(undefined)}
            >
              <Icon name="block" size={15} className="shrink-0 text-outline" />
              No project
            </button>

            <span
              className="block h-px my-1 mx-1 bg-hairline"
              aria-hidden="true"
            />

            {PROJECTS.map((project) => {
              const isSelected = project.id === value;
              return (
                <button
                  key={project.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={cn(
                    "flex items-center gap-2.5 w-full py-[9px] px-2.5 rounded-[9px]",
                    "text-sm text-left text-on-background",
                    "transition-colors duration-[130ms] ease-[ease] hover:bg-surface-low",
                    isSelected && "bg-accent-tint hover:bg-accent-tint",
                  )}
                  onClick={() => pick(project.id)}
                >
                  <span
                    className="w-2.5 h-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: project.color }}
                    aria-hidden="true"
                  />
                  <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
                    {project.name}
                  </span>
                  {isSelected && (
                    <Icon name="check" size={17} className="shrink-0 text-accent-text" />
                  )}
                </button>
              );
            })}
          </div>,
          document.body,
        )}
    </>
  );
}
