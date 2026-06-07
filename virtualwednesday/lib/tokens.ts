/**
 * Design tokens (TS mirror of globals.css :root).
 * Use these for Framer Motion values/durations so motion stays on-brand.
 * Source of truth for visual values is the VirtualWednesday brand style guide.
 */

export const color = {
  bg: "#f4f3f0",
  black: "#000000",
  onDark: "#ffffff",
  subtitle: "#2b2b2b",
  navLink: "#292928",
  footerLink: "#1f1f1f",
  accentLink: "#1a365d",
  bgRaised: "#faf9f6",
  hairline: "#e3e1db",
} as const;

export const radius = {
  pill: 999,
} as const;

export const layout = {
  maxWidth: 1044,
  padInline: 32,
  padInlineMobile: 20,
  breakpoint: 865,
} as const;

/** Master "ease-out-expo" feel used across reveals and the Overture. */
export const easeReveal = [0.22, 1, 0.36, 1] as const;

export const motionTokens = {
  easeReveal,
  hoverLink: 0.7,
  hoverButton: 0.85,
  // Overture timeline (seconds)
  overture: {
    markIn: 0.8,
    markInDelay: 0.15,
    hold: 0.55,
    lift: 0.7,
    liftDelay: 1.5,
    total: 2.4,
  },
  // Section reveal
  reveal: { duration: 0.6, y: 8 },
} as const;
