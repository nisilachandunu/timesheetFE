"use client";

import { useTheme } from "@/hooks";
import { Icon } from "../Icon";
import { cn } from "@/lib/cn";

export interface ThemeToggleProps {
  className?: string;
}

/** Both glyphs share one grid cell; only the active one is visible. */
const GLYPH = cn(
  "[grid-area:1/1] opacity-0 rotate-[-70deg] scale-[0.4]",
  "transition-[opacity,transform] duration-[260ms] ease-out-expo",
  "motion-reduce:transition-opacity motion-reduce:duration-[1ms]",
  "motion-reduce:ease-linear motion-reduce:transform-none",
);

const GLYPH_ON = "opacity-100 rotate-0 scale-100";

/**
 * Light/dark switch. Both glyphs are rendered and cross-faded so the swap
 * animates; the bulb shows in light mode, the crescent moon in dark.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center shrink-0",
        "w-[38px] h-[38px] rounded-full",
        "text-on-surface-variant bg-surface-lowest shadow-sm",
        "border border-solid border-hairline",
        "transition-[background-color,border-color,color,box-shadow]",
        "duration-fast ease-[ease]",
        "hover:text-accent-text hover:border-accent-tint-border",
        "hover:bg-accent-tint-faint",
        className,
      )}
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <span className="relative grid place-items-center w-5 h-5">
        <Icon
          name="lightbulb"
          size={20}
          filled
          className={cn(GLYPH, !isDark && GLYPH_ON)}
        />
        <Icon
          name="dark_mode"
          size={20}
          filled
          className={cn(GLYPH, isDark && GLYPH_ON)}
        />
      </span>
    </button>
  );
}
