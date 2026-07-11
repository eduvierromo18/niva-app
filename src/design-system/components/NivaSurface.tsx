import type { HTMLAttributes, ProgressHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { NivaTone } from "@/design-system/types";
import { NivaButton } from "@/design-system/components/NivaButton";

export type NivaCardProps = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

export function NivaCard({ elevated = false, className, ...props }: NivaCardProps) {
  return (
    <div
      className={cn(
        "rounded-[var(--niva-radius-xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] p-5 text-[var(--niva-color-foreground)]",
        elevated ? "shadow-[var(--niva-shadow-sm)]" : "shadow-[var(--niva-shadow-xs)]",
        className,
      )}
      {...props}
    />
  );
}

export type NivaBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: NivaTone;
};

const badgeToneClasses: Record<NivaTone, string> = {
  neutral: "bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-muted)]",
  accent: "bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]",
  success: "bg-[var(--niva-color-success-surface)] text-[var(--niva-color-success)]",
  warning: "bg-[var(--niva-color-warning-surface)] text-[var(--niva-color-warning)]",
  danger: "bg-[var(--niva-color-danger-surface)] text-[var(--niva-color-danger)]",
  info: "bg-[var(--niva-color-info-surface)] text-[var(--niva-color-info)]",
};

export function NivaBadge({ tone = "neutral", className, ...props }: NivaBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center rounded-[var(--niva-radius-full)] px-2.5 py-1 text-xs font-semibold leading-none", badgeToneClasses[tone], className)}
      {...props}
    />
  );
}

export type NivaAlertProps = HTMLAttributes<HTMLDivElement> & {
  tone?: Exclude<NivaTone, "neutral">;
  title: string;
  icon?: ReactNode;
};

const alertToneClasses: Record<Exclude<NivaTone, "neutral">, string> = {
  accent: "border-[var(--niva-color-accent)] bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]",
  success: "border-[var(--niva-color-success)] bg-[var(--niva-color-success-surface)] text-[var(--niva-color-success)]",
  warning: "border-[var(--niva-color-warning)] bg-[var(--niva-color-warning-surface)] text-[var(--niva-color-warning)]",
  danger: "border-[var(--niva-color-danger)] bg-[var(--niva-color-danger-surface)] text-[var(--niva-color-danger)]",
  info: "border-[var(--niva-color-info)] bg-[var(--niva-color-info-surface)] text-[var(--niva-color-info)]",
};

export function NivaAlert({ tone = "info", title, icon, children, className, ...props }: NivaAlertProps) {
  return (
    <div role="status" className={cn("rounded-[var(--niva-radius-lg)] border p-4", alertToneClasses[tone], className)} {...props}>
      <div className="flex gap-3">
        {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
        <div className="grid gap-1">
          <p className="text-sm font-semibold leading-snug">{title}</p>
          {children ? <div className="text-sm leading-normal text-[var(--niva-color-foreground)]">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}

export type NivaSkeletonProps = HTMLAttributes<HTMLDivElement>;

export function NivaSkeleton({ className, ...props }: NivaSkeletonProps) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-[var(--niva-radius-md)] bg-[var(--niva-color-muted-surface)]", className)} {...props} />;
}

export type NivaEmptyStateProps = HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function NivaEmptyState({ title, description, actionLabel, onAction, icon, className, ...props }: NivaEmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-[var(--niva-radius-xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] p-8 text-center text-[var(--niva-color-foreground)] shadow-[var(--niva-shadow-sm)]",
        className,
      )}
      {...props}
    >
      {icon ? (
        <div aria-hidden={true} className="flex h-16 w-16 items-center justify-center rounded-[var(--niva-radius-2xl)] bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-muted)]">
          {icon}
        </div>
      ) : null}
      <h3 className="mt-5 text-base font-bold text-[var(--niva-color-foreground)]">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-6 text-[var(--niva-color-muted)]">{description}</p>
      {actionLabel ? (
        <NivaButton className="mt-5" size="sm" onClick={onAction}>
          {actionLabel}
        </NivaButton>
      ) : null}
    </div>
  );
}

export type NivaProgressProps = ProgressHTMLAttributes<HTMLProgressElement> & {
  value: number;
  max?: number;
  label?: string;
};

export function NivaProgress({ value, max = 100, label, className, ...props }: NivaProgressProps) {
  const normalizedValue = Math.max(0, Math.min(value, max));

  return (
    <progress
      aria-label={label}
      value={normalizedValue}
      max={max}
      className={cn("niva-progress h-2 w-full overflow-hidden rounded-[var(--niva-radius-full)]", className)}
      {...props}
    />
  );
}
