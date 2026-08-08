"use client";

import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { Button, Icon, TextInput } from "@/components/ui";
import { useDismissable } from "@/hooks";
import { CATEGORIES, DEFAULT_MAIN_TASKS, PROJECT_MAIN_TASKS } from "../../constants";
import type { Category, MainTaskOption, TaskRow } from "../../types";
import { toISODate } from "../../utils";
import { DateField } from "./DateField";
import { MainTaskSelect } from "./MainTaskSelect";
import styles from "./AddTaskModal.module.css";

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

const CATEGORY_META: Record<Category, { chipClass: string; hint: string }> = {
  Billable: { chipClass: styles.optionBillable, hint: "Charged to the client" },
  "Non-Billable": {
    chipClass: styles.optionNonBillable,
    hint: "Internal, not invoiced",
  },
  Leave: { chipClass: styles.optionLeave, hint: "Casual, medical, or annual leave" },
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
    <div className={styles.backdrop} role="presentation">
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.header}>
          <span className={styles.headerIcon} aria-hidden="true">
            <Icon name="add_task" size={22} weight={500} />
          </span>
          <div className={styles.headerText}>
            <h2 id={titleId} className={styles.title}>
              Add task
            </h2>
            <p className={styles.subtitle}>
              {projectName
                ? `A new task under ${projectName}, ready to log hours against.`
                : "A new non-project task, ready to log hours against."}
            </p>
          </div>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="close" size={19} />
          </button>
        </div>

        <form className={styles.body} onSubmit={handleSubmit}>
          {isProject && (
            <div className={styles.projectRow}>
              <div className={styles.field}>
                <span className={styles.label}>Project</span>
                <span className={styles.projectTag}>
                  <Icon name="folder" size={15} />
                  {projectName}
                </span>
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor={mainTaskFieldId}>
                  Main task<span className={styles.required}>*</span>
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

          <div className={styles.field}>
            <span className={styles.label}>
              Category<span className={styles.required}>*</span>
            </span>
            <div className={styles.options} role="radiogroup" aria-label="Category">
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
                    className={`${styles.option} ${meta.chipClass} ${
                      selected ? styles.optionSelected : ""
                    }`}
                    onClick={() => setCategory(option)}
                  >
                    <span className={styles.optionDot} aria-hidden="true" />
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.fieldRow}>
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

          <div className={styles.actions}>
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
