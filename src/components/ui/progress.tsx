import { cn } from "@/lib/utils";

export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-zinc-800", className)}>
      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

