import type { LucideIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { DeltaIndicator } from "@/components/finance/delta-indicator";
import type { MetricDelta } from "@/lib/analytics";

export function MetricCard({
  label,
  value,
  delta,
  icon: Icon,
  percent,
}: {
  label: string;
  value: number | null;
  // undefined → no delta area (e.g. still loading); null → "Sin mes anterior aún".
  delta?: MetricDelta;
  icon: LucideIcon;
  percent?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--niva-color-accent-surface)] text-[var(--niva-color-accent)]">
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[var(--niva-color-muted)]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[var(--niva-color-foreground)]">
            {value === null ? "—" : percent ? `${value.toFixed(1)}%` : formatCurrency(value)}
          </p>
          {delta !== undefined ? (
            <div className="mt-3">
              <DeltaIndicator delta={delta} />
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
