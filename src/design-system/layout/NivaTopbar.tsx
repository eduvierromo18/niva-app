import type { ReactNode } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { nivaFocusRing } from "@/design-system/tokens";

export type NivaTopbarProps = {
  title?: string;
  subtitle?: string;
  searchLabel?: string;
  searchPlaceholder?: string;
  actions?: ReactNode;
  leading?: ReactNode;
  className?: string;
};

export function NivaTopbar({ title, subtitle, searchLabel = "Buscar", searchPlaceholder = "Buscar registros...", actions, leading, className }: NivaTopbarProps) {
  return (
    <header
      className={cn(
        "flex w-full min-w-0 flex-col gap-4 rounded-[var(--niva-radius-2xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] px-5 py-4 text-[var(--niva-color-foreground)] shadow-[var(--niva-shadow-sm)] 2xl:flex-row 2xl:items-center 2xl:justify-between",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {leading}
        <div className="min-w-0">
          {title ? <h1 className="truncate text-2xl font-semibold leading-tight text-[var(--niva-color-foreground)]">{title}</h1> : null}
          {subtitle ? <p className="mt-1 truncate text-sm text-[var(--niva-color-muted)]">{subtitle}</p> : null}
        </div>
      </div>
      <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center">
        <label className="relative block min-w-0 flex-1 md:w-[420px] md:flex-none 2xl:w-[360px]">
          <span className="sr-only">{searchLabel}</span>
          <Search aria-hidden={true} className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--niva-color-placeholder)]" />
          <input
            type="search"
            placeholder={searchPlaceholder}
            className={cn(
              "h-10 w-full rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] px-4 pr-11 text-sm text-[var(--niva-color-foreground)] placeholder:text-[var(--niva-color-placeholder)]",
              nivaFocusRing,
            )}
          />
        </label>
        {actions ? <div className="flex min-w-0 flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
