export const typography = {
  fontFamily: {
    sans: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    "4xl": "2.5rem",
  },
  lineHeight: {
    tight: "1.2",
    snug: "1.35",
    normal: "1.5",
    relaxed: "1.65",
  },
  letterSpacing: {
    normal: "0",
  },
  textStyle: {
    display: {
      fontSize: "2.5rem",
      lineHeight: "1.2",
      fontWeight: 700,
      letterSpacing: "0",
    },
    h1: {
      fontSize: "2rem",
      lineHeight: "1.2",
      fontWeight: 700,
      letterSpacing: "0",
    },
    h2: {
      fontSize: "1.5rem",
      lineHeight: "1.35",
      fontWeight: 600,
      letterSpacing: "0",
    },
    h3: {
      fontSize: "1.25rem",
      lineHeight: "1.35",
      fontWeight: 600,
      letterSpacing: "0",
    },
    body: {
      fontSize: "1rem",
      lineHeight: "1.5",
      fontWeight: 400,
      letterSpacing: "0",
    },
    bodySmall: {
      fontSize: "0.875rem",
      lineHeight: "1.5",
      fontWeight: 400,
      letterSpacing: "0",
    },
    label: {
      fontSize: "0.875rem",
      lineHeight: "1.35",
      fontWeight: 500,
      letterSpacing: "0",
    },
    caption: {
      fontSize: "0.75rem",
      lineHeight: "1.5",
      fontWeight: 500,
      letterSpacing: "0",
    },
  },
} as const;

export type NivaTypography = typeof typography;
