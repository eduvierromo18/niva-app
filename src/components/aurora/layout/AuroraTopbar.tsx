import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AuroraSearch } from "@/components/aurora/forms/AuroraSearch";

type AuroraTopbarProps = {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
  className?: string;
};

export function AuroraTopbar({ title, subtitle, searchPlaceholder = "Buscar registros...", actions, className }: AuroraTopbarProps) {
  return (
    <header className={cn("flex flex-col gap-4 rounded-[24px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] 2xl:flex-row 2xl:items-center 2xl:justify-between", className)}>
      <div className="min-w-0">
        {title ? <h1 className="text-2xl font-semibold text-[#111827]">{title}</h1> : null}
        {subtitle ? <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p> : null}
      </div>
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
        <div className="min-w-0 flex-1 md:w-[420px] md:flex-none 2xl:w-[360px]">
          <AuroraSearch placeholder={searchPlaceholder} className="h-10 bg-[#F9FAFB] shadow-none" />
        </div>
        {actions}
      </div>
    </header>
  );
}
