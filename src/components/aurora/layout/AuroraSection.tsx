import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type AuroraSectionProps = HTMLAttributes<HTMLElement> & {
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function AuroraSection({ eyebrow, title, description, action, children, className, ...props }: AuroraSectionProps) {
  return (
    <section className={cn("space-y-6", className)} {...props}>
      {(eyebrow || title || description || action) && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            {eyebrow ? <p className="text-xs font-semibold uppercase tracking-wide text-[#2563EB]">{eyebrow}</p> : null}
            {title ? <h2 className="mt-2 text-2xl font-semibold text-[#111827]">{title}</h2> : null}
            {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </section>
  );
}
