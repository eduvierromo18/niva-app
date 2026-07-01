import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function CurrencyAmount({
  value,
  currency = "MXN",
  className,
}: {
  value: number;
  currency?: string;
  className?: string;
}) {
  return <span className={cn(className)}>{formatCurrency(value, currency)}</span>;
}
