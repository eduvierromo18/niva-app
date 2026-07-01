"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuroraBottomSheetProps = {
  title: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function AuroraBottomSheet({ title, children, action, className }: AuroraBottomSheetProps) {
  return (
    <div className={cn("rounded-t-[32px] border border-[#E5E7EB] bg-white p-5 shadow-[0_24px_48px_rgba(0,0,0,0.10)]", className)}>
      <div className="mx-auto h-1.5 w-20 rounded-full bg-[#D1D5DB]" />
      <h2 className="mt-6 text-base font-bold text-[#111827]">{title}</h2>
      <div className="mt-5 space-y-3">{children}</div>
      {action ? <div className="mt-6 border-t border-[#E5E7EB] pt-4 text-center">{action}</div> : null}
    </div>
  );
}
