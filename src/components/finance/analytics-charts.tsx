"use client";

import { Area, AreaChart, Bar, BarChart, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { DailyFlowPoint, NetWorthTrendPoint } from "@/lib/analytics";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const monthLabelFormatter = new Intl.DateTimeFormat("es-MX", { month: "short", timeZone: "UTC" });

function formatTrendMonth(month: string) {
  const label = monthLabelFormatter.format(new Date(`${month}-01T00:00:00Z`)).replace(".", "");
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function NetWorthChart({ data, rangeLabel, hasAccounts }: { data: NetWorthTrendPoint[]; rangeLabel: string; hasAccounts: boolean }) {
  const chartData = data.map((point) => ({ label: formatTrendMonth(point.month), value: point.netWorth }));

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Patrimonio histórico</CardTitle>
        <span className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] px-3 py-1 text-xs font-semibold text-[var(--niva-color-muted)]">{rangeLabel}</span>
      </CardHeader>
      <CardContent>
        {hasAccounts ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E7A4E" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#1E7A4E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Area type="monotone" dataKey="value" stroke="#1E7A4E" strokeWidth={3} fill="url(#netWorthGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-[var(--niva-color-muted)]">Aún no tienes cuentas registradas.</p>
        )}
        <p className="mt-3 text-xs text-[var(--niva-color-muted)]">
          Este historial refleja solo tus cuentas. Las deudas personales sin cuenta vinculada se incluyen en tu patrimonio neto actual, pero no en esta tendencia.
        </p>
      </CardContent>
    </Card>
  );
}

export function IncomeExpenseChart({ data }: { data: DailyFlowPoint[] }) {
  const hasData = data.some((point) => point.income > 0 || point.expenses > 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Ingresos vs gastos por dia</CardTitle>
        <span className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] px-3 py-1 text-xs font-semibold text-[var(--niva-color-muted)]">Diario</span>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 12 }} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} labelFormatter={(label) => `Día ${label}`} />
                <Bar dataKey="income" name="Ingresos" fill="#1E7A4E" radius={[6, 6, 0, 0]} />
                <Bar dataKey="expenses" name="Gastos" fill="#454B57" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-[var(--niva-color-muted)]">Aún no hay movimientos este mes.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function CategoryDonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Gastos por categoria</CardTitle>
        <span className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] px-3 py-1 text-xs font-semibold text-[var(--niva-color-muted)]">Este mes</span>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="py-10 text-center text-sm text-[var(--niva-color-muted)]">Aún no hay gastos este mes.</p>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
            <div className="relative h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" innerRadius={64} outerRadius={96} paddingAngle={2}>
                    {data.map((entry) => (
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
              {data.map((item) => (
                <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 text-sm">
                  <span className="flex items-center gap-2 text-[var(--niva-color-muted)]">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-semibold text-[var(--niva-color-foreground)]">{formatCurrency(item.value)}</span>
                  <span className="w-12 text-right text-[var(--niva-color-muted)]">{total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0"}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
