"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface InteractiveGlowProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps content in a surface where a soft radial glow tracks the cursor.
 * The glow is positioned imperatively so pointer movement never re-renders
 * the subtree.
 */
export function InteractiveGlow({ children, className }: InteractiveGlowProps) {
  const areaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const area = areaRef.current;
    const glow = glowRef.current;
    if (!area || !glow) return;

    const rect = area.getBoundingClientRect();
    glow.style.left = `${event.clientX - rect.left}px`;
    glow.style.top = `${event.clientY - rect.top}px`;
  };

  return (
    <div
      ref={areaRef}
      onMouseMove={handleMouseMove}
      className={cn("group relative isolate", className)}
    >
      <div
        ref={glowRef}
        className={cn(
          "absolute w-[800px] h-[800px] rounded-full z-[1] pointer-events-none",
          "bg-[radial-gradient(circle,rgba(132,85,239,0.2)_0%,transparent_60%)]",
          "-translate-x-1/2 -translate-y-1/2 mix-blend-screen",
          "opacity-0 transition-opacity duration-[0.4s] ease-[ease]",
          "group-hover:opacity-100",
          // Touch devices have no meaningful cursor position to follow.
          "[@media(hover:none)]:hidden",
        )}
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
