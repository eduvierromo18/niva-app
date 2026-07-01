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
  value: number;
  delta: number;
  trend: string;
  icon: LucideIcon;
  percent?: boolean;
}) {
  const positive = trend === "up";

  return (
    <Card>
      <CardContent className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 items-center justify-center rounded-full", positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600")}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-zinc-50">
            {percent ? `${value.toFixed(1)}%` : formatCurrency(value)}
          </p>
          <div className="mt-3">
            <TrendBadge value={delta} trend={positive ? "up" : "down"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
