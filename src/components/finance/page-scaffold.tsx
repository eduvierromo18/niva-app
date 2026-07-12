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
    <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
      {sidebar}
      <section className="min-w-0 flex-1">
        <div className="mb-7 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-muted)]">
              Niva · espacio financiero
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-[var(--niva-color-foreground)]">{title}</h1>
            {description ? <p className="mt-2 text-sm leading-6 text-[var(--niva-color-muted)]">{description}</p> : null}
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
