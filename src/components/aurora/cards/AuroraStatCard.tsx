import type { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type AuroraStatCardProps = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  className?: string;
};

export function AuroraStatCard({ label, value, delta, trend = "neutral", icon, className }: AuroraStatCardProps) {
  const positive = trend === "up";
  const negative = trend === "down";

  return (
    <article className={cn("rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-[#6B7280]">{label}</p>
          <p className="mt-2 text-2xl font-bold text-[#111827]">{value}</p>
        </div>
        {icon ? <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]">{icon}</div> : null}
      </div>
      {delta ? (
        <p className={cn("mt-4 flex items-center gap-1 text-xs font-semibold", positive && "text-[#10B981]", negative && "text-[#EF4444]", trend === "neutral" && "text-[#6B7280]")}>
          {positive ? <TrendingUp className="h-3.5 w-3.5" /> : null}
          {negative ? <TrendingDown className="h-3.5 w-3.5" /> : null}
          {delta}
        </p>
      ) : null}
    </article>
  );
}
