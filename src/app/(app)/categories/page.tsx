"use client";

import { useState } from "react";
import { Banknote, PiggyBank, ReceiptText, WalletCards } from "lucide-react";
import { CategoryDonutChart, IncomeExpenseChart, NetWorthChart } from "@/components/finance/analytics-charts";
import { FinanceFilters } from "@/components/finance/finance-filters";
import { MetricCard } from "@/components/finance/metric-card";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NivaAlert, NivaSkeleton } from "@/design-system";
import { useAnalytics } from "@/hooks/use-analytics";
import { useMovements } from "@/hooks/use-movements";
import { computeCategoryBreakdown, computeDailyFlow, computeMonthOverMonth, computeNetWorthTrend, currentMonthPrefix } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";

const tabs = ["Informe", "Tendencia", "Flujo de caja", "Reportes"];

const netWorthRanges = [
  { key: "6m", label: "6 meses", months: 6 },
  { key: "12m", label: "12 meses", months: 12 },
  { key: "todo", label: "Todo", months: null },
] as const;

function monthsSinceCreation(createdAt: string, reference: Date): number {
  const created = new Date(createdAt);
  return (reference.getUTCFullYear() - created.getUTCFullYear()) * 12 + (reference.getUTCMonth() - created.getUTCMonth()) + 1;
}

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [exportMessage, setExportMessage] = useState("");
  const [netWorthRange, setNetWorthRange] = useState<(typeof netWorthRanges)[number]["key"]>("6m");
  const { kpis, isLoading, error } = useAnalytics();
  const { accounts, movements, categories, isLoading: categoryLoading, error: categoryError } = useMovements();

  // Deltas come from movements (both months are in memory). While movements are
  // still loading, pass undefined so no delta flashes before it can be computed.
  const mom = computeMonthOverMonth(movements);
  const kpiCards = kpis
    ? [
        { label: "Ingresos", value: kpis.income, icon: Banknote, delta: categoryLoading ? undefined : mom.income },
        { label: "Gastos", value: kpis.expenses, icon: ReceiptText, delta: categoryLoading ? undefined : mom.expenses },
        { label: "Balance", value: kpis.balance, icon: WalletCards, delta: categoryLoading ? undefined : mom.balance },
        { label: "Ahorro", value: kpis.savingsRate, icon: PiggyBank, percent: true, delta: categoryLoading ? undefined : mom.savingsRate },
      ]
    : [];

  const breakdown = computeCategoryBreakdown(movements, categories, currentMonthPrefix());
  const breakdownTotal = breakdown.reduce((sum, item) => sum + item.amount, 0);
  const categoryChartData = breakdown.map((item) => ({ name: item.name, value: item.amount, color: item.color }));
  const dailyFlow = computeDailyFlow(movements);

  // Reconstruction needs each account's own anchor date, so only accounts with
  // both an id and a created_at (i.e. loaded from account_balances) qualify.
  const netWorthAccounts = accounts
    .filter((account): account is typeof account & { id: string; createdAt: string } => Boolean(account.id && account.createdAt))
    .map((account) => ({ id: account.id, initialBalance: account.initialBalance ?? 0, createdAt: account.createdAt }));
  const oldestAccountCreatedAt = netWorthAccounts.reduce<string | null>(
    (oldest, account) => (!oldest || account.createdAt < oldest ? account.createdAt : oldest),
    null,
  );
  const selectedRange = netWorthRanges.find((range) => range.key === netWorthRange) ?? netWorthRanges[0];
  const netWorthMonthsBack = selectedRange.months ?? Math.max(1, oldestAccountCreatedAt ? monthsSinceCreation(oldestAccountCreatedAt, new Date()) : 6);
  const netWorthTrend = computeNetWorthTrend(netWorthAccounts, movements, netWorthMonthsBack);

  function exportReport() {
    setExportMessage("Reporte preparado para exportar.");
  }

  return (
    <PageScaffold
      title="Analítica"
      description="Explora tendencias, estructura de gasto y detalle por categoria."
      sidebar={<FinanceFilters title="Analítica" />}
      action={<Button type="button" onClick={exportReport}>Exportar</Button>}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                : "rounded-lg px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-900"
            }
            aria-pressed={activeTab === tab}
          >
            {tab}
          </button>
        ))}
      </div>
      {exportMessage ? (
        <div className="mb-4 rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100">
          {exportMessage}
        </div>
      ) : null}
      {error ? <NivaAlert tone="danger" title={error} /> : null}
      {categoryError ? <NivaAlert tone="danger" title={categoryError} /> : null}
      {activeTab === "Informe" ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {isLoading
              ? [0, 1, 2, 3].map((index) => <NivaSkeleton key={index} className="h-28 w-full rounded-[var(--niva-radius-lg)]" />)
              : kpiCards.map((card) => <MetricCard key={card.label} {...card} />)}
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.05fr]">
            {categoryLoading ? <NivaSkeleton className="h-80 w-full rounded-[var(--niva-radius-lg)]" /> : <IncomeExpenseChart data={dailyFlow} />}
            {categoryLoading ? <NivaSkeleton className="h-80 w-full rounded-[var(--niva-radius-lg)]" /> : <CategoryDonutChart data={categoryChartData} />}
          </div>
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Detalle de gastos por categoria</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-sm">
                  <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-zinc-900">
                    <tr>
                      <th className="px-5 py-3">Categoría</th>
                      <th className="px-5 py-3 text-right">Total</th>
                      <th className="px-5 py-3">Porcentaje</th>
                      <th className="px-5 py-3 text-right">Registros</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map((item) => {
                      const percent = breakdownTotal > 0 ? (item.amount / breakdownTotal) * 100 : 0;
                      return (
                        <tr key={item.key} className="border-t border-slate-100 dark:border-zinc-800">
                          <td className="px-5 py-4 font-semibold">{item.name}</td>
                          <td className="px-5 py-4 text-right font-bold">{formatCurrency(item.amount)}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <Progress value={percent} className="w-32" />
                              <span className="text-slate-500">{percent.toFixed(1)}%</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right">{item.count}</td>
                        </tr>
                      );
                    })}
                    {!categoryLoading && breakdown.length === 0 ? (
                      <tr className="border-t border-slate-100 dark:border-zinc-800">
                        <td className="px-5 py-6 text-center text-slate-500" colSpan={4}>Aún no hay gastos registrados este mes.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
      {activeTab === "Tendencia" ? (
        <div className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-2">
            {netWorthRanges.map((range) => (
              <button
                key={range.key}
                type="button"
                onClick={() => setNetWorthRange(range.key)}
                className={
                  netWorthRange === range.key
                    ? "rounded-lg bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                    : "rounded-lg border border-[var(--niva-color-border)] px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-white dark:text-zinc-300 dark:hover:bg-zinc-900"
                }
                aria-pressed={netWorthRange === range.key}
              >
                {range.label}
              </button>
            ))}
          </div>
          {categoryLoading ? (
            <NivaSkeleton className="h-80 w-full rounded-[var(--niva-radius-lg)]" />
          ) : (
            <NetWorthChart data={netWorthTrend} rangeLabel={selectedRange.label} hasAccounts={netWorthAccounts.length > 0} />
          )}
        </div>
      ) : null}
      {activeTab === "Flujo de caja" || activeTab === "Reportes" ? (
        <Card className="mt-4">
          <CardContent className="py-10 text-center text-sm text-[var(--niva-color-muted)]">
            Esta vista está en construcción. Muy pronto podrás verla aquí.
          </CardContent>
        </Card>
      ) : null}
    </PageScaffold>
  );
}
