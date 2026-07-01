import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600 dark:bg-zinc-900 dark:text-zinc-300">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-950 dark:text-zinc-50">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-zinc-400">{description}</p>
      {actionLabel && onAction ? <Button type="button" className="mt-4" onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
