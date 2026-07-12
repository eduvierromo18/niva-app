import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[var(--niva-radius-xl)] border border-dashed border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-muted)]">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-[var(--niva-color-foreground)]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--niva-color-muted)]">{description}</p>
      {actionLabel && onAction ? <Button type="button" className="mt-4" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
