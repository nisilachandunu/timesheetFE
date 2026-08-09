import type { Config } from "tailwindcss";

/**
 * The design tokens live in src/app/globals.css as custom properties that flip
 * under [data-theme="dark"]. The theme below points at those variables rather
 * than copying their values, so a single token edit still drives both themes.
 *
 * Because the tokens hold whole colours (hex / rgba) rather than raw channels,
 * Tailwind's opacity modifiers (bg-primary/50) do not apply to them. That is by
 * design: the palette already ships explicit alpha tokens — hairline, accent
 * tint, focus ring — which are tuned for contrast and should be used instead.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],

  // Matches the attribute the inline script in app/layout.tsx stamps on <html>
  // before first paint. Tailwind's `class` strategy would miss it and let the
  // page flash light before hydration.
  darkMode: ["selector", '[data-theme="dark"]'],

  // globals.css already carries a deliberately tuned reset (button chrome, `a`
  // colour inheritance, :focus-visible ring, `font: inherit` on controls).
  // Preflight would fight it, so the existing reset stays the single source.
  corePlugins: { preflight: false },

  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-container": "var(--color-primary-container)",
        "on-primary": "var(--color-on-primary)",
        secondary: "var(--color-secondary)",
        "secondary-container": "var(--color-secondary-container)",
        "on-secondary": "var(--color-on-secondary)",
        "surface-tint": "var(--color-surface-tint)",
        "accent-text": "var(--color-accent-text)",

        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-lowest": "var(--color-surface-container-lowest)",
        "surface-low": "var(--color-surface-container-low)",
        "surface-container": "var(--color-surface-container)",
        "surface-high": "var(--color-surface-container-high)",
        "surface-highest": "var(--color-surface-container-highest)",

        "on-background": "var(--color-on-background)",
        "on-surface": "var(--color-on-surface)",
        "on-surface-variant": "var(--color-on-surface-variant)",

        outline: "var(--color-outline)",
        "outline-variant": "var(--color-outline-variant)",

        "hairline-faint": "var(--color-hairline-faint)",
        hairline: "var(--color-hairline)",
        "hairline-strong": "var(--color-hairline-strong)",

        "accent-tint-faint": "var(--color-accent-tint-faint)",
        "accent-tint": "var(--color-accent-tint)",
        "accent-tint-border": "var(--color-accent-tint-border)",

        "focus-ring": "var(--color-focus-ring)",
        "scrollbar-thumb": "var(--color-scrollbar-thumb)",
        "scrollbar-thumb-hover": "var(--color-scrollbar-thumb-hover)",

        error: "var(--color-error)",
        "on-error": "var(--color-on-error)",
        "error-ring": "var(--color-error-ring)",
        success: "var(--color-success)",
        "success-solid": "var(--color-success-solid)",
        "success-text": "var(--color-success-text)",
        "success-tint": "var(--color-success-tint)",
        "success-tint-border": "var(--color-success-tint-border)",

        "brand-canvas": "var(--color-brand-canvas)",
        "brand-text": "var(--color-brand-text)",
        "brand-text-muted": "var(--color-brand-text-muted)",
        "brand-text-subtle": "var(--color-brand-text-subtle)",

        // The sidebar rail is a dark slab in both themes, so it carries its own
        // palette rather than the surface tokens.
        "rail-top": "var(--rail-bg-top)",
        "rail-mid": "var(--rail-bg-mid)",
        "rail-bottom": "var(--rail-bg-bottom)",
        "rail-bloom": "var(--rail-bloom)",
        "rail-bloom-alt": "var(--rail-bloom-alt)",
        "rail-border": "var(--rail-border)",
        "rail-text": "var(--rail-text)",
        "rail-text-muted": "var(--rail-text-muted)",
        "rail-text-dim": "var(--rail-text-dim)",
        "rail-hover": "var(--rail-hover)",
        "rail-raised": "var(--rail-raised)",
        "rail-popover": "var(--rail-popover)",
        "rail-tooltip": "var(--rail-tooltip)",
      },

      // The token scale (4/8/12/16/20/24/32/40/48/64px) already matches
      // Tailwind's default spacing rhythm at a 16px root, so p-1..p-16 land on
      // the same pixels and no override is needed here.
      spacing: {
        "margin-mobile": "var(--margin-mobile)",
        "margin-desktop": "var(--margin-desktop)",
      },

      // These DO differ from Tailwind's defaults (md is 0.5rem here, not
      // 0.375rem), so they are overridden rather than added.
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        "focus-primary": "var(--shadow-focus-primary)",
        "focus-outline": "var(--shadow-focus-outline)",
        card: "var(--shadow-card)",
        panel: "var(--shadow-panel)",
      },

      fontFamily: {
        sans: "var(--font-sans)",
      },

      fontSize: {
        "display-lg": "var(--text-display-lg)",
        "display-sm": "var(--text-display-sm)",
        "headline-md": "var(--text-headline-md)",
        "body-lg": "var(--text-body-lg)",
        "body-md": "var(--text-body-md)",
        "label-sm": "var(--text-label-sm)",
        "label-xs": "var(--text-label-xs)",
      },

      transitionTimingFunction: {
        "out-expo": "var(--ease-out-expo)",
      },

      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
      },

      keyframes: {
        spin: {
          to: { transform: "rotate(360deg)" },
        },
        blob: {
          "0%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0, 0) scale(1)" },
        },
        "slide-up-fade": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "header-entrance": {
          "0%": { opacity: "0", transform: "translateY(-12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "action-pop": {
          "0%": { opacity: "0", transform: "translate3d(0, -4px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },

        // Three menus each had their own `menuIn`, kept distinct by CSS Modules
        // scoping. They are genuinely different curves, so they keep separate
        // names here rather than being collapsed into one.
        "menu-in-profile": {
          from: { opacity: "0", transform: "translateY(10px) scale(0.97)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "menu-in-select": {
          from: { opacity: "0", transform: "translateY(-6px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "menu-in-columns": {
          from: { opacity: "0", transform: "translateY(-8px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },

        "backdrop-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "panel-in": {
          from: { opacity: "0", transform: "translateY(14px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "popover-in": {
          from: { opacity: "0", transform: "translateY(-6px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "row-reveal": {
          "0%": { opacity: "0", transform: "translate3d(0, 5px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "head-reveal": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "icon-fade-in": {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "foot-entrance": {
          "0%": { opacity: "0", transform: "translate3d(0, 4px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "shimmer-wave": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        "panel-entrance": {
          "0%": { opacity: "0", transform: "translate3d(0, 10px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "border-light-ray": {
          "0%": { left: "-30%", opacity: "0" },
          "20%": { opacity: "1" },
          "80%": { opacity: "0.8" },
          "100%": { left: "130%", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow:
              "0 0 0 0 rgba(106, 57, 219, 0.6), 0 0 0 3px var(--color-accent-tint)",
          },
          "50%": {
            boxShadow:
              "0 0 0 5px rgba(106, 57, 219, 0), 0 0 0 3px var(--color-accent-tint)",
          },
        },
        "toolbar-entrance": {
          from: { opacity: "0", transform: "translate3d(0, -6px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "label-slide": {
          "0%": { opacity: "0", transform: "translate3d(-6px, 0, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "chip-pop": {
          "0%": { opacity: "0", transform: "translate3d(0, 2px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "total-slide": {
          "0%": { opacity: "0", transform: "translate3d(0, -4px, 0)" },
          "100%": { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
      },

      animation: {
        spin: "spin 0.6s linear infinite",
        blob: "blob 15s infinite alternate",
        "slide-up-fade": "slide-up-fade 0.6s var(--ease-out-expo) forwards",
        "header-entrance": "header-entrance 450ms var(--ease-out-expo) backwards",
        "action-pop": "action-pop 420ms var(--ease-out-expo) backwards",
        "menu-in-profile": "menu-in-profile 0.2s var(--ease-out-expo)",
        "menu-in-select": "menu-in-select 0.16s var(--ease-out-expo)",
        "menu-in-columns": "menu-in-columns 0.16s var(--ease-out-expo)",
        "backdrop-in": "backdrop-in 180ms ease-out",
        "panel-in": "panel-in 220ms var(--ease-out-expo)",
        "popover-in": "popover-in 0.16s var(--ease-out-expo)",
        "row-reveal": "row-reveal 420ms var(--ease-out-expo) backwards",
        "head-reveal": "head-reveal 380ms ease backwards",
        "head-reveal-delayed": "head-reveal 420ms ease 160ms backwards",
        "icon-fade-in": "icon-fade-in 320ms var(--ease-out-expo) backwards",
        "foot-entrance": "foot-entrance 380ms var(--ease-out-expo) backwards",
        "shimmer-wave":
          "shimmer-wave 1.6s cubic-bezier(0.4, 0, 0.2, 1) infinite",
        "panel-entrance":
          "panel-entrance 500ms cubic-bezier(0.16, 1, 0.3, 1) backwards",
        "border-light-ray":
          "border-light-ray 1.4s cubic-bezier(0.4, 0, 0.2, 1) 150ms forwards",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "toolbar-entrance":
          "toolbar-entrance 420ms var(--ease-out-expo) 60ms backwards",
        "label-slide": "label-slide 420ms var(--ease-out-expo) 120ms backwards",
        "chip-pop": "chip-pop 450ms var(--ease-out-expo) 200ms backwards",
        "total-slide": "total-slide 440ms var(--ease-out-expo) 160ms backwards",
      },
    },
  },

  plugins: [],
};

export default config;
