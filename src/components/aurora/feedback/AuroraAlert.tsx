import type { ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type AuroraAlertProps = {
  title: string;
  description: string;
  tone?: "success" | "warning" | "danger" | "info";
  icon?: ReactNode;
  className?: string;
};

export function AuroraAlert({ title, description, tone = "info", icon, className }: AuroraAlertProps) {
  const Icon = tone === "success" ? CheckCircle2 : tone === "warning" ? AlertTriangle : tone === "danger" ? AlertCircle : Info;

  return (
    <div className={cn(
      "flex gap-3 rounded-lg border px-4 py-3",
      tone === "success" && "border-[#BBF7D0] bg-[#ECFDF5] text-[#047857]",
      tone === "warning" && "border-[#FDE68A] bg-[#FFFBEB] text-[#B45309]",
      tone === "danger" && "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]",
      tone === "info" && "border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]",
      className,
    )}>
      <div className="mt-0.5 shrink-0">{icon ?? <Icon className="h-4 w-4" />}</div>
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="text-xs leading-5 opacity-80">{description}</p>
      </div>
    </div>
  );
}
