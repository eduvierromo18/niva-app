import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { auroraStyles } from "@/components/aurora/tokens";

export function AuroraContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(auroraStyles.container, className)} {...props} />;
}
