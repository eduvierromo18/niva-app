import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

type AuroraInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function AuroraInput({ label, className, id, ...props }: AuroraInputProps) {
  return (
    <label className="block">
      {label ? <span className="mb-2 block text-sm font-semibold text-[#374151]">{label}</span> : null}
      <input
        id={id}
        className={cn(
          "h-11 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-sm text-[#111827] shadow-[0_4px_12px_rgba(0,0,0,0.05)] placeholder:text-[#D1D5DB]",
          auroraStyles.focus,
          className,
        )}
        {...props}
      />
    </label>
  );
}
