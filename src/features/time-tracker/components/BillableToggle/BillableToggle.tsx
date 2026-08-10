"use client";

import { Icon } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface BillableToggleProps {
  value: boolean;
  onChange: (billable: boolean) => void;
  disabled?: boolean;
}

/**
 * The `$` affordance shared by the composer bar and every logged row: on means
 * the time is charged to the client. A pressed-state button rather than a
 * checkbox — at this density a label would cost more room than the control.
 */
export function BillableToggle({ value, onChange, disabled = false }: BillableToggleProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center w-8 h-8 shrink-0 rounded-[8px]",
        "transition-[background-color,color] duration-fast ease-[ease]",
        "enabled:hover:bg-surface-low disabled:cursor-not-allowed",
        value
          ? "text-success-text enabled:hover:bg-success-tint"
          : "text-outline-variant enabled:hover:text-on-surface-variant",
      )}
      aria-pressed={value}
      aria-label={value ? "Billable" : "Non-billable"}
      title={value ? "Billable" : "Non-billable"}
      onClick={() => onChange(!value)}
    >
      <Icon name="attach_money" size={19} weight={value ? 600 : 400} />
    </button>
  );
}
