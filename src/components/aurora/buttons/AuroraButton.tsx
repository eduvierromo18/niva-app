import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

type AuroraButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
};

export function AuroraButton({ variant = "primary", size = "md", icon, children, className, ...props }: AuroraButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50",
        auroraStyles.focus,
        size === "sm" && "h-9 px-4 text-xs",
        size === "md" && "h-10 px-5 text-sm",
        size === "lg" && "h-11 px-7 text-base",
        variant === "primary" && "bg-[#047857] text-white shadow-[0_4px_12px_rgba(4,120,87,0.22)] hover:bg-[#065F46]",
        variant === "secondary" && "border border-[#E5E7EB] bg-white text-[#2563EB] shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:bg-[#EFF6FF]",
        variant === "ghost" && "bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]",
        variant === "danger" && "bg-[#FEF2F2] text-[#EF4444] shadow-[0_4px_12px_rgba(239,68,68,0.10)] hover:bg-[#FEE2E2]",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
