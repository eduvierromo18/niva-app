import { colors, motion, radius, shadows, spacing, surfaces, typography } from "@/design/tokens";

export const nivaTokens = {
  colors,
  motion,
  radius,
  shadows,
  spacing,
  surfaces,
  typography,
} as const;

export const nivaFocusRing =
  "outline-none focus-visible:ring-2 focus-visible:ring-[var(--niva-color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--niva-color-background)]";

export const nivaDisabledState = "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

export const nivaTransition = "transition-colors duration-[var(--niva-motion-base)] ease-[var(--niva-ease-standard)]";

export type NivaTokens = typeof nivaTokens;
