export const radius = {
  none: "0",
  sm: "0.5rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1.125rem",
  "2xl": "1.375rem",
  "3xl": "1.625rem",
  full: "9999px",
} as const;

export type NivaRadius = typeof radius;
