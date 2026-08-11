"use client";

import { Icon } from "@/components/ui";
import type { WorkedTask } from "../../types";
import { formatDuration } from "../../utils";
import { findProject } from "../ProjectPicker";
import { cn } from "@/lib/cn";

export interface FavouritesBarProps {
  /** Starred tasks, most time logged first. */
  tasks: WorkedTask[];
  onStart: (task: WorkedTask) => void;
  onToggleFavourite: (key: string) => void;
}

/**
 * Quick-start row for the tasks a person tracks time against most. Sits
 * under the composer rather than inside it — starting one of these is a
 * shortcut to what the composer already does, not a different action.
 *
 * Renders nothing once there are no favourites: the star on an entry row is
 * what populates this bar, so there is nothing useful to show before that
 * has happened once.
 */
export function FavouritesBar({ tasks, onStart, onToggleFavourite }: FavouritesBarProps) {
  if (tasks.length === 0) return null;

  return (
    <div
      className="flex items-center gap-1.5 shrink-0 overflow-x-auto py-0.5"
      role="group"
      aria-label="Favourite tasks"
    >
      <span className="flex items-center gap-1 shrink-0 pl-1 pr-0.5 text-[0.6875rem] font-bold tracking-[0.08em] uppercase text-outline">
        <Icon name="star" size={14} filled className="text-accent-text" />
        Favourites
      </span>

      {tasks.map((task) => (
        <FavouriteChip
          key={task.key}
          task={task}
          onStart={() => onStart(task)}
          onToggleFavourite={() => onToggleFavourite(task.key)}
        />
      ))}
    </div>
  );
}

function FavouriteChip({
  task,
  onStart,
  onToggleFavourite,
}: {
  task: WorkedTask;
  onStart: () => void;
  onToggleFavourite: () => void;
}) {
  const project = findProject(task.projectId);

  return (
    <div
      className={cn(
        "group inline-flex items-center gap-0.5 shrink-0 p-0.5 rounded-[10px]",
        "bg-surface-low",
      )}
    >
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-2 h-8 pl-2.5 pr-2 rounded-[8px]",
          "transition-colors duration-fast ease-[ease]",
          "hover:bg-surface-container",
        )}
        onClick={onStart}
        title="Start timer"
        aria-label={`Start timer for ${task.description}`}
      >
        {project && (
          <span
            className="w-[7px] h-[7px] shrink-0 rounded-full"
            style={{ backgroundColor: project.color }}
            aria-hidden="true"
          />
        )}
        <span className="max-w-[140px] overflow-hidden text-ellipsis whitespace-nowrap text-[0.8125rem] font-semibold text-on-background">
          {task.description}
        </span>
        <span className="shrink-0 text-xs tabular-nums text-outline">
          {formatDuration(task.total)}
        </span>
      </button>

      <button
        type="button"
        className={cn(
          "inline-flex items-center justify-center w-7 h-7 shrink-0 rounded-[7px] text-accent-text",
          "transition-colors duration-fast ease-[ease]",
          "hover:bg-surface-container",
        )}
        onClick={onToggleFavourite}
        title="Unstar"
        aria-label={`Remove ${task.description} from favourites`}
      >
        <Icon name="star" size={16} filled />
      </button>
    </div>
  );
}
