import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type AuroraBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "info" | "success" | "warning" | "danger" | "neutral";
};

export function AuroraBadge({ tone = "neutral", className, ...props }: AuroraBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold",
        tone === "info" && "bg-[#EFF6FF] text-[#2563EB]",
        tone === "success" && "bg-[#ECFDF5] text-[#047857]",
        tone === "warning" && "bg-[#FFFBEB] text-[#B45309]",
        tone === "danger" && "bg-[#FEF2F2] text-[#DC2626]",
        tone === "neutral" && "bg-[#F3F4F6] text-[#6B7280]",
        className,
      )}
      {...props}
    />
  );
}
