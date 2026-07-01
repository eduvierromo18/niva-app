import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuroraTimelineCardProps = {
  date: string;
  title: string;
  description?: string;
  meta?: string;
  badge?: ReactNode;
  amount?: string;
  icon?: ReactNode;
  action?: ReactNode;
  amountTone?: "positive" | "negative" | "neutral";
  className?: string;
};

export function AuroraTimelineCard({
  date,
  title,
  description,
  meta,
  badge,
  amount,
  icon,
  action,
  amountTone = "neutral",
  className,
}: AuroraTimelineCardProps) {
  return (
    <article className={cn("grid grid-cols-[72px_1fr] overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]", className)}>
      <div className="flex flex-col items-center justify-center border-r border-[#E5E7EB] bg-[#F9FAFB] px-3 py-5 text-center">
        {icon ? <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-[0_4px_12px_rgba(0,0,0,0.06)]">{icon}</div> : null}
        <p className="text-sm font-bold text-[#111827]">{date}</p>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-bold text-[#111827]">{title}</h3>
              {badge}
            </div>
            {description ? <p className="mt-2 text-sm text-[#6B7280]">{description}</p> : null}
            {meta ? <p className="mt-1 text-xs font-semibold text-[#9CA3AF]">{meta}</p> : null}
          </div>
          <div className="flex shrink-0 items-start gap-3">
            {amount ? (
              <p
                className={cn(
                  "text-right text-sm font-bold",
                  amountTone === "positive" && "text-[#047857]",
                  amountTone === "negative" && "text-[#DC2626]",
                  amountTone === "neutral" && "text-[#111827]",
                )}
              >
                {amount}
              </p>
            ) : null}
            {action}
          </div>
        </div>
      </div>
    </article>
  );
}
