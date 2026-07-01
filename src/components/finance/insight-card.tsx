import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

export function InsightCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <article className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-slate-950 dark:text-zinc-50">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
    </article>
  );
}
