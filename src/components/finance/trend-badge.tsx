import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function TrendBadge({
  value,
  trend = "up",
  label = "vs. mes anterior",
}: {
  value: number;
  trend?: "up" | "down";
  label?: string;
}) {
  const positive = trend === "up";

  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", positive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
      {positive ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />}
      {Math.abs(value)}%
      <span className="font-medium text-slate-500 dark:text-zinc-400">{label}</span>
    </span>
  );
}
