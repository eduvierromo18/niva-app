export const shadows = {
  none: "none",
  xs: "0 1px 2px rgb(16 24 40 / 0.04)",
  sm: "0 4px 12px rgb(16 24 40 / 0.06)",
  md: "0 12px 24px rgb(16 24 40 / 0.08)",
  lg: "0 24px 48px rgb(16 24 40 / 0.10)",
  focus: "0 0 0 3px rgb(30 122 78 / 0.18)",
} as const;

export type NivaShadows = typeof shadows;
