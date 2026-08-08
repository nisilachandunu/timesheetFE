import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Icon } from "../Icon";
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
    const inputClasses = [
      styles.input,
      icon ? styles.hasLeadingIcon : "",
      trailingSlot ? styles.hasTrailingSlot : "",
      errorText ? styles.error : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={styles.field}>
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>

        <div className={styles.inputWrap}>
          {icon && (
            <span className={styles.leadingIcon}>
              <Icon name={icon} size={20} />
            </span>
          )}

          <input
            ref={ref}
            id={id}
            className={inputClasses}
            required={required}
            aria-invalid={errorText ? true : undefined}
            aria-describedby={errorText && id ? `${id}-error` : undefined}
            {...rest}
          />

          {trailingSlot && <span className={styles.trailingSlot}>{trailingSlot}</span>}
        </div>

        {errorText && (
          <span className={styles.errorText} id={id ? `${id}-error` : undefined} role="alert">
            {errorText}
          </span>
        )}
      </div>
    );
  },
);

TextInput.displayName = "TextInput";
