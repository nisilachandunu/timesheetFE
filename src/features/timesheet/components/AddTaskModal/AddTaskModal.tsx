"use client";

import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Button, Icon, TextInput } from "@/components/ui";
import { useDismissable } from "@/hooks";
import { CATEGORIES, DEFAULT_MAIN_TASKS, PROJECT_MAIN_TASKS } from "../../constants";
import type { Category, MainTaskOption, TaskRow } from "../../types";
import { toISODate } from "../../utils";
import { DateField } from "./DateField";
import { MainTaskSelect } from "./MainTaskSelect";
import { cn } from "@/lib/cn";

const FIELD = "flex flex-col justify-center gap-1 min-w-0";
const LABEL = "text-label-sm font-semibold text-on-surface-variant";

const OPTION = cn(
  "inline-flex items-center gap-[7px] h-[34px] px-[13px] rounded-[9px]",
  "text-[0.8125rem] font-semibold text-on-surface-variant bg-surface-low",
  "border-[1.5px] border-solid border-transparent",
  "transition-[border-color,background-color,color,transform]",
  "duration-[130ms] ease-[ease] hover:-translate-y-px",
);

export interface AddTaskModalProps {
  /** Which group the new row lands in — decides the default category. */
  kind: TaskRow["group"];
  /** Set only for a project group; renders as a fixed tag rather than a
      field, since the project is already known from which "Add task"
      button was clicked — asking the user to pick it again would be pure
      friction. */
  projectId?: string;
  projectName?: string;
  onClose: () => void;
  onSubmit: (input: {
    name: string;
    category: Category;
    mainTask?: MainTaskOption;
    startDate: string;
    endDate?: string;
  }) => void;
}

/* Selected state borrows each category's colour from the grid's chips, so the
   picker and the data it produces read as the same system. Spelled out per
   category because Tailwind cannot see a computed class name. */
const CATEGORY_META: Record<Category, { chipClass: string; hint: string }> = {
  Billable: {
    chipClass: "text-accent-text bg-accent-tint border-accent-tint-border",
    hint: "Charged to the client",
  },
  "Non-Billable": {
    chipClass: "text-on-background bg-hairline border-hairline-strong",
    hint: "Internal, not invoiced",
  },
  Leave: {
    chipClass: "text-success-text bg-success-tint border-success-tint-border",
    hint: "Casual, medical, or annual leave",
  },
};

/**
 * Task creation dialog. Rendered by the parent only while open, so the entry
 * animation plays on every mount — there is no exit animation, matching the
 * instant-dismiss popovers (ProfileMenu, ColumnsMenu) already in this app.
 */
export function AddTaskModal({
  kind,
  projectId,
  projectName,
  onClose,
  onSubmit,
}: AddTaskModalProps) {
  const isProject = kind === "project";

  const mainTaskOptions = useMemo(
    () => (isProject ? (PROJECT_MAIN_TASKS[projectId ?? ""] ?? DEFAULT_MAIN_TASKS) : []),
    [isProject, projectId],
  );

  const [name, setName] = useState("");
  const [category, setCategory] = useState<Category>(isProject ? "Billable" : "Non-Billable");
  // Blank rather than defaulted to the first option: which work-breakdown
  // item a task falls under is a real decision, not a formality to skip past.
  const [mainTaskId, setMainTaskId] = useState("");
  const [startDate, setStartDate] = useState(() => toISODate(new Date()));
  const [endDate, setEndDate] = useState("");

  const panelRef = useRef<HTMLDivElement>(null);
  useDismissable(panelRef, true, onClose);

  const titleId = useId();
  const nameId = useId();
  const mainTaskFieldId = useId();
  const startDateId = useId();
  const endDateId = useId();

  const trimmedName = name.trim();
  const dateOrderValid = !endDate || endDate >= startDate;
  const startDateValid = startDate !== "";
  const canSubmit =
    trimmedName.length > 0 &&
    (!isProject || mainTaskId !== "") &&
    startDateValid &&
    dateOrderValid;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    const mainTask = mainTaskOptions.find((option) => option.id === mainTaskId);
    onSubmit({
      name: trimmedName,
      category,
      mainTask,
      startDate,
      endDate: endDate || undefined,
    });
  };

  return (
    <div className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4",
        "bg-[rgba(11,8,28,0.5)] backdrop-blur-[3px]",
        "animate-backdrop-in motion-reduce:animate-none",
      )} role="presentation">
      <div
        ref={panelRef}
        className={cn(
          "w-full max-w-[440px] max-h-[min(90vh,600px)] overflow-y-auto",
          "rounded-[18px] bg-surface-lowest",
          "shadow-panel",
          "origin-center animate-panel-in motion-reduce:animate-none",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={cn(
            "flex items-start gap-3 pt-[18px] px-5 pb-3.5",
            "border-b border-solid border-hairline",
            "max-[480px]:pt-4 max-[480px]:px-4 max-[480px]:pb-3",
          )}>
          <span className={cn(
              "flex items-center justify-center w-10 h-10 shrink-0 rounded-[12px]",
              "bg-primary",
              "bg-[linear-gradient(140deg,rgba(255,255,255,0.32)_0%,transparent_62%)]",
              "text-on-primary shadow-[0_8px_18px_-8px_var(--color-accent-tint-border)]",
            )} aria-hidden="true">
            <Icon name="add_task" size={22} weight={500} />
          </span>
          <div className="flex-1 min-w-0 pt-0.5">
            <h2 id={titleId} className="text-[1.0625rem] font-bold tracking-[-0.015em] text-on-background">
              Add task
            </h2>
            <p className="mt-[3px] text-[0.8125rem] leading-normal text-on-surface-variant">
              {projectName
                ? `A new task under ${projectName}, ready to log hours against.`
                : "A new non-project task, ready to log hours against."}
            </p>
          </div>
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center w-8 h-8 shrink-0",
              "-mt-1 -mr-1 rounded-[9px] text-outline",
              "transition-[background-color,color] duration-[130ms] ease-[ease]",
              "hover:bg-hairline-faint hover:text-on-background",
            )}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="close" size={19} />
          </button>
        </div>

        <form className={cn(
            "flex flex-col gap-3.5 pt-[18px] px-5 pb-5",
            "max-[480px]:pt-3.5 max-[480px]:px-4 max-[480px]:pb-4",
          )} onSubmit={handleSubmit}>
          {isProject && (
            <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] gap-3 max-[480px]:grid-cols-1">
              <div className={FIELD}>
                <span className={LABEL}>Project</span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 self-start h-11 px-3",
                  "rounded-md text-[0.8125rem] font-semibold",
                  "text-accent-text bg-accent-tint",
                )}>
                  <Icon name="folder" size={15} />
                  {projectName}
                </span>
              </div>

              <div className={FIELD}>
                <label className={LABEL} htmlFor={mainTaskFieldId}>
                  Main task<span className="ml-[3px] text-error">*</span>
                </label>
                <MainTaskSelect
                  id={mainTaskFieldId}
                  options={mainTaskOptions}
                  value={mainTaskId}
                  onChange={setMainTaskId}
                />
              </div>
            </div>
          )}

          <TextInput
            id={nameId}
            label="Task name"
            placeholder="e.g. Sprint planning"
            autoFocus
            required
            maxLength={120}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <div className={FIELD}>
            <span className={LABEL}>
              Category<span className="ml-[3px] text-error">*</span>
            </span>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Category">
              {CATEGORIES.map((option) => {
                const meta = CATEGORY_META[option];
                const selected = option === category;
                return (
                  <button
                    key={option}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    title={meta.hint}
                    className={cn(OPTION, selected && meta.chipClass)}
                    onClick={() => setCategory(option)}
                  >
                    <span
                      className={cn(
                        "w-[7px] h-[7px] shrink-0 rounded-full bg-current",
                        selected ? "opacity-100" : "opacity-50",
                      )}
                      aria-hidden="true"
                    />
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-[480px]:grid-cols-1">
            <DateField
              id={startDateId}
              label="Start date"
              value={startDate}
              required
              onChange={setStartDate}
              errorText={startDateValid ? undefined : "Required"}
            />
            <DateField
              id={endDateId}
              label="End date (optional)"
              value={endDate}
              min={startDate || undefined}
              onChange={setEndDate}
              errorText={dateOrderValid ? undefined : "Ends before it starts"}
            />
          </div>

          <div className={cn(
              "flex justify-end gap-2.5 mt-0.5 pt-3.5",
              "border-t border-solid border-hairline",
              "max-[480px]:flex-col-reverse max-[480px]:[&>*]:w-full",
            )}>
            <Button variant="outline" fullWidth={false} onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              fullWidth={false}
              disabled={!canSubmit}
            >
              <Icon name="add" size={18} />
              Add task
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
