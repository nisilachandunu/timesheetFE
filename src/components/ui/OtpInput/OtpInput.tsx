"use client";

import {
  useRef,
  type ClipboardEvent,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { cn } from "@/lib/cn";

export interface OtpInputProps {
  /** Current code. May be shorter than `length` while being typed. */
  value: string;
  onChange: (value: string) => void;
  /** Number of slots to render. */
  length?: number;
  /** Fired once the final slot is filled. */
  onComplete?: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  autoFocus?: boolean;
  /** Accessible name for the group. */
  label?: string;
}

const DIGITS_ONLY = /\D/g;

const SLOT = cn(
  "w-full aspect-square max-h-[clamp(44px,8vh,60px)] min-w-0 text-center",
  "text-[clamp(1.125rem,3vh,1.5rem)] font-bold text-on-background",
  "bg-surface-lowest border border-solid border-outline-variant rounded-md",
  "transition-[border-color,box-shadow,background-color] duration-fast ease-[ease]",
  "focus:outline-none focus:border-primary",
  "focus:shadow-[0_0_0_3px_var(--color-focus-ring)]",
  // Hide number-input spinners so the slot stays a clean square.
  "[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0",
  "[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0",
);

export function OtpInput({
  value,
  onChange,
  length = 5,
  onComplete,
  disabled = false,
  invalid = false,
  autoFocus = false,
  label = "One-time password",
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const focusSlot = (index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputsRef.current[clamped]?.focus();
    inputsRef.current[clamped]?.select();
  };

  const commit = (next: string) => {
    onChange(next);
    if (next.length === length) onComplete?.(next);
  };

  const handleChange =
    (index: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const typed = event.target.value.replace(DIGITS_ONLY, "");
      if (!typed) return;

      // Take the last character so overwriting a filled slot works.
      const digit = typed[typed.length - 1];
      const chars = value.padEnd(length, " ").split("");
      chars[index] = digit;

      const next = chars.join("").trimEnd();
      commit(next);

      if (index < length - 1) focusSlot(index + 1);
    };

  const handleKeyDown =
    (index: number) => (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Backspace") {
        event.preventDefault();
        const chars = value.padEnd(length, " ").split("");

        if (chars[index] && chars[index] !== " ") {
          chars[index] = " ";
          commit(chars.join("").trimEnd());
        } else if (index > 0) {
          chars[index - 1] = " ";
          commit(chars.join("").trimEnd());
          focusSlot(index - 1);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        focusSlot(index - 1);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        focusSlot(index + 1);
      }
    };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(DIGITS_ONLY, "")
      .slice(0, length);
    if (!pasted) return;

    commit(pasted);
    focusSlot(pasted.length);
  };

  return (
    <div
      className="flex justify-between gap-[clamp(6px,1.4vh,12px)]"
      role="group"
      aria-label={label}
    >
      {Array.from({ length }, (_, index) => {
        const char = value[index] ?? "";
        return (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            className={cn(
              SLOT,
              char.trim() && "border-primary bg-accent-tint-faint",
              invalid &&
                "border-error focus:shadow-[0_0_0_3px_var(--color-error-ring)]",
            )}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            disabled={disabled}
            aria-label={`Digit ${index + 1} of ${length}`}
            aria-invalid={invalid || undefined}
            autoFocus={autoFocus && index === 0}
            value={char.trim()}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste}
            onFocus={(event) => event.target.select()}
          />
        );
      })}
    </div>
  );
}
