import type { ReactNode } from "react";
import { WalletCards } from "lucide-react";
import { AuroraButton } from "@/components/aurora/buttons/AuroraButton";
import { cn } from "@/lib/utils";

type AuroraEmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
};

export function AuroraEmptyState({ title, description, actionLabel, onAction, icon, className }: AuroraEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center rounded-xl border border-[#E5E7EB] bg-white p-8 text-center shadow-[0_4px_12px_rgba(0,0,0,0.06)]", className)}>
      <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#F3F4F6] text-[#6B7280]">
        {icon ?? <WalletCards className="h-8 w-8" />}
      </div>
      <h3 className="mt-5 text-base font-bold text-[#111827]">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-6 text-[#6B7280]">{description}</p>
      {actionLabel ? <AuroraButton className="mt-5" size="sm" onClick={onAction}>{actionLabel}</AuroraButton> : null}
    </div>
  );
}
