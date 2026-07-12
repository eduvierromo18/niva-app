import { Progress } from "@/components/ui/progress";
import { CurrencyAmount } from "@/components/finance/currency-amount";
import { cn } from "@/lib/utils";

export function BudgetProgress({
  name,
  spent,
  limit,
  className,
  headerClassName,
  nameClassName,
  percentClassName,
  progressClassName,
  summaryClassName,
  percentDecimals = 0,
  labelElement = "span",
}: {
  name: string;
  spent: number;
  limit: number;
  className?: string;
  headerClassName?: string;
  nameClassName?: string;
  percentClassName?: string;
  progressClassName?: string;
  summaryClassName?: string;
  percentDecimals?: number;
  labelElement?: "span" | "h3";
}) {
  const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
  const isHigh = percent >= 80;
  const Label = labelElement;

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("flex items-center justify-between gap-3 text-sm", headerClassName)}>
        <Label className={cn("font-bold text-[var(--niva-color-foreground)]", nameClassName)}>{name}</Label>
        <span className={cn(isHigh ? "font-bold text-[var(--niva-color-muted)]" : "font-semibold text-[var(--niva-color-muted)]", percentClassName)}>
          {percent.toFixed(percentDecimals)}%
        </span>
      </div>
      <Progress value={percent} className={progressClassName} />
      <p className={cn("text-xs text-[var(--niva-color-muted)]", summaryClassName)}>
        <CurrencyAmount value={spent} /> de <CurrencyAmount value={limit} />
      </p>
    </div>
  );
}
