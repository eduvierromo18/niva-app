import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendBadge } from "@/components/finance/trend-badge";

export function MetricCard({
  label,
  value,
  delta,
  trend,
  icon: Icon,
  percent,
}: {
  label: string;
  value: number | null;
  delta?: number;
  trend?: string;
  icon: LucideIcon;
  percent?: boolean;
}) {
  const hasTrend = trend === "up" || trend === "down";
  const positive = trend === "up";

  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", hasTrend && !positive ? "bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-danger)]" : "bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]")}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--niva-color-muted)]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[var(--niva-color-foreground)]">
            {value === null ? "—" : percent ? `${value.toFixed(1)}%` : formatCurrency(value)}
          </p>
          {delta !== undefined && hasTrend ? (
            <div className="mt-3">
              <TrendBadge value={delta} trend={positive ? "up" : "down"} />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
