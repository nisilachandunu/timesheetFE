import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "../Spinner";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  /** Shows a spinner and blocks interaction while an action is in flight. */
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  fullWidth = true,
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : "",
    loading ? styles.loading : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
