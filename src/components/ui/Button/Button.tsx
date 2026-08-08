import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Spinner } from "../Spinner";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  /** Shows a spinner and blocks interaction while an action is in flight. */
  loading?: boolean;
  children: ReactNode;
}

/** Spelled out per variant so Tailwind can see every class literally. */
const VARIANTS: Record<ButtonVariant, string> = {
  primary: cn(
    "bg-primary text-on-primary shadow-md",
    "enabled:hover:bg-secondary enabled:hover:shadow-focus-primary",
  ),
  outline: cn(
    "bg-surface-lowest text-on-background shadow-sm",
    "border border-solid border-outline-variant",
    "enabled:hover:border-primary enabled:hover:bg-surface-low",
    "enabled:hover:shadow-focus-outline",
  ),
};

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
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "py-[clamp(9px,1.7vh,12px)] px-4 rounded-md",
        "text-body-md font-semibold leading-[1.25]",
        "transition-[background-color,border-color,box-shadow,transform]",
        "duration-base ease-out-expo",
        "enabled:hover:-translate-y-0.5 enabled:active:translate-y-0",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none",
        VARIANTS[variant],
        fullWidth && "w-full",
        // While loading the button stays at full strength — the spinner already
        // signals the state, and dimming it reads as "broken".
        loading && "disabled:opacity-100 disabled:cursor-progress",
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
