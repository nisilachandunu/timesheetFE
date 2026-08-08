import { Icon } from "../Icon";
import { cn } from "@/lib/cn";

export interface LogoProps {
  eyebrow?: string;
  className?: string;
}

export function Logo({ eyebrow = "Enterprise Edition", className }: LogoProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-[clamp(8px,1.4vh,12px)]",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center shrink-0 rounded-lg text-brand-text",
          "w-[clamp(34px,5vh,48px)] h-[clamp(34px,5vh,48px)]",
          "bg-[rgba(255,255,255,0.06)]",
          "border border-solid border-[rgba(255,255,255,0.08)]",
          "backdrop-blur-[12px]",
        )}
      >
        <Icon name="history" className="[--icon-size:clamp(16px,2.6vh,22px)]" />
      </span>
      <div>
        <span
          className={cn(
            "text-[clamp(1.125rem,min(2vw,3.2vh),1.75rem)] font-bold",
            "tracking-[-0.02em] leading-[1.15] text-brand-text",
            "[text-shadow:0_4px_12px_rgba(0,0,0,0.25)]",
          )}
        >
          TimesheetOS
        </span>
        {eyebrow && (
          <span
            className={cn(
              "block text-[clamp(0.5625rem,1.4vh,0.75rem)] font-semibold",
              "tracking-[0.12em] uppercase text-[rgba(221,214,254,0.8)]",
            )}
          >
            {eyebrow}
          </span>
        )}
      </div>
    </div>
  );
}
