import { colors } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";

export const surfaces = {
  app: {
    background: colors.semantic.background,
    foreground: colors.semantic.foreground,
  },
  panel: {
    background: colors.white,
    borderColor: colors.semantic.border,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: radius.lg,
    boxShadow: shadows.none,
  },
  card: {
    background: colors.white,
    borderColor: colors.semantic.border,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: radius.xl,
    boxShadow: shadows.xs,
  },
  elevatedCard: {
    background: colors.white,
    borderColor: colors.semantic.border,
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: radius.xl,
    boxShadow: shadows.sm,
  },
  subtle: {
    background: colors.neutral[100],
    borderColor: colors.neutral[200],
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: radius.lg,
    boxShadow: shadows.none,
  },
} as const;

export type NivaSurfaces = typeof surfaces;
