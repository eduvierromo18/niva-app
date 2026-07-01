"use client";

import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

type AuroraSwitchProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "role"> & {
  checked?: boolean;
  label?: string;
};

export function AuroraSwitch({ checked = false, label, className, ...props }: AuroraSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={cn("inline-flex items-center gap-3", auroraStyles.focus, className)}
      {...props}
    >
      <span className={cn("flex h-6 w-11 items-center rounded-full p-0.5 transition-all duration-200 ease-out", checked ? "bg-[#2563EB]" : "bg-[#D1D5DB]")}>
        <span className={cn("h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.20)] transition-all duration-200 ease-out", checked && "translate-x-5")} />
      </span>
      {label ? <span className="text-sm font-semibold text-[#374151]">{label}</span> : null}
    </button>
  );
}
