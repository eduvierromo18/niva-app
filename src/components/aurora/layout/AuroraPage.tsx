import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";
import { AuroraContainer } from "@/components/aurora/layout/AuroraContainer";

type AuroraPageProps = {
  children: ReactNode;
  title?: string;
  description?: string;
  contained?: boolean;
  className?: string;
};

export function AuroraPage({ children, title, description, contained = true, className }: AuroraPageProps) {
  if (!contained) {
    return <main className={cn(auroraStyles.page, "py-8 sm:py-10", className)}>{children}</main>;
  }

  return (
    <main className={cn(auroraStyles.page, "py-8 sm:py-10", className)}>
      <AuroraContainer className="space-y-8">
        {(title || description) && (
          <header className="max-w-3xl">
            {title ? <h1 className="text-[32px] font-bold leading-tight text-[#111827]">{title}</h1> : null}
            {description ? <p className="mt-3 text-base leading-7 text-[#6B7280]">{description}</p> : null}
          </header>
        )}
        {children}
      </AuroraContainer>
    </main>
  );
}
