import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

type AuroraSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: Array<{ label: string; value: string }>;
};

export function AuroraSelect({ label, options, className, ...props }: AuroraSelectProps) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-[#374151]">{label}</span> : null}
      <span className="relative block">
        <select
          className={cn(
            "h-11 w-full appearance-none rounded-lg border border-[#E5E7EB] bg-white px-4 pr-10 text-sm text-[#111827] shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
            auroraStyles.focus,
            className,
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
      </span>
    </label>
  );
}
