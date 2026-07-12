import type { LucideIcon } from "lucide-react";

export function AlertCard({
  icon: Icon,
  title,
  description,
  tone = "info",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "info" | "warning" | "danger";
}) {
  const toneClass = {
    info: "bg-blue-50 text-blue-700",
    warning: "bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-muted)]",
    danger: "bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-danger)]",
  }[tone];

  return (
    <article className="flex items-start gap-3 border-b border-[var(--niva-color-border)] py-4 last:border-0">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-[var(--niva-color-foreground)]">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--niva-color-muted)]">{description}</p>
      </div>
    </article>
  );
}
