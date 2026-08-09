"use client";

import { Icon } from "@/components/ui";
import { PASSWORD_RULES, type PasswordStrength } from "../../passwordPolicy";
import { cn } from "@/lib/cn";

export interface PasswordPolicyPanelProps {
  /** The candidate password, checked live against each rule. */
  value: string;
  strength: PasswordStrength;
}

type Level = PasswordStrength["level"];

/**
 * Level colours were descendant rules off the panel root (`.weak .segmentOn`).
 * Tailwind cannot see a computed class, so each level is written out and
 * applied straight to the element it colours.
 */
const SEGMENT_ON: Partial<Record<Level, string>> = {
  weak: "bg-[#ef4444] shadow-[0_0_10px_-2px_rgba(239,68,68,0.7)]",
  fair: "bg-[#f59e0b] shadow-[0_0_10px_-2px_rgba(245,158,11,0.7)]",
  good: "bg-[#3b82f6] shadow-[0_0_10px_-2px_rgba(59,130,246,0.7)]",
  strong: "bg-success-solid shadow-[0_0_10px_-2px_rgba(22,163,74,0.7)]",
};

/** Tuned for light paper, lifted on dark so they stay legible. */
const VALUE_COLOUR: Partial<Record<Level, string>> = {
  weak: "text-[#dc2626] dark:text-[#f87171]",
  fair: "text-[#d97706] dark:text-[#fbbf24]",
  good: "text-[#2563eb] dark:text-[#60a5fa]",
  strong: "text-success-text",
};

export function PasswordPolicyPanel({ value, strength }: PasswordPolicyPanelProps) {
  return (
    <aside
      className={cn(
        "flex flex-col gap-4 p-[18px] rounded-[14px]",
        "bg-surface-low",
      )}
    >
      <h3
        className={cn(
          "flex items-center gap-2 text-[0.8125rem] font-bold",
          "tracking-[-0.005em] text-on-background",
        )}
      >
        <Icon
          name="verified_user"
          className="[--icon-size:17px] text-accent-text"
          weight={500}
        />
        Password requirements
      </h3>

      <ul className="flex flex-col gap-[9px] list-none">
        {PASSWORD_RULES.map((rule) => {
          const passed = rule.test(value);
          return (
            <li
              key={rule.id}
              className={cn(
                "group flex items-center gap-[9px] text-[0.8125rem]",
                "transition-colors duration-200 ease-[ease]",
                passed
                  ? "text-on-background font-medium"
                  : "text-on-surface-variant",
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center w-[18px] h-[18px] shrink-0",
                  "rounded-full border-[1.5px] border-solid",
                  "transition-[background-color,border-color,color,transform]",
                  "duration-[220ms] ease-out-expo",
                  passed
                    ? "bg-success-solid border-success-solid text-white scale-[1.06]"
                    : "border-hairline-strong text-transparent",
                )}
              >
                <Icon name="check" className="[--icon-size:12px]" weight={700} />
              </span>
              {rule.label}
              <span className="sr-only">{passed ? " — met" : " — not met"}</span>
            </li>
          );
        })}
      </ul>

      <div className="pt-3.5">
        <div className="flex items-baseline justify-between gap-2.5 mb-2">
          <span className="text-xs font-semibold text-on-surface-variant">
            Password strength
          </span>
          <span
            className={cn(
              "text-[0.8125rem] font-bold text-outline",
              "transition-colors duration-[220ms] ease-[ease]",
              VALUE_COLOUR[strength.level],
            )}
            aria-live="polite"
          >
            {strength.label}
          </span>
        </div>

        <div
          // repeat(4,1fr), not Tailwind's grid-cols-4 => repeat(4,minmax(0,1fr)).
          className="grid grid-cols-[repeat(4,1fr)] gap-[5px]"
          role="meter"
          aria-valuemin={0}
          aria-valuemax={4}
          aria-valuenow={strength.score}
          aria-label="Password strength"
        >
          {[1, 2, 3, 4].map((step) => (
            <span
              key={step}
              className={cn(
                "h-[5px] rounded-full bg-hairline",
                "transition-[background-color,box-shadow] duration-[260ms] ease-out-expo",
                step <= strength.score && SEGMENT_ON[strength.level],
              )}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}
