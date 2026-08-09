"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../Icon";
import { cn } from "@/lib/cn";

export interface DetailFieldProps {
  label: string;
  value: string;
  /** Material Symbols ligature name shown at the leading edge. */
  icon?: string;
  /** Offers a copy-to-clipboard control on hover. */
  copyable?: boolean;
}

/**
 * Presents a value the user cannot edit here. Rendering these as disabled
 * text inputs would imply editability and fail contrast, so they are shown
 * as labelled readouts instead.
 */
export function DetailField({ label, value, icon, copyable = false }: DetailFieldProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — the
      // value stays selectable, so this is a soft failure.
    }
  };

  return (
    <div
      className={cn(
        "group flex items-center gap-3 py-3 px-3.5 rounded-lg",
        "bg-surface-low",
      )}
    >
      {icon && (
        <Icon name={icon} className="[--icon-size:19px] shrink-0 text-outline" />
      )}

      <span className="min-w-0 flex-1">
        <span className="block text-[0.6875rem] font-bold tracking-[0.09em] uppercase text-outline">
          {label}
        </span>
        <span
          className={cn(
            "block mt-0.5 text-[0.9375rem] font-medium text-on-background",
            "overflow-hidden text-ellipsis whitespace-nowrap",
          )}
          title={value}
        >
          {value}
        </span>
      </span>

      {copyable && (
        <button
          type="button"
          className={cn(
            "inline-flex items-center justify-center w-8 h-8 shrink-0",
            "rounded-[9px] text-outline",
            "transition-[opacity,background-color,color] duration-[160ms] ease-[ease]",
            "opacity-0 group-hover:opacity-100 focus-visible:opacity-100",
            // Touch devices have no hover, so keep the control visible.
            "[@media(hover:none)]:opacity-100",
            copied
              ? "opacity-100 text-success-text hover:bg-success-tint hover:text-success-text"
              : "hover:bg-accent-tint hover:text-accent-text",
          )}
          onClick={handleCopy}
          aria-label={copied ? `${label} copied` : `Copy ${label}`}
        >
          <Icon name={copied ? "check" : "content_copy"} size={17} />
        </button>
      )}
    </div>
  );
}
