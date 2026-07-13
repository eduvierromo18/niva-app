"use client";

import { useState } from "react";
import { Banknote, PiggyBank, ReceiptText, WalletCards } from "lucide-react";
import { CategoryDonutChart, IncomeExpenseChart } from "@/components/finance/analytics-charts";
import { FinanceFilters } from "@/components/finance/finance-filters";
import { MetricCard } from "@/components/finance/metric-card";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NivaAlert, NivaSkeleton } from "@/design-system";
import { useAnalytics } from "@/hooks/use-analytics";
import { categoryData } from "@/lib/finance-data";
import { formatCurrency } from "@/lib/utils";

const tabs = ["Informe", "Tendencia", "Flujo de caja", "Reportes"];

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [exportMessage, setExportMessage] = useState("");
  const { kpis, isLoading, error } = useAnalytics();

  // Deltas ("vs mes anterior") are intentionally omitted here until the delta
  // phase — MetricCard hides the badge when no delta is passed.
  const kpiCards = kpis
    ? [
        { label: "Ingresos", value: kpis.income, icon: Banknote },
        { label: "Gastos", value: kpis.expenses, icon: ReceiptText },
        { label: "Balance", value: kpis.balance, icon: WalletCards },
        { label: "Ahorro", value: kpis.savingsRate, icon: PiggyBank, percent: true },
      ]
    : [];

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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? [0, 1, 2, 3].map((index) => <NivaSkeleton key={index} className="h-28 w-full rounded-[var(--niva-radius-lg)]" />)
          : kpiCards.map((card) => <MetricCard key={card.label} {...card} />)}
      </div>
      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1.05fr]">
        <IncomeExpenseChart />
        <CategoryDonutChart />
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
                {categoryData.map((item, index) => {
                  const total = categoryData.reduce((sum, current) => sum + current.value, 0);
                  const percent = (item.value / total) * 100;
                  return (
                    <tr key={item.name} className="border-t border-slate-100 dark:border-zinc-800">
                      <td className="px-5 py-4 font-semibold">{item.name}</td>
                      <td className="px-5 py-4 text-right font-bold">{formatCurrency(item.value)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Progress value={percent} className="w-32" />
                          <span className="text-slate-500">{percent.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">{48 - index * 7}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </PageScaffold>
  );
}
