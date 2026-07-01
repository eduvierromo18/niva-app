import { cn } from "@/lib/utils";

type AuroraSkeletonProps = {
  rows?: number;
  className?: string;
};

export function AuroraSkeleton({ rows = 4, className }: AuroraSkeletonProps) {
  return (
    <div className={cn("space-y-4 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.06)]", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <span className="h-10 w-10 animate-pulse rounded-full bg-[#F3F4F6]" />
          <span className="h-4 flex-1 animate-pulse rounded-full bg-[#F3F4F6]" />
        </div>
      ))}
    </div>
  );
}
