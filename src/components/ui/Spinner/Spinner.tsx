import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export interface SpinnerProps {
  /** Any CSS length. Defaults to 1em so it tracks the surrounding text. */
  size?: string;
  className?: string;
  /** Accessible label; omit when a sibling already announces the state. */
  label?: string;
}

export function Spinner({ size, className, label }: SpinnerProps) {
  return (
    <span
      className={cn(
        "inline-block shrink-0 rounded-full",
        "w-[var(--spinner-size,1em)] h-[var(--spinner-size,1em)]",
        // border-style/color are spelled out: Preflight is off, so a width
        // utility alone would leave border-style at its `none` default.
        "border-2 border-solid border-current border-r-transparent",
        // Trims the optical weight so it sits nicely beside a text label.
        "opacity-90",
        "animate-spin motion-reduce:[animation-duration:1.5s]",
        className,
      )}
      style={size ? ({ "--spinner-size": size } as CSSProperties) : undefined}
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
