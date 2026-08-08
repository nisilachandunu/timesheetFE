import { cn } from "@/lib/cn";

export type ChipTone = "neutral" | "accent" | "success" | "danger";

export interface StatusChipProps {
  label: string;
  tone?: ChipTone;
}

/** Written out per tone: Tailwind cannot see a computed class name. */
const TONES: Record<ChipTone, string> = {
  neutral: "bg-hairline-faint text-on-surface-variant",
  accent: "bg-accent-tint text-accent-text",
  success: "bg-success-tint text-success-text",
  // The `color:` hint is required — without it Tailwind cannot tell that a
  // color-mix() arbitrary value is a colour and emits nothing.
  danger:
    "bg-[color:color-mix(in_srgb,var(--color-error)_14%,transparent)] text-error",
};

/** Compact status pill: a tone dot plus a label, sized for a dense grid row. */
export function StatusChip({ label, tone = "neutral" }: StatusChipProps) {
  return (
    <span
      className={cn(
        // Flat tinted pill — no dot, no border. Two chip columns sit side by
        // side in the grid, so anything heavier turns the row into noise.
        "inline-flex items-center max-w-full h-[23px] px-[9px] rounded-[6px]",
        "text-xs font-semibold tracking-[-0.002em] leading-none",
        "whitespace-nowrap overflow-hidden text-ellipsis",
        TONES[tone],
      )}
    >
      {label}
    </span>
  );
}
