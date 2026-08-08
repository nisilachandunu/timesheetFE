"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { Avatar, Icon } from "@/components/ui";
import { useDismissable } from "@/hooks";
import { SETTINGS_LINK } from "../../constants";
import type { UserProfile } from "../../types";
import { cn } from "@/lib/cn";

export interface ProfileMenuProps {
  user: UserProfile;
  /** Icon-only rail: shows just the avatar. */
  collapsed?: boolean;
  /** Called after navigating, so a mobile drawer can close itself. */
  onNavigate?: () => void;
}

const MENU_ITEM = cn(
  "group w-full flex items-center gap-[11px] py-[9px] px-2.5 rounded-[10px]",
  "text-sm font-medium text-left text-rail-text-muted",
  "transition-[background-color,color] duration-[160ms] ease-[ease]",
  "hover:bg-rail-hover hover:text-rail-text",
);

const MENU_ICON = cn(
  "[--icon-size:18px] text-rail-text-dim",
  "transition-colors duration-[160ms] ease-[ease]",
  "group-hover:text-accent-text",
);

export function ProfileMenu({ user, collapsed = false, onNavigate }: ProfileMenuProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setIsOpen(false), []);
  useDismissable(rootRef, isOpen, close);

  const handleNavigate = () => {
    close();
    onNavigate?.();
  };

  const handleSignOut = () => {
    close();
    onNavigate?.();
    router.push("/sign-in");
  };

  return (
    <div className="relative" ref={rootRef}>
      {isOpen && (
        <div
          className={cn(
            "absolute bottom-[calc(100%+10px)] left-0 right-0 z-30",
            "p-1.5 rounded-[15px] bg-rail-popover",
            "border border-solid border-hairline-strong",
            "shadow-[0_2px_4px_rgba(0,0,0,0.3),0_24px_50px_-16px_rgba(0,0,0,0.75)]",
            "origin-bottom animate-menu-in-profile",
            // The rail is far narrower than the menu needs, so pin a width.
            collapsed && "right-auto left-0 w-[238px]",
          )}
          role="menu"
          aria-label="Account"
        >
          <div className="py-2.5 pb-[11px] px-2.5 mb-[5px] border-b border-solid border-rail-border">
            <span className="text-sm font-bold tracking-[-0.01em] text-rail-text">
              {user.name}
            </span>
            <span
              className={cn(
                "block mt-0.5 text-xs text-rail-text-dim",
                "overflow-hidden text-ellipsis whitespace-nowrap",
              )}
              title={user.email}
            >
              {user.email}
            </span>
          </div>

          <Link
            href={SETTINGS_LINK.href}
            role="menuitem"
            className={MENU_ITEM}
            onClick={handleNavigate}
          >
            <Icon name={SETTINGS_LINK.icon} className={MENU_ICON} />
            {SETTINGS_LINK.label}
          </Link>

          <button
            type="button"
            role="menuitem"
            className={cn(
              MENU_ITEM,
              "group/signout",
              "hover:bg-[rgba(255,107,107,0.1)] hover:text-[#ff9d95]",
            )}
            onClick={handleSignOut}
          >
            <Icon
              name="logout"
              className={cn(MENU_ICON, "group-hover/signout:text-[#ff9d95]")}
            />
            Sign out
          </button>
        </div>
      )}

      <button
        type="button"
        className={cn(
          "w-full flex items-center gap-2.5 p-2 rounded-xl text-left",
          "bg-rail-raised border border-solid border-rail-border",
          "transition-[background-color,border-color,box-shadow]",
          "duration-[220ms] ease-out-expo",
          "hover:bg-rail-hover hover:border-accent-tint-border",
          "hover:shadow-[0_8px_20px_-12px_rgba(0,0,0,0.7)]",
          isOpen &&
            "bg-rail-hover border-accent-tint-border shadow-[0_8px_20px_-12px_rgba(0,0,0,0.7)]",
          collapsed && "justify-center py-2 px-0 gap-0",
        )}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={collapsed ? `Account: ${user.name}` : undefined}
        title={collapsed ? user.name : undefined}
      >
        {/* Violet halo ties the avatar to the brand accent. */}
        <Avatar
          name={user.name}
          src={user.avatarUrl}
          size={36}
          className="shadow-[0_0_0_2px_var(--rail-bg-mid),0_0_0_4px_var(--color-accent-tint-border),0_3px_8px_-2px_rgba(0,0,0,0.5)]"
        />
        <span className={cn("flex-1 min-w-0", collapsed && "hidden")}>
          <span
            className={cn(
              "block text-[0.8125rem] font-semibold tracking-[-0.005em]",
              "text-rail-text overflow-hidden text-ellipsis whitespace-nowrap",
            )}
          >
            {user.name}
          </span>
          <span
            className={cn(
              "block mt-px text-[0.625rem] font-semibold tracking-[0.06em]",
              "uppercase text-rail-text-dim",
              "overflow-hidden text-ellipsis whitespace-nowrap",
            )}
          >
            {user.designation}
          </span>
        </span>
        <Icon
          name="keyboard_arrow_up"
          className={cn(
            "[--icon-size:18px] shrink-0 text-rail-text-dim",
            "transition-transform duration-[260ms] ease-out-expo",
            isOpen && "rotate-180",
            collapsed && "hidden",
          )}
        />
      </button>
    </div>
  );
}
