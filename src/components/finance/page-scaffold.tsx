import { DateRangeControl } from "@/components/date-range-control";
import { Button } from "@/components/ui/button";

export function PageScaffold({
  title,
  description,
  sidebar,
  children,
  actionLabel = "Nuevo",
  action,
}: {
  title: string;
  description?: string;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  actionLabel?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-5">
      {sidebar}
      <section className="min-w-0 flex-1">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-zinc-50">{title}</h1>
            {description ? <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">{description}</p> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              <DateRangeControl />
            </div>
            {action ?? <Button>{actionLabel}</Button>}
          </div>
        </div>
        {children}
      </section>
    </div>
  );
}
