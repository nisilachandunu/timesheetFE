import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

export interface AvatarProps {
  /** Used for the initials fallback and the accessible label. */
  name: string;
  /** Optional image; falls back to initials when absent or not provided. */
  src?: string;
  size?: number;
  className?: string;
}

/** First letter of the first and last word, e.g. "Nisila Bambarenda" -> "NB". */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center shrink-0 overflow-hidden",
        "w-[var(--avatar-size,40px)] h-[var(--avatar-size,40px)] rounded-full",
        "bg-[linear-gradient(135deg,var(--color-secondary),var(--color-primary))]",
        "text-white text-[calc(var(--avatar-size,40px)*0.38)]",
        "font-bold tracking-[0.02em] leading-none select-none",
        className,
      )}
      style={{ "--avatar-size": `${size}px` } as CSSProperties}
      title={name}
    >
      {src ? (
        /* Avatar URLs come from arbitrary external hosts, which next/image
           would require per-host config for. */
        // eslint-disable-next-line @next/next/no-img-element
        <img className="w-full h-full object-cover" src={src} alt={name} />
      ) : (
        <span aria-hidden="true">{initialsOf(name)}</span>
      )}
    </span>
  );
}
