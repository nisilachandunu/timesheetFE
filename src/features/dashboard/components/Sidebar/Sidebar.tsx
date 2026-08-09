"use client";

import { usePathname } from "next/navigation";
import { BrandMark, Icon, NavItem } from "@/components/ui";
import { CURRENT_USER, NAV_LINKS } from "../../constants";
import { useSidebarCollapse } from "../../hooks";
import { ProfileMenu } from "../ProfileMenu";
import { cn } from "@/lib/cn";

export interface SidebarProps {
  /** Drawer visibility below the desktop breakpoint. */
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Dark rail in both themes — see the rail tokens in globals.css. A faint bloom
 * at the top keeps the slab from going flat.
 */
// One unbroken literal: Tailwind matches class names as whole strings in the
// source, so splitting or post-processing this would generate nothing.
// prettier-ignore
const RAIL_BACKGROUND =
  "bg-[radial-gradient(130%_44%_at_50%_0%,var(--rail-bloom)_0%,transparent_60%),radial-gradient(90%_32%_at_0%_100%,var(--rail-bloom-alt)_0%,transparent_70%),linear-gradient(180deg,var(--rail-bg-top)_0%,var(--rail-bg-mid)_52%,var(--rail-bg-bottom)_100%)]";

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggle, isHydrated } = useSidebarCollapse();

  return (
    <aside
      className={cn(
        "relative z-20 flex flex-col shrink-0 w-[268px] h-full",
        "pt-5 px-3.5 pb-3.5 overflow-visible text-rail-text-muted",
        RAIL_BACKGROUND,
        "transition-[width,padding] duration-[280ms] ease-out-expo",
        "motion-reduce:transition-none",
        // The global focus ring is brand-dark and vanishes on this surface.
        "[&_:focus-visible]:outline-accent-text",
        // Responsive drawer.
        "max-lg:fixed max-lg:top-0 max-lg:left-0 max-lg:bottom-0",
        "max-lg:w-[min(286px,84vw)] max-lg:-translate-x-full",
        "max-lg:transition-transform max-lg:duration-[320ms] max-lg:ease-out-expo",
        "max-lg:shadow-[24px_0_60px_-20px_rgba(0,0,0,0.65)]",
        isOpen && "max-lg:translate-x-0",
        // Collapsed rail is a desktop-only affordance.
        isCollapsed && "lg:w-[76px] lg:pl-3 lg:pr-3",
        // Skip the width animation on the first paint so a restored collapsed
        // state does not slide in from expanded.
        !isHydrated && "!transition-none [&_*]:!transition-none",
      )}
      aria-label="Main navigation"
    >
      <div
        className={cn(
          "flex items-center gap-3 pt-0.5 px-1.5 pb-5",
          isCollapsed && "lg:flex-col lg:gap-3 lg:p-0 lg:pb-[18px]",
        )}
      >
        <BrandMark size={36} />

        <span className={cn("min-w-0 overflow-hidden", isCollapsed && "lg:hidden")}>
          <span className="block text-base font-bold tracking-[-0.02em] whitespace-nowrap text-rail-text">
            TimesheetOS
          </span>
          <span
            className={cn(
              "block mt-0.5 text-[0.625rem] font-semibold",
              "tracking-[0.14em] uppercase text-rail-text-dim",
            )}
          >
            Enterprise
          </span>
        </span>

        <button
          type="button"
          className={cn(
            "hidden lg:inline-flex items-center justify-center shrink-0",
            "w-7 h-7 ml-auto rounded-[9px] text-rail-text-dim",
            "bg-rail-raised",
            "transition-[background-color,color,border-color] duration-[180ms] ease-[ease]",
            "hover:bg-rail-hover hover:border-hairline-strong hover:text-rail-text",
            isCollapsed && "lg:ml-0",
          )}
          onClick={toggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!isCollapsed}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon
            name={isCollapsed ? "chevron_right" : "chevron_left"}
            size={19}
            weight={500}
          />
        </button>

        <button
          type="button"
          className={cn(
            "hidden max-lg:inline-flex items-center justify-center ml-auto",
            "w-[34px] h-[34px] rounded-[10px] text-rail-text-dim",
            "transition-[background-color,color] duration-[180ms] ease-[ease]",
            "hover:bg-rail-hover hover:text-rail-text",
          )}
          onClick={onClose}
          aria-label="Close navigation"
        >
          <Icon name="close" size={20} />
        </button>
      </div>

      <nav
        className={cn(
          "hide-scrollbar flex-1 min-h-0 flex flex-col gap-1 overflow-y-auto",
          // Tooltips escape the rail, so this must not clip horizontally.
          isCollapsed && "lg:overflow-visible",
        )}
      >
        <span
          className={cn(
            "flex items-center px-3 mb-2.5 text-[0.625rem] font-semibold",
            "tracking-[0.16em] uppercase text-rail-text-dim",
            // On the rail the heading collapses to a hairline divider.
            isCollapsed &&
              cn(
                "lg:justify-center lg:p-0 lg:mx-auto lg:mt-0.5 lg:mb-3",
                "lg:text-[0] lg:tracking-[0]",
                "lg:before:content-[''] lg:before:w-6 lg:before:h-px",
                "lg:before:rounded-full lg:before:bg-hairline-strong",
              ),
          )}
        >
          Workspace
        </span>
        {NAV_LINKS.map((link) => (
          <NavItem
            key={link.href}
            href={link.href}
            label={link.label}
            icon={link.icon}
            accent={link.accent}
            accentSoft={link.accentSoft}
            active={pathname === link.href || pathname.startsWith(`${link.href}/`)}
            collapsed={isCollapsed}
            onNavigate={onClose}
          />
        ))}
      </nav>

      <div className="shrink-0 pt-3.5 mt-3.5">
        <ProfileMenu user={CURRENT_USER} collapsed={isCollapsed} onNavigate={onClose} />
      </div>
    </aside>
  );
}
