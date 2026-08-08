import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's stock scales. This theme adds its own
 * font sizes (text-label-sm, text-body-md, …), and `text-` is ambiguous: it
 * prefixes both font size and text colour. Without being told otherwise,
 * tailwind-merge files `text-label-sm` under text-colour and then drops it as
 * a conflict the moment a real colour like `text-on-surface-variant` follows —
 * silently rendering the element at its inherited size.
 *
 * Registering the custom sizes under the font-size group keeps size and colour
 * in separate conflict groups, so both survive.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-lg",
            "display-sm",
            "headline-md",
            "body-lg",
            "body-md",
            "label-sm",
            "label-xs",
          ],
        },
      ],
      // Same ambiguity for the theme's named shadows, durations and easing:
      // registered so they are never mistaken for a colour or left ungrouped.
      shadow: [{ shadow: ["card", "panel", "focus-primary", "focus-outline"] }],
      duration: [{ duration: ["fast", "base"] }],
      ease: [{ ease: ["out-expo"] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
