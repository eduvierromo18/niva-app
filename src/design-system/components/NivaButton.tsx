import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { nivaDisabledState, nivaFocusRing, nivaTransition } from "@/design-system/tokens";
import type { NivaSize } from "@/design-system/types";

export type NivaButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export type NivaButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: NivaButtonVariant;
  size?: NivaSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  loading?: boolean;
};

const sizeClasses: Record<NivaSize, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-7 text-base",
};

const variantClasses: Record<NivaButtonVariant, string> = {
  primary:
    "bg-[var(--niva-color-accent)] text-[var(--niva-color-accent-foreground)] shadow-[var(--niva-shadow-sm)] hover:bg-[var(--niva-color-accent-hover)]",
  secondary:
    "border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] text-[var(--niva-color-foreground)] shadow-[var(--niva-shadow-xs)] hover:bg-[var(--niva-color-muted-surface)]",
  ghost: "bg-transparent text-[var(--niva-color-muted)] hover:bg-[var(--niva-color-muted-surface)] hover:text-[var(--niva-color-foreground)]",
  danger:
    "bg-[var(--niva-color-danger-surface)] text-[var(--niva-color-danger)] shadow-[var(--niva-shadow-xs)] hover:bg-[var(--niva-color-danger-surface-strong)]",
};

export const NivaButton = forwardRef<HTMLButtonElement, NivaButtonProps>(function NivaButton(
  {
    variant = "primary",
    size = "md",
    iconLeft,
    iconRight,
    loading = false,
    children,
    className,
    disabled,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 rounded-[var(--niva-radius-md)] font-semibold",
        nivaTransition,
        nivaFocusRing,
        nivaDisabledState,
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : iconLeft}
      {children}
      {iconRight}
    </button>
  );
});
