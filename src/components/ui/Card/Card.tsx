import type { ReactNode } from "react";
import { Icon } from "../Icon";
import { cn } from "@/lib/cn";

export interface CardProps {
  title?: string;
  description?: string;
  /** Material Symbols ligature name shown in the header tile. */
  icon?: string;
  /** Trailing header content, e.g. a status chip. */
  headerAside?: ReactNode;
  /** Rendered in a tinted action bar under the body. */
  footer?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * The card's gutter — clamp(18px,2.4vw,26px) — is repeated literally in each
 * class below. Tailwind only generates utilities it can see as complete
 * strings in the source, so composing them from a constant would emit nothing.
 */
export function Card({
  title,
  description,
  icon,
  headerAside,
  footer,
  children,
  className,
}: CardProps) {
  const hasHeader = Boolean(title || icon);

  return (
    <section
      className={cn(
        "bg-surface-lowest border border-solid border-hairline",
        "rounded-[18px] shadow-card overflow-hidden",
        className,
      )}
    >
      {hasHeader && (
        <header className="flex items-start gap-[14px] p-[clamp(18px,2.4vw,26px)]">
          {icon && (
            <span
              className={cn(
                "flex items-center justify-center w-10 h-10 shrink-0",
                "rounded-[12px] bg-accent-tint text-accent-text",
                "border border-solid border-accent-tint-border",
              )}
            >
              <Icon name={icon} size={21} weight={500} />
            </span>
          )}
          <div className="min-w-0">
            {title && (
              <h2 className="text-[1.0625rem] font-bold tracking-[-0.015em] text-on-background">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-sm leading-normal text-on-surface-variant">
                {description}
              </p>
            )}
          </div>
          {headerAside && <div className="ml-auto shrink-0">{headerAside}</div>}
        </header>
      )}

      {children && (
        <div
          className={cn(
            "pt-0 px-[clamp(18px,2.4vw,26px)] pb-[clamp(18px,2.4vw,26px)]",
            // When a header is present the body sits under a hairline.
            hasHeader &&
              "pt-[clamp(18px,2.4vw,26px)] px-0 mx-[clamp(18px,2.4vw,26px)] border-t border-solid border-hairline-faint",
          )}
        >
          {children}
        </div>
      )}

      {footer && (
        <footer
          className={cn(
            "flex items-center justify-end gap-2.5",
            "py-4 px-[clamp(18px,2.4vw,26px)]",
            "bg-surface-low border-t border-solid border-hairline-faint",
          )}
        >
          {footer}
        </footer>
      )}
    </section>
  );
}
