import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/ui";
import { cn } from "@/lib/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  /** Trailing controls, e.g. a page's primary actions. */
  actions?: ReactNode;
}

/**
 * One line: the page's name, its description, the page's own actions and the
 * theme switch. The switch lives here rather than in a strip of its own above
 * the content — that strip cost a whole row of height to hold one 38px button.
 */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header
      className={cn(
        // flex-shrink-0: never squeezed when the page it heads is a
        // full-height flex column.
        "flex items-center shrink-0 gap-3 pb-3",
        "border-b border-solid border-outline-variant",
        "animate-header-entrance motion-reduce:animate-none",
        // Narrow enough that title and actions can no longer share a line.
        "max-[720px]:items-start max-[720px]:flex-wrap",
      )}
    >
      {/* Title and description share the line, the description trailing the
          title as supporting text rather than sitting under it. */}
      <div className="flex items-baseline gap-2.5 min-w-0">
        <h1
          className={cn(
            "shrink-0 text-[clamp(1.125rem,1.5vw,1.375rem)] font-bold",
            "tracking-[-0.02em] leading-[1.25]",
          )}
        >
          {title}
        </h1>
        {description && (
          // Truncates rather than wraps: the header stays one line tall. The
          // description is the first thing to go on narrow screens.
          <p
            className={cn(
              "min-w-0 overflow-hidden text-ellipsis whitespace-nowrap",
              "text-[0.8125rem] text-on-surface-variant",
              "max-[720px]:hidden",
            )}
          >
            {description}
          </p>
        )}
      </div>

      <div
        className={cn(
          "flex items-center shrink-0 gap-2 ml-auto",
          "[&>*]:animate-action-pop motion-reduce:[&>*]:animate-none",
          "[&>*:nth-child(1)]:[animation-delay:80ms]",
          "[&>*:nth-child(2)]:[animation-delay:130ms]",
          "[&>*:nth-child(3)]:[animation-delay:180ms]",
        )}
      >
        {actions}
        {/* Set apart from the page's own actions — it belongs to the app, not
            the page. Below the desktop breakpoint the mobile top bar carries
            the toggle instead — see DashboardShell. */}
        <ThemeToggle className="ml-1 max-lg:hidden" />
      </div>
    </header>
  );
}
