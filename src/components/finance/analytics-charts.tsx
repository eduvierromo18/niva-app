"use client";

import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { categoryData, chartSeries } from "@/lib/finance-data";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const netWorthSeries = [
  { day: "1 Jun", value: 62400 },
  { day: "5 Jun", value: 65200 },
  { day: "10 Jun", value: 64150 },
  { day: "15 Jun", value: 68800 },
  { day: "20 Jun", value: 70450 },
  { day: "25 Jun", value: 72100 },
  { day: "30 Jun", value: 74400 },
];

export function NetWorthChart() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Evolucion de tu dinero</CardTitle>
        <span className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] px-3 py-1 text-xs font-semibold text-[var(--niva-color-muted)]">Este mes</span>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={netWorthSeries}>
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E7A4E" stopOpacity={0.24} />
                  <stop offset="95%" stopColor="#1E7A4E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area type="monotone" dataKey="value" stroke="#1E7A4E" strokeWidth={3} fill="url(#netWorthGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function IncomeExpenseChart() {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Ingresos vs gastos por dia</CardTitle>
        <span className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] px-3 py-1 text-xs font-semibold text-[var(--niva-color-muted)]">Diario</span>
      </CardHeader>
      <CardContent>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartSeries}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="ingresos" fill="#1E7A4E" radius={[6, 6, 0, 0]} />
              <Bar dataKey="gastos" fill="#454B57" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function CategoryDonutChart() {
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Gastos por categoria</CardTitle>
        <span className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] px-3 py-1 text-xs font-semibold text-[var(--niva-color-muted)]">Este mes</span>
      </CardHeader>
      <CardContent>
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} dataKey="value" innerRadius={64} outerRadius={96} paddingAngle={2}>
                  {categoryData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center text-sm font-semibold">
              <span className="text-[var(--niva-color-muted)]">Total</span>
              <span className="text-[var(--niva-color-foreground)]">{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="space-y-3">
            {categoryData.map((item) => (
              <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm">
                <span className="flex items-center gap-2 text-[var(--niva-color-muted)]">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-[var(--niva-color-foreground)]">{formatCurrency(item.value)}</span>
                <span className="w-12 text-right text-[var(--niva-color-muted)]">{((item.value / total) * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
