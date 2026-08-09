"use client";

import { useCallback, useState, type ReactNode } from "react";
import { BrandMark, Icon, ThemeToggle } from "@/components/ui";
import { Sidebar } from "../Sidebar";
import { cn } from "@/lib/cn";
import styles from "./DashboardShell.module.css";

export interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  return (
    <div
      className={cn(
        styles.shell,
        "flex w-full overflow-hidden bg-background",
      )}
    >
      <Sidebar isOpen={isDrawerOpen} onClose={closeDrawer} />

      {/* Scrim sits below the drawer but above content on small screens. */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-[15] bg-[rgba(11,8,28,0.55)] backdrop-blur-[2px]"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Mobile top bar: hidden once the sidebar is permanently visible. */}
        <header
          className={cn(
            "hidden max-lg:flex items-center gap-3 shrink-0 py-3 px-4",
            "bg-surface-lowest",
          )}
        >
          <button
            type="button"
            className={cn(
              "inline-flex items-center justify-center w-10 h-10 rounded-md",
              "text-on-surface-variant",
              "transition-colors duration-fast ease-[ease]",
              "hover:bg-surface-container hover:text-on-background",
            )}
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open navigation"
            aria-expanded={isDrawerOpen}
          >
            <Icon name="menu" size={22} />
          </button>
          <BrandMark size={28} />
          <span className="text-base font-bold tracking-[-0.01em]">
            TimesheetOS
          </span>
          {/* Only the mobile top bar carries a toggle; on desktop it sits at
              the end of the page header's row, where it costs no height. */}
          <ThemeToggle className="ml-auto" />
        </header>

        {/* On desktop the theme toggle rides at the end of the page header's
            single row — see PageHeader. It had its own strip here, which cost
            a row of height to hold one button.

            `relative` establishes the containing block for absolutely
            positioned descendants (e.g. .sr-only text). Without it they
            resolve against the document and escape this clip, extending the
            page and producing a second scrollbar. */}
        <main
          className={cn(
            styles.content,
            "flex-1 min-h-0 overflow-y-auto relative",
            "py-[clamp(20px,3vh,40px)] px-[clamp(20px,3vw,48px)]",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
