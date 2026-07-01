import type { InputHTMLAttributes } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

type AuroraDatePickerProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
};

export function AuroraDatePicker({ label, className, ...props }: AuroraDatePickerProps) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-[#374151]">{label}</span> : null}
      <span className="relative block">
        <input
          type="date"
          className={cn(
            "h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 pr-11 text-sm text-[#111827] shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
            auroraStyles.focus,
            className,
          )}
          {...props}
        />
        <CalendarDays className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
      </span>
    </label>
  );
}
