"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import styles from "./InteractiveGlow.module.css";

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
      className={`${styles.area} ${className ?? ""}`}
    >
      <div ref={glowRef} className={styles.glow} aria-hidden="true" />
      {children}
    </div>
  );
}
