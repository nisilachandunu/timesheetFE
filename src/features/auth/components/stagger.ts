/**
 * Staggered entrance shared by every auth form.
 *
 * The keyframes now live in the Tailwind theme as `slide-up-fade`. Under CSS
 * Modules each form had to declare its own copy, because module scoping
 * rewrites animation names and a globally-declared keyframe would not resolve
 * — four identical definitions. As a global utility, one definition serves all.
 *
 * Delays are written out as literal strings: Tailwind only generates classes it
 * can see in full, so an index-built `[animation-delay:${n}s]` would emit nothing.
 */
export const STAGGER = "opacity-0 animate-slide-up-fade";

export const STAGGER_DELAY = [
  "[animation-delay:0.1s]",
  "[animation-delay:0.2s]",
  "[animation-delay:0.3s]",
  "[animation-delay:0.4s]",
  "[animation-delay:0.5s]",
  "[animation-delay:0.6s]",
  "[animation-delay:0.7s]",
] as const;

/** 1-based step, matching the original `.s1`–`.s7` class names. */
export function stagger(step: number): string {
  return `${STAGGER} ${STAGGER_DELAY[Math.min(step, STAGGER_DELAY.length) - 1]}`;
}
