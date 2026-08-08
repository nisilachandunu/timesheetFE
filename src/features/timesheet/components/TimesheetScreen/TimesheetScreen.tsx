"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Icon } from "@/components/ui";
import { PageHeader } from "@/features/dashboard";
import { buildColumns } from "../../columns";
import { useColumnLayout, useTimesheet, useWeek } from "../../hooks";
import type { TaskRow } from "../../types";
import { weekTotal } from "../../utils";
import { AddTaskModal } from "../AddTaskModal";
import { ColumnsMenu } from "../ColumnsMenu";
import { StatusChip } from "../StatusChip";
import { TimesheetGrid } from "../TimesheetGrid";
import { TimesheetToolbar } from "../TimesheetToolbar";
import styles from "./TimesheetScreen.module.css";

interface PendingAdd {
  group: TaskRow["group"];
  project?: { id: string; name: string };
}

export function TimesheetScreen() {
  const week = useWeek();
  const sheet = useTimesheet(week.today);
  const columnsApi = useColumnLayout();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  /* Only holds the group/project the row will belong to — the name and
     category are collected by the modal and applied on submit. */
  const [pendingAdd, setPendingAdd] = useState<PendingAdd | null>(null);

  const columns = useMemo(
    () => buildColumns(columnsApi.layout, week.dates, week.today),
    [columnsApi.layout, week.dates, week.today],
  );

  const total = useMemo(
    () => weekTotal(sheet.entries, sheet.rows, week.dates),
    [sheet.entries, sheet.rows, week.dates],
  );

  const actions = (
    <>
      {sheet.isDirty && (
        <span className={styles.dirty}>
          <span className={styles.dirtyDot} aria-hidden="true" />
          Unsaved changes
        </span>
      )}

      {sheet.isLocked ? (
        <Button variant="outline" fullWidth={false} onClick={sheet.reopen}>
          <Icon name="lock_open" size={18} />
          Reopen
        </Button>
      ) : (
        <>
          <Button
            variant="outline"
            fullWidth={false}
            onClick={sheet.save}
            disabled={!sheet.isDirty}
          >
            <Icon name="save" size={18} />
            Save
          </Button>
          <Button
            variant="primary"
            fullWidth={false}
            onClick={sheet.complete}
            disabled={total === 0}
            title={total === 0 ? "Log some hours before completing the week" : undefined}
          >
            <Icon name="send" size={18} />
            Complete
          </Button>
        </>
      )}
    </>
  );

  return (
    <div className={styles.page}>
      <PageHeader
        title="Timesheet"
        description="Report time spent on tasks, week by week."
        actions={actions}
      />

      {isLoading || !week.isReady || !week.weekStart ? (
        /* The current week is resolved after mount — see useWeek — so the
           grid gets a high-fidelity skeleton rather than a blank state on first paint. */
        <div className={styles.skeleton} aria-hidden="true">
          <div className={styles.skeletonToolbar}>
            <div className={styles.skelNav}>
              <div className={styles.skelBtn} />
              <div className={styles.skelDate} />
              <div className={styles.skelBtn} />
              <div className={styles.skelChip} />
            </div>
            <div className={styles.skelTotal}>
              <div className={styles.skelTextSm} />
              <div className={styles.skelTextLg} />
              <div className={styles.skelBar} />
            </div>
          </div>
          <div className={styles.skeletonGrid}>
            <div className={styles.skelHead}>
              <div className={styles.skelHeadColTask} />
              <div className={styles.skelHeadCol} />
              <div className={styles.skelHeadCol} />
              <div className={styles.skelHeadCol} />
              <div className={styles.skelHeadCol} />
              <div className={styles.skelHeadCol} />
              <div className={styles.skelHeadCol} />
              <div className={styles.skelHeadCol} />
            </div>
            <div className={styles.skelGroupRow}>
              <div className={styles.skelGroupIcon} />
              <div className={styles.skelGroupTitle} />
            </div>
            <div className={styles.skelTaskRow}>
              <div className={styles.skelTaskTitle} />
              <div className={styles.skelDayCells}>
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
              </div>
            </div>
            <div className={styles.skelTaskRow}>
              <div className={styles.skelTaskTitleSm} />
              <div className={styles.skelDayCells}>
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
              </div>
            </div>
            <div className={styles.skelGroupRow}>
              <div className={styles.skelGroupIcon} />
              <div className={styles.skelGroupTitleSm} />
            </div>
            <div className={styles.skelTaskRow}>
              <div className={styles.skelTaskTitle} />
              <div className={styles.skelDayCells}>
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
                <div className={styles.skelPill} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Toolbar, banner and grid share one bordered panel: as separate
           floating cards they read as three unrelated widgets. */
        <div className={styles.panel}>
          <TimesheetToolbar
            weekStart={week.weekStart}
            isCurrentWeek={week.isCurrentWeek}
            total={total}
            onPrevious={week.goToPrevious}
            onNext={week.goToNext}
            onToday={week.goToToday}
          >
            <ColumnsMenu
              layout={columnsApi.layout}
              dates={week.dates}
              isCustomised={columnsApi.isCustomised}
              onToggleColumn={columnsApi.toggleColumn}
              onMoveColumn={columnsApi.moveColumn}
              onReset={columnsApi.reset}
            />
          </TimesheetToolbar>

          {sheet.isLocked && (
            <div className={styles.locked} role="status">
              <Icon name="lock" size={18} className={styles.lockedIcon} />
              <span>
                This week has been submitted and is awaiting approval. Reopen it to
                make further changes.
              </span>
              <StatusChip label="Submitted" tone="accent" />
            </div>
          )}

          <TimesheetGrid
            columns={columns}
            groups={sheet.groups}
            rows={sheet.rows}
            entries={sheet.entries}
            dates={week.dates}
            isLocked={sheet.isLocked}
            onSetEntry={sheet.setEntry}
            onRequestAddTask={(group, project) => setPendingAdd({ group, project })}
            onRemoveTask={sheet.removeTask}
            onResizeColumn={columnsApi.setWidth}
            onReorderColumn={columnsApi.reorderColumn}
          />

          <p className={styles.tip}>
            <Icon name="keyboard" size={16} className={styles.tipIcon} />
            Arrow keys move between day cells, Enter drops to the next row. Hours
            accept <code>7.5</code> or <code>7:30</code>.
          </p>
        </div>
      )}

      {pendingAdd && (
        <AddTaskModal
          kind={pendingAdd.group}
          projectId={pendingAdd.project?.id}
          projectName={pendingAdd.project?.name}
          onClose={() => setPendingAdd(null)}
          onSubmit={({ name, category, mainTask, startDate, endDate }) => {
            sheet.addTask({ ...pendingAdd, name, category, mainTask, startDate, endDate });
            setPendingAdd(null);
          }}
        />
      )}
    </div>
  );
}
