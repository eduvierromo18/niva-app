import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickActionButton({
  icon: Icon,
  label,
  description,
  tone = "emerald",
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  tone?: "emerald" | "blue" | "amber" | "slate";
  onClick?: () => void;
}) {
  const toneClass = {
    emerald: "bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-muted)]",
    slate: "bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-body)]",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-20 items-center gap-3 rounded-[var(--niva-radius-xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] p-4 text-left shadow-[var(--niva-shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--niva-shadow-md)]"
    >
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", toneClass)}>
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-bold text-[var(--niva-color-foreground)]">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-[var(--niva-color-muted)]">{description}</span> : null}
      </span>
    </button>
  );
}
