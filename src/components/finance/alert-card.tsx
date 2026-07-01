import type { LucideIcon } from "lucide-react";

export function AlertCard({
  icon: Icon,
  title,
  description,
  tone = "info",
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  tone?: "info" | "warning" | "danger";
}) {
  const toneClass = {
    info: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    warning: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    danger: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  }[tone];

  return (
    <article className="flex items-start gap-3 border-b border-slate-100 py-4 last:border-0 dark:border-zinc-800">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${toneClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-950 dark:text-zinc-50">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-zinc-400">{description}</p>
      </div>
    </article>
  );
}
