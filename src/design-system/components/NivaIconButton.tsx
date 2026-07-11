import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { nivaDisabledState, nivaFocusRing, nivaTransition } from "@/design-system/tokens";
import type { NivaSize } from "@/design-system/types";
import type { NivaButtonVariant } from "@/design-system/components/NivaButton";

export type NivaIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  variant?: Exclude<NivaButtonVariant, "danger"> | "danger";
  size?: NivaSize;
};

const sizeClasses: Record<NivaSize, string> = {
  sm: "h-9 w-9",
  md: "h-10 w-10",
  lg: "h-11 w-11",
};

const variantClasses: Record<NonNullable<NivaIconButtonProps["variant"]>, string> = {
  primary: "bg-[var(--niva-color-accent)] text-[var(--niva-color-accent-foreground)] hover:bg-[var(--niva-color-accent-hover)]",
  secondary:
    "border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] text-[var(--niva-color-muted)] shadow-[var(--niva-shadow-xs)] hover:text-[var(--niva-color-foreground)]",
  ghost: "bg-transparent text-[var(--niva-color-muted)] hover:bg-[var(--niva-color-muted-surface)] hover:text-[var(--niva-color-foreground)]",
  danger: "bg-[var(--niva-color-danger-surface)] text-[var(--niva-color-danger)] hover:bg-[var(--niva-color-danger-surface-strong)]",
};

export const NivaIconButton = forwardRef<HTMLButtonElement, NivaIconButtonProps>(function NivaIconButton(
  { icon, label, variant = "secondary", size = "md", className, type = "button", ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[var(--niva-radius-md)]",
        nivaTransition,
        nivaFocusRing,
        nivaDisabledState,
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="inline-flex items-center justify-center">
        {icon}
      </span>
    </button>
  );
});
