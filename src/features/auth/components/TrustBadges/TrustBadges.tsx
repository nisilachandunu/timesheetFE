import type { TrustBadge } from "../../types";
import { cn } from "@/lib/cn";

const BADGES: TrustBadge[] = [
  { label: "99.9% Uptime", highlighted: true },
  { label: "SOC 2 Certified" },
  { label: "GDPR Ready" },
];

export function TrustBadges() {
  return (
    <ul className="flex flex-wrap gap-[clamp(6px,1.2vh,12px)] list-none">
      {BADGES.map((badge) => (
        <li
          key={badge.label}
          className={cn(
            "inline-flex items-center gap-2 rounded-full",
            "py-[clamp(4px,0.9vh,8px)] px-[clamp(10px,1.8vh,16px)]",
            "bg-[rgba(255,255,255,0.06)]",
            "border border-solid border-[rgba(255,255,255,0.08)]",
            "backdrop-blur-[12px]",
            "text-[clamp(0.625rem,1.4vh,0.75rem)] font-semibold",
            "whitespace-nowrap text-brand-text",
          )}
        >
          <span
            className={cn(
              "w-1.5 h-1.5 rounded-full shrink-0",
              badge.highlighted
                ? "bg-success shadow-[0_0_8px_var(--color-success)]"
                : "bg-[rgba(255,255,255,0.7)]",
            )}
          />
          {badge.label}
        </li>
      ))}
    </ul>
  );
}
