import Link from "next/link";
import type { CSSProperties } from "react";
import { Icon } from "../Icon";
import { cn } from "@/lib/cn";

export interface NavItemProps {
  href: string;
  label: string;
  /** Material Symbols ligature name. */
  icon: string;
  active?: boolean;
  /** Icon-only rail: hides the label and reveals it as a hover tooltip. */
  collapsed?: boolean;
  /** Solid accent colour for the icon chip and active marker. */
  accent?: string;
  /** Translucent accent used as the resting chip fill. */
  accentSoft?: string;
  onNavigate?: () => void;
}

const BASE = cn(
  "group relative flex items-center gap-3 py-2 pr-3 pl-[9px] rounded-[11px]",
  "text-[0.9rem] font-medium tracking-[-0.004em] text-rail-text-muted",
  "border border-solid border-transparent",
  "transition-[background-color,color,border-color,box-shadow]",
  "duration-200 ease-out-expo",
  "hover:bg-rail-hover hover:text-rail-text",
  // Defaults for the section accent; the inline style overrides them per item.
  "[--nav-accent:var(--color-accent-text)]",
  "[--nav-accent-soft:rgba(167,139,250,0.16)]",
  // Section accents are tuned for light surfaces; lift them toward white so
  // they stay luminous against the dark rail.
  "[--nav-accent-bright:color-mix(in_srgb,var(--nav-accent)_60%,#fff)]",
);

/** Active: frosted pill plus a section-coloured marker at the leading edge. */
const ACTIVE = cn(
  "bg-[linear-gradient(90deg,rgba(255,255,255,0.11)_0%,rgba(255,255,255,0.055)_100%)]",
  "hover:bg-[linear-gradient(90deg,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0.07)_100%)]",
  "text-rail-text font-semibold border-hairline",
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.07),0_8px_20px_-12px_rgba(0,0,0,0.55)]",
  "before:content-[''] before:absolute before:left-0 before:top-1/2",
  "before:-translate-y-1/2 before:w-[3px] before:h-[18px] before:rounded-full",
  "before:bg-[var(--nav-accent-bright)]",
  "before:shadow-[0_0_10px_1px_var(--nav-accent-soft)]",
);

/** Collapsed: icon-only, with the label re-surfaced as a floating tooltip. */
const COLLAPSED = cn(
  "justify-center py-[7px] px-0 gap-0",
  "after:content-[attr(data-tooltip)] after:absolute",
  "after:left-[calc(100%+16px)] after:top-1/2",
  "after:-translate-y-1/2 after:-translate-x-1 after:z-40",
  "after:py-[7px] after:px-[11px] after:rounded-[9px]",
  "after:bg-rail-tooltip after:border after:border-solid after:border-hairline-strong",
  "after:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.7)]",
  "after:text-rail-text after:text-xs after:font-semibold after:whitespace-nowrap",
  "after:opacity-0 after:pointer-events-none",
  "after:transition-[opacity,transform] after:duration-[160ms] after:ease-out-expo",
  "hover:after:opacity-100 hover:after:translate-x-0",
  "focus-visible:after:opacity-100 focus-visible:after:translate-x-0",
);

export function NavItem({
  href,
  label,
  icon,
  active = false,
  collapsed = false,
  accent,
  accentSoft,
  onNavigate,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      // The visible label is hidden when collapsed, so name the link explicitly.
      aria-label={collapsed ? label : undefined}
      title={collapsed ? label : undefined}
      data-tooltip={label}
      style={
        {
          ...(accent ? { "--nav-accent": accent } : {}),
          ...(accentSoft ? { "--nav-accent-soft": accentSoft } : {}),
        } as CSSProperties
      }
      className={cn(BASE, active && ACTIVE, collapsed && COLLAPSED)}
    >
      <span
        className={cn(
          "flex items-center justify-center w-8 h-8 shrink-0 rounded-[9px]",
          "text-rail-text-dim",
          "transition-[background-color,color] duration-[220ms] ease-out-expo",
          "group-hover:text-rail-text",
          active &&
            "text-[var(--nav-accent-bright)] group-hover:text-[var(--nav-accent-bright)]",
        )}
      >
        <Icon
          name={icon}
          className="[--icon-size:20px]"
          filled={active}
          weight={active ? 500 : 400}
        />
      </span>
      <span
        className={cn(
          "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
          collapsed && "hidden",
        )}
      >
        {label}
      </span>
    </Link>
  );
}
