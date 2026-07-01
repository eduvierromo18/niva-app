import type { ReactNode } from "react";
import { Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

type AuroraInsightCardProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  tone?: "info" | "success" | "warning";
  className?: string;
};

export function AuroraInsightCard({ title, description, icon, tone = "info", className }: AuroraInsightCardProps) {
  return (
    <article className={cn("rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]", className)}>
      <div className="flex gap-4">
        <div className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          tone === "info" && "bg-[#EFF6FF] text-[#2563EB]",
          tone === "success" && "bg-[#ECFDF5] text-[#10B981]",
          tone === "warning" && "bg-[#FFFBEB] text-[#F59E0B]",
        )}>
          {icon ?? <Lightbulb className="h-5 w-5" />}
        </div>
        <div>
          <h3 className="text-base font-bold text-[#111827]">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-[#6B7280]">{description}</p>
        </div>
      </div>
    </article>
  );
}
