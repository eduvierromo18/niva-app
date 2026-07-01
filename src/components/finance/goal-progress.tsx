import { Progress } from "@/components/ui/progress";
import { CurrencyAmount } from "@/components/finance/currency-amount";

export function GoalProgress({
  current,
  target,
}: {
  current: number;
  target: number;
}) {
  const percent = target > 0 ? (current / target) * 100 : 0;

  return (
    <>
      <p className="mt-4 text-2xl font-bold">
        <CurrencyAmount value={current} />
      </p>
      <Progress value={percent} className="mt-4" />
      <p className="mt-3 text-sm text-slate-500">
        {percent.toFixed(1)}% de <CurrencyAmount value={target} />
      </p>
    </>
  );
}
