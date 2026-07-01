import { cn } from "@/lib/utils";

type AuroraGoalCardProps = {
  title: string;
  current: string;
  target: string;
  progress: number;
  className?: string;
};

export function AuroraGoalCard({ title, current, target, progress, className }: AuroraGoalCardProps) {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <article className={cn("rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#111827]">{title}</h3>
          <p className="mt-2 text-sm text-[#6B7280]">{current} de {target}</p>
        </div>
        <span className="rounded-full bg-[#EFF6FF] px-2.5 py-1 text-xs font-bold text-[#2563EB]">{safeProgress}%</span>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
        <div
          className={cn(
            "h-full rounded-full bg-[#2563EB]",
            safeProgress >= 0 && safeProgress < 10 && "w-[8%]",
            safeProgress >= 10 && safeProgress < 20 && "w-[16%]",
            safeProgress >= 20 && safeProgress < 30 && "w-1/4",
            safeProgress >= 30 && safeProgress < 40 && "w-1/3",
            safeProgress >= 40 && safeProgress < 50 && "w-5/12",
            safeProgress >= 50 && safeProgress < 60 && "w-1/2",
            safeProgress >= 60 && safeProgress < 70 && "w-2/3",
            safeProgress >= 70 && safeProgress < 80 && "w-3/4",
            safeProgress >= 80 && safeProgress < 90 && "w-10/12",
            safeProgress >= 90 && safeProgress < 100 && "w-11/12",
            safeProgress >= 100 && "w-full",
          )}
        />
      </div>
    </article>
  );
}
