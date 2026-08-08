import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...rest }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer select-none">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "appearance-none w-4 h-4 shrink-0 grid place-content-center cursor-pointer",
            "border border-solid border-outline-variant rounded-sm bg-surface-lowest",
            "transition-[background-color,border-color] duration-fast ease-[ease]",
            // The tick is a clip-path on ::after that scales in when checked.
            "after:content-[''] after:w-[9px] after:h-[9px] after:scale-0",
            "after:transition-transform after:duration-fast after:ease-out-expo",
            "after:shadow-[inset_1em_1em_var(--color-on-primary)]",
            "after:[clip-path:polygon(14%_44%,0_65%,50%_100%,100%_16%,80%_0%,43%_62%)]",
            "checked:bg-primary checked:border-primary checked:after:scale-100",
            className,
          )}
          {...rest}
        />
        <span className="text-label-sm font-semibold text-on-surface-variant">
          {label}
        </span>
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
