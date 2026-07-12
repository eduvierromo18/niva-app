import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

export function InsightCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <article className="flex items-start gap-3 rounded-[var(--niva-radius-xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] p-4 shadow-[var(--niva-shadow-sm)]">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[var(--niva-color-foreground)]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--niva-color-muted)]">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-[var(--niva-color-placeholder)]" />
    </article>
  );
}
