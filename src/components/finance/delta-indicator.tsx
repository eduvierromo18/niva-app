import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MetricDelta } from "@/lib/analytics";

// Renders a KPI's month-over-month delta. Color is driven by `favorable`
// (green/red), decoupled from the arrow, which shows the raw direction — so an
// expense that dropped reads as a green down-arrow. Direction-only metrics omit
// the percentage. A null delta renders the calm "Sin mes anterior aún" note.
export function DeltaIndicator({ delta, label = "vs. mes anterior" }: { delta: MetricDelta; label?: string }) {
  if (delta === null) {
    return <span className="text-xs font-medium text-[var(--niva-color-muted)]">Sin mes anterior aún</span>;
  }
  if (delta.direction === "flat") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--niva-color-muted)]">
        <ArrowRight className="h-3.5 w-3.5" />
        <span className="font-medium">sin cambio</span>
      </span>
    );
  }
  const Arrow = delta.direction === "up" ? ArrowUp : ArrowDown;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", delta.favorable ? "text-[var(--niva-color-accent)]" : "text-[var(--niva-color-danger)]")}>
      <Arrow className="h-3.5 w-3.5" />
      {delta.percent !== null ? <span>{Math.abs(delta.percent).toFixed(1)}%</span> : null}
      <span className="font-medium text-[var(--niva-color-muted)]">{label}</span>
    </span>
  );
}
