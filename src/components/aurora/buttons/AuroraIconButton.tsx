import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

type AuroraIconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  variant?: "default" | "primary" | "ghost";
};

export function AuroraIconButton({ icon, label, variant = "default", className, ...props }: AuroraIconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-200 ease-out",
        auroraStyles.focus,
        variant === "default" && "border border-[#E5E7EB] bg-white text-[#6B7280] shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:text-[#111827]",
        variant === "primary" && "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.26)] hover:bg-[#1D4ED8]",
        variant === "ghost" && "bg-transparent text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]",
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
