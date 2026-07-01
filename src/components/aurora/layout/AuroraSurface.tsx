import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

type AuroraSurfaceProps = HTMLAttributes<HTMLDivElement> & {
  elevated?: boolean;
};

export function AuroraSurface({ className, elevated = false, ...props }: AuroraSurfaceProps) {
  return (
    <div
      className={cn(
        auroraStyles.surface,
        elevated && "shadow-[0_12px_24px_rgba(0,0,0,0.08)]",
        className,
      )}
      {...props}
    />
  );
}
