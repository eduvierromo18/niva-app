export const shadows = {
  none: "none",
  xs: "0 1px 2px rgb(24 24 22 / 0.04)",
  sm: "0 4px 12px rgb(24 24 22 / 0.06)",
  md: "0 10px 24px rgb(24 24 22 / 0.08)",
  focus: "0 0 0 3px rgb(63 143 91 / 0.18)",
} as const;

export type NivaShadows = typeof shadows;
