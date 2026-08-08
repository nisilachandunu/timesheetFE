import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Icon } from "../Icon";
import { cn } from "@/lib/cn";
import styles from "./TextInput.module.css";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Material Symbols name rendered inside the field's leading edge. */
  icon?: string;
  /** Rendered inside the field's trailing edge, e.g. a visibility toggle. */
  trailingSlot?: ReactNode;
  errorText?: string;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, icon, trailingSlot, errorText, id, className, required, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label
          className="text-label-sm font-semibold text-on-surface-variant"
          htmlFor={id}
        >
          {label}
          {required && <span className="ml-[3px] text-error">*</span>}
        </label>

        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 flex items-center text-outline pointer-events-none">
              <Icon name={icon} size={20} />
            </span>
          )}

          <input
            ref={ref}
            id={id}
            className={cn(
              // styles.input only carries the date-picker indicator rules.
              styles.input,
              "w-full py-[clamp(9px,1.7vh,12px)] px-4 rounded-md",
              "border border-solid border-outline-variant",
              "bg-surface-lowest text-on-background text-body-md",
              "transition-[border-color,box-shadow] duration-fast ease-[ease]",
              "placeholder:text-outline",
              "focus:outline-none focus:border-primary",
              "focus:shadow-[0_0_0_3px_var(--color-focus-ring)]",
              icon && "pl-11",
              trailingSlot && "pr-11",
              errorText && "border-error",
              className,
            )}
            required={required}
            aria-invalid={errorText ? true : undefined}
            aria-describedby={errorText && id ? `${id}-error` : undefined}
            {...rest}
          />

          {trailingSlot && (
            <span className="absolute right-3 flex items-center">
              {trailingSlot}
            </span>
          )}
        </div>

        {errorText && (
          <span
            className="text-label-sm text-error"
            id={id ? `${id}-error` : undefined}
            role="alert"
          >
            {errorText}
          </span>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
