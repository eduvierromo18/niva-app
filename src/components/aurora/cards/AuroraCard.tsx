import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

type AuroraCardProps = HTMLAttributes<HTMLDivElement> & {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function AuroraCard({ title, description, action, children, className, ...props }: AuroraCardProps) {
  return (
    <article className={cn(auroraStyles.card, "rounded-[20px] p-5 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]", className)} {...props}>
      {(title || description || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title ? <h3 className="text-base font-bold text-[#111827]">{title}</h3> : null}
            {description ? <p className="mt-2 text-sm leading-6 text-[#6B7280]">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      {children}
    </article>
  );
}
