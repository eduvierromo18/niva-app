import { colors, motion, radius, shadows, spacing, surfaces, typography } from "./tokens";

export const nivaTheme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  motion,
  surfaces,
} as const;

export type NivaTheme = typeof nivaTheme;
