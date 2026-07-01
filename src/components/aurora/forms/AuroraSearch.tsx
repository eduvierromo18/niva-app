import type { InputHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

export function AuroraSearch({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="relative block">
      <span className="sr-only">Buscar</span>
      <Search className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#D1D5DB]" />
      <input
        type="search"
        className={cn(
          "h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 pr-11 text-sm text-[#111827] shadow-[0_4px_12px_rgba(0,0,0,0.05)] placeholder:text-[#D1D5DB]",
          auroraStyles.focus,
          className,
        )}
        {...props}
      />
    </label>
  );
}
