import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type NivaPageContainerProps = HTMLAttributes<HTMLDivElement> & {
  width?: "default" | "wide" | "full";
};

const pageContainerWidth: Record<NonNullable<NivaPageContainerProps["width"]>, string> = {
  default: "max-w-[1200px]",
  wide: "max-w-[1440px]",
  full: "max-w-none",
};

export function NivaPageContainer({ width = "default", className, ...props }: NivaPageContainerProps) {
  return <div className={cn("mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8", pageContainerWidth[width], className)} {...props} />;
}

export type NivaSectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function NivaSection({ eyebrow, title, description, action, children, className, ...props }: NivaSectionProps) {
  return (
    <section className={cn("space-y-6", className)} {...props}>
      {(eyebrow || title || description || action) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-normal text-[var(--niva-color-accent)]">{eyebrow}</p> : null}
            {title ? <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--niva-color-foreground)]">{title}</h2> : null}
            {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--niva-color-muted)]">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}

export type NivaContentGridProps = HTMLAttributes<HTMLDivElement> & {
  columns?: 1 | 2 | 3 | 4;
};

const contentGridColumns: Record<NonNullable<NivaContentGridProps["columns"]>, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 lg:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
};

export function NivaContentGrid({ columns = 3, className, ...props }: NivaContentGridProps) {
  return <div className={cn("grid min-w-0 gap-5", contentGridColumns[columns], className)} {...props} />;
}

export type NivaLayoutSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "panel" | "card" | "subtle";
  elevated?: boolean;
};

const surfaceVariantClasses: Record<NonNullable<NivaLayoutSurfaceProps["variant"]>, string> = {
  panel: "rounded-[var(--niva-radius-2xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)]",
  card: "rounded-[var(--niva-radius-xl)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)]",
  subtle: "rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)]",
};

export function NivaLayoutSurface({ variant = "panel", elevated = false, className, ...props }: NivaLayoutSurfaceProps) {
  return (
    <div
      className={cn(
        "min-w-0 text-[var(--niva-color-foreground)]",
        surfaceVariantClasses[variant],
        elevated ? "shadow-[var(--niva-shadow-sm)]" : "shadow-[var(--niva-shadow-xs)]",
        className,
      )}
      {...props}
    />
  );
}
