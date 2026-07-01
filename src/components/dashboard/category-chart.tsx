"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

const data = [
  { name: "Hogar", value: 9200, color: "#38bdf8" },
  { name: "Comida", value: 7600, color: "#34d399" },
  { name: "Transporte", value: 3600, color: "#fbbf24" },
  { name: "Salud", value: 2100, color: "#fb7185" },
  { name: "Otros", value: 6100, color: "#a78bfa" },
];

export function CategoryChart() {
  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-950">Estructura de los gastos</h3>
        <p className="text-sm text-slate-500">Distribucion del mes actual</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={68} outerRadius={104}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-slate-600">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </span>
            <span className="font-semibold text-slate-900">{formatCurrency(item.value)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
