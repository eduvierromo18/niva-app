import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuickActionButton({
  icon: Icon,
  label,
  description,
  tone = "emerald",
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  description?: string;
  tone?: "emerald" | "blue" | "amber" | "slate";
  onClick?: () => void;
}) {
  const toneClass = {
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    slate: "bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-200",
  }[tone];

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-20 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
    >
      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", toneClass)}>
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-bold text-slate-950 dark:text-zinc-50">{label}</span>
        {description ? <span className="mt-0.5 block text-xs text-slate-500 dark:text-zinc-400">{description}</span> : null}
      </span>
    </button>
  );
}
