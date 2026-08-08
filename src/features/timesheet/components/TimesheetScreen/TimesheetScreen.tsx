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
import { cn } from "@/lib/cn";

interface PendingAdd {
  group: TaskRow["group"];
  project?: { id: string; name: string };
}

/* Skeleton blocks: a plain tinted rectangle, repeated at several sizes. */
const SKEL = "bg-surface-high";

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
        <span className={"inline-flex items-center gap-1.5 mr-1 text-xs font-semibold whitespace-nowrap text-on-surface-variant"}>
          <span className={cn(
            "w-[7px] h-[7px] rounded-full bg-primary",
            "shadow-[0_0_0_3px_var(--color-accent-tint)]",
            "animate-pulse-glow motion-reduce:animate-none",
          )} aria-hidden="true" />
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
    <div className={cn(
        "flex flex-col gap-[clamp(14px,2vh,20px)]",
        // Fills the shell's content area so the panel below can be capped at
        // the space actually on screen. Without a definite height the grid's
        // scroller cannot know how tall it may be, and the whole page scrolls
        // instead — two scrollbars for one table.
        "h-full",
      )}>
      <PageHeader
        title="Timesheet"
        description="Report time spent on tasks, week by week."
        actions={actions}
      />

      {isLoading || !week.isReady || !week.weekStart ? (
        /* The current week is resolved after mount — see useWeek — so the
           grid gets a high-fidelity skeleton rather than a blank state on first paint. */
        <div className={cn(
          "relative flex flex-col min-h-0 rounded-[14px] overflow-hidden",
          "bg-surface-lowest border border-solid border-hairline shadow-card",
          // Holographic shimmer sweeping the whole skeleton.
          "after:content-[''] after:absolute after:inset-0 after:-translate-x-full",
          "after:bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.03)_25%,rgba(106,57,219,0.08)_50%,rgba(255,255,255,0.05)_75%,transparent_100%)]",
          "after:animate-shimmer-wave motion-reduce:after:animate-none",
          "after:pointer-events-none after:z-[5]",
        )} aria-hidden="true">
          <div className={"flex items-center justify-between p-3.5 bg-surface-lowest border-b border-solid border-hairline"}>
            <div className={"flex items-center gap-2"}>
              <div className={cn("w-[34px] h-[34px] rounded-[8px]", SKEL)} />
              <div className={cn("w-[140px] h-5 rounded-[6px] mx-1", SKEL)} />
              <div className={cn("w-[34px] h-[34px] rounded-[8px]", SKEL)} />
              <div className={"w-[70px] h-5 rounded-[6px] bg-accent-tint"} />
            </div>
            <div className={"flex flex-col gap-1 w-[130px]"}>
              <div className={cn("w-[90px] h-2.5 rounded-[4px]", SKEL)} />
              <div className={cn("w-[70px] h-4 rounded-[5px]", SKEL)} />
              <div className={"w-full h-1 rounded-full bg-hairline-strong"} />
            </div>
          </div>
          <div className={"flex flex-col bg-surface-lowest"}>
            <div className={"flex items-center h-[42px] px-3.5 gap-3 bg-surface-low border-b border-solid border-hairline-strong"}>
              <div className={"w-[220px] h-3 rounded-[4px] shrink-0 bg-surface-highest"} />
              <div className={"flex-1 h-3 rounded-[4px] bg-surface-highest"} />
              <div className={"flex-1 h-3 rounded-[4px] bg-surface-highest"} />
              <div className={"flex-1 h-3 rounded-[4px] bg-surface-highest"} />
              <div className={"flex-1 h-3 rounded-[4px] bg-surface-highest"} />
              <div className={"flex-1 h-3 rounded-[4px] bg-surface-highest"} />
              <div className={"flex-1 h-3 rounded-[4px] bg-surface-highest"} />
              <div className={"flex-1 h-3 rounded-[4px] bg-surface-highest"} />
            </div>
            <div className={"flex items-center h-9 px-3.5 gap-2.5 bg-accent-tint-faint border-t border-b border-solid border-accent-tint-border"}>
              <div className={"w-5 h-5 rounded-[6px] bg-accent-tint"} />
              <div className={"w-[180px] h-3.5 rounded-[4px] bg-accent-tint"} />
            </div>
            <div className={"flex items-center h-10 px-3.5 gap-3 border-b border-solid border-hairline-faint"}>
              <div className={cn("w-[180px] h-3.5 ml-6 rounded-[4px] shrink-0", SKEL)} />
              <div className={"flex items-center flex-1 gap-3"}>
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
              </div>
            </div>
            <div className={"flex items-center h-10 px-3.5 gap-3 border-b border-solid border-hairline-faint"}>
              <div className={cn("w-[130px] h-3.5 ml-6 rounded-[4px] shrink-0", SKEL)} />
              <div className={"flex items-center flex-1 gap-3"}>
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
              </div>
            </div>
            <div className={"flex items-center h-9 px-3.5 gap-2.5 bg-accent-tint-faint border-t border-b border-solid border-accent-tint-border"}>
              <div className={"w-5 h-5 rounded-[6px] bg-accent-tint"} />
              <div className={"w-[120px] h-3.5 rounded-[4px] bg-accent-tint"} />
            </div>
            <div className={"flex items-center h-10 px-3.5 gap-3 border-b border-solid border-hairline-faint"}>
              <div className={cn("w-[180px] h-3.5 ml-6 rounded-[4px] shrink-0", SKEL)} />
              <div className={"flex items-center flex-1 gap-3"}>
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
                <div className={"flex-1 h-6 rounded-[6px] bg-surface-low border border-solid border-hairline"} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Toolbar, banner and grid share one bordered panel: as separate
           floating cards they read as three unrelated widgets. */
        <div className={cn(
          // One container holds the toolbar, banner, grid and hint as
          // horizontal bands, so the screen reads as a single object.
          "relative flex flex-col min-h-0 rounded-[14px] overflow-hidden",
          "bg-surface-lowest border border-solid border-hairline",
          "shadow-[0_1px_3px_rgba(0,0,0,0.03),0_12px_28px_-8px_rgba(0,0,0,0.05),0_0_0_1px_var(--color-hairline)]",
          "animate-panel-entrance motion-reduce:animate-none",
          // Laser light ray sweeping the top edge on load.
          "before:content-[''] before:absolute before:top-0 before:left-[-30%]",
          "before:w-[28%] before:h-0.5 before:z-10 before:pointer-events-none",
          "before:bg-[linear-gradient(90deg,transparent,var(--color-primary),rgba(255,255,255,0.95),var(--color-primary),transparent)]",
          "before:animate-border-light-ray motion-reduce:before:animate-none",
        )}>
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
            <div className={cn(
            "flex items-center shrink-0 gap-2.5 py-[11px] px-3.5",
            "text-[0.8125rem] text-on-surface-variant bg-accent-tint-faint",
            "border-b border-solid border-hairline",
            "max-[720px]:flex-wrap",
            "[&>span:first-of-type]:flex-1 [&>span:first-of-type]:min-w-0",
          )} role="status">
              <Icon name="lock" size={18} className={"shrink-0 text-accent-text"} />
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

          <p className={cn(
            "flex items-center shrink-0 gap-[7px] py-2.5 px-3.5",
            "text-xs text-outline bg-surface-lowest",
            "border-t border-solid border-hairline",
            "[&_code]:py-px [&_code]:px-[5px] [&_code]:rounded-[5px]",
            // The project's own stack, not Tailwind's default `font-mono`.
            "[&_code]:[font-family:ui-monospace,'SFMono-Regular','Consolas',monospace]",
            "[&_code]:text-[0.6875rem]",
            "[&_code]:text-on-surface-variant [&_code]:bg-surface-container",
          )}>
            <Icon name="keyboard" size={16} className={"shrink-0"} />
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
