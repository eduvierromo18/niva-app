export const motion = {
  duration: {
    instant: "0ms",
    fast: "120ms",
    base: "180ms",
    slow: "260ms",
  },
  easing: {
    standard: "cubic-bezier(0.2, 0, 0, 1)",
    entrance: "cubic-bezier(0, 0, 0.2, 1)",
    exit: "cubic-bezier(0.4, 0, 1, 1)",
  },
  transition: {
    colors: "color 180ms cubic-bezier(0.2, 0, 0, 1), background-color 180ms cubic-bezier(0.2, 0, 0, 1), border-color 180ms cubic-bezier(0.2, 0, 0, 1)",
    surface: "box-shadow 180ms cubic-bezier(0.2, 0, 0, 1), transform 180ms cubic-bezier(0.2, 0, 0, 1)",
  },
} as const;

export type NivaMotion = typeof motion;
