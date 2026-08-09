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

/* Field chrome, shared with MainTaskSelect and DateField so the three read as
   one form language. Resting state is a hairline; weight is added on hover,
   and colour only on focus — so a form at rest is quiet and the caret's
   location is the one thing the eye is drawn to. */
const FIELD = cn(
  "peer w-full py-[clamp(9px,1.7vh,12px)] px-4 rounded-md",
  "bg-surface-lowest text-on-background text-body-md",
  "border border-solid border-outline-variant",
  "transition-[border-color,box-shadow,background-color] duration-base ease-out-expo",
  "placeholder:text-outline",
  // Same hover language as the outline Button (see SsoButton): a violet edge
  // and a soft violet bloom. Never the grey `outline` token, which reads as a
  // hard black box against these light surfaces.
  "enabled:hover:border-primary",
  // Held back while focused so the bloom cannot displace the focus ring: a
  // plain `hover:` variant outranks `focus:` on specificity and would win
  // whenever you moused over the field you were typing in.
  "[&:enabled:hover:not(:focus)]:shadow-focus-outline",
  "focus:outline-none focus:border-primary",
  "focus:shadow-[0_0_0_3px_var(--color-focus-ring)]",
  "disabled:bg-surface-low disabled:text-on-surface-variant",
  "disabled:border-hairline disabled:cursor-not-allowed",
  "disabled:placeholder:text-outline-variant",
);

/* Red wins over the focus colours: on an invalid field, "this is wrong" is
   the more urgent signal than "this is where you are typing". */
const FIELD_INVALID = cn(
  // `enabled:hover:` mirrors FIELD's own hover variant exactly, so
  // tailwind-merge drops the losing one rather than leaving both in the
  // class list for CSS specificity to arbitrate.
  "border-error enabled:hover:border-error focus:border-error",
  "focus:shadow-[0_0_0_3px_var(--color-error-ring)]",
  // Same bloom as the resting field, restruck in red so an invalid field
  // never glows violet.
  "[&:enabled:hover:not(:focus)]:shadow-[0_4px_20px_var(--color-error-ring)]",
);

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  (
    { label, icon, trailingSlot, errorText, id, className, required, disabled, ...rest },
    ref,
  ) => {
    const errorId = errorText && id ? `${id}-error` : undefined;

    return (
      <div className="flex flex-col gap-1.5 min-w-0">
        <label
          className={cn(
            "text-label-sm font-semibold text-on-surface-variant",
            "transition-colors duration-fast ease-[ease]",
            disabled && "text-outline",
          )}
          htmlFor={id}
        >
          {label}
          {required && (
            <span className="ml-[3px] text-error" aria-hidden="true">
              *
            </span>
          )}
        </label>

        <div className="relative flex items-center">
          {/* The input is rendered before the affordances that sit on top of
              it so they can react to its focus via `peer-focus` — a sibling
              combinator, which only reaches forward. Both are absolutely
              positioned, so DOM order costs nothing visually. */}
          <input
            ref={ref}
            id={id}
            className={cn(
              // styles.input carries the date-picker indicator and autofill
              // rules — vendor pseudo-elements utilities cannot express.
              styles.input,
              FIELD,
              icon && "pl-11",
              trailingSlot && "pr-11",
              errorText && FIELD_INVALID,
              className,
            )}
            required={required}
            disabled={disabled}
            aria-invalid={errorText ? true : undefined}
            aria-describedby={errorId}
            {...rest}
          />

          {icon && (
            <span
              className={cn(
                "absolute left-3 flex items-center pointer-events-none",
                "text-outline transition-colors duration-fast ease-[ease]",
                "peer-focus:text-primary",
                errorText && "text-error peer-focus:text-error",
                disabled && "text-outline-variant",
              )}
            >
              <Icon name={icon} size={20} />
            </span>
          )}

          {trailingSlot && (
            <span className="absolute right-3 flex items-center">
              {trailingSlot}
            </span>
          )}
        </div>

        {errorText && (
          <span
            className="flex items-center gap-1.5 text-label-sm font-semibold text-error"
            id={errorId}
            role="alert"
          >
            <Icon name="error" className="[--icon-size:15px]" filled />
            {errorText}
          </span>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
