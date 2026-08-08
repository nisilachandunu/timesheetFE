import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface DividerProps {
  /** Optional label rendered between the two rules. */
  children?: ReactNode;
  className?: string;
}

export function Divider({ children, className }: DividerProps) {
  const line = "flex-1 h-px bg-outline-variant";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className={line} />
      {children && (
        <span className="text-label-sm font-semibold tracking-wider uppercase text-on-surface-variant">
          {children}
        </span>
      )}
      {children && <span className={line} />}
    </div>
  );
}
