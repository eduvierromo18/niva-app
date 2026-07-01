import type { ReactNode } from "react";
import { BriefcaseBusiness } from "lucide-react";
import { cn } from "@/lib/utils";

type AuroraAccountCardProps = {
  institution: string;
  account: string;
  balance: string;
  meta?: string;
  icon?: ReactNode;
  status?: "active" | "muted";
  className?: string;
};

export function AuroraAccountCard({ institution, account, balance, meta, icon, status = "active", className }: AuroraAccountCardProps) {
  return (
    <article className={cn("rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]", className)}>
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#ECFDF5] text-[#111827]">
          {icon ?? <BriefcaseBusiness className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="truncate text-sm font-bold text-[#111827]">{institution}</p>
            <span className={cn("h-2 w-2 rounded-full", status === "active" ? "bg-[#10B981]" : "bg-[#D1D5DB]")} />
          </div>
          <p className="mt-1 text-xs font-medium text-[#6B7280]">{account}</p>
          <p className="mt-3 text-xl font-bold text-[#111827]">{balance}</p>
          {meta ? <p className="mt-1 text-sm text-[#6B7280]">{meta}</p> : null}
        </div>
      </div>
    </article>
  );
}
