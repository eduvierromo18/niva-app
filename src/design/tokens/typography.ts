export const typography = {
  fontFamily: {
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    display: '"Manrope", "Inter", ui-sans-serif, system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace',
    brand: '"Archivo", "Inter", ui-sans-serif, system-ui, sans-serif',
  },
  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: "0.6875rem",
    sm: "0.8125rem",
    md: "0.9375rem",
    lg: "1.125rem",
    xl: "1.375rem",
    "2xl": "1.75rem",
    "3xl": "2.25rem",
    "4xl": "3rem",
  },
  lineHeight: {
    tight: "1.08",
    snug: "1.3",
    normal: "1.55",
    relaxed: "1.7",
  },
  letterSpacing: {
    display: "-0.035em",
    heading: "-0.025em",
    normal: "0",
    eyebrow: "0.14em",
  },
  textStyle: {
    display: {
      fontFamily: '"Manrope", "Inter", ui-sans-serif, system-ui, sans-serif',
      fontSize: "3rem",
      lineHeight: "1.08",
      fontWeight: 700,
      letterSpacing: "-0.035em",
    },
    h1: {
      fontFamily: '"Manrope", "Inter", ui-sans-serif, system-ui, sans-serif',
      fontSize: "2.25rem",
      lineHeight: "1.08",
      fontWeight: 700,
      letterSpacing: "-0.035em",
    },
    h2: {
      fontFamily: '"Manrope", "Inter", ui-sans-serif, system-ui, sans-serif',
      fontSize: "1.75rem",
      lineHeight: "1.15",
      fontWeight: 600,
      letterSpacing: "-0.03em",
    },
    h3: {
      fontFamily: '"Manrope", "Inter", ui-sans-serif, system-ui, sans-serif',
      fontSize: "1.375rem",
      lineHeight: "1.25",
      fontWeight: 600,
      letterSpacing: "-0.025em",
    },
    body: {
      fontSize: "0.9375rem",
      lineHeight: "1.55",
      fontWeight: 400,
      letterSpacing: "0",
    },
    bodySmall: {
      fontSize: "0.8125rem",
      lineHeight: "1.55",
      fontWeight: 400,
      letterSpacing: "0",
    },
    label: {
      fontSize: "0.8125rem",
      lineHeight: "1.35",
      fontWeight: 600,
      letterSpacing: "0",
    },
    eyebrow: {
      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
      fontSize: "0.6875rem",
      lineHeight: "1",
      fontWeight: 500,
      letterSpacing: "0.14em",
    },
  },
} as const;

export type NivaTypography = typeof typography;
