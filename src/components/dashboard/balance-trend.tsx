"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";

const data = [
  { day: "1 Jun", balance: 3000 },
  { day: "4 Jun", balance: 3000 },
  { day: "7 Jun", balance: 3000 },
  { day: "10 Jun", balance: 3000 },
  { day: "13 Jun", balance: 3000 },
  { day: "16 Jun", balance: 3000 },
  { day: "19 Jun", balance: 3000 },
  { day: "22 Jun", balance: 3000 },
  { day: "25 Jun", balance: 3000 },
  { day: "30 Jun", balance: 3000 },
];

export function BalanceTrend() {
  return (
    <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <div className="mb-5 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-950">Tendencia de saldo</h3>
      </div>
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">Este mes</p>
          <p className="text-3xl font-bold text-slate-950">{formatCurrency(3000)}</p>
        </div>
        <p className="text-sm text-slate-500">VS periodo anterior <span className="font-bold text-slate-950">0%</span></p>
      </div>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="6 6" stroke="#cbd5e1" vertical={false} />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Area type="monotone" dataKey="balance" stroke="#1d9bf0" strokeWidth={3} fill="#dff1ff" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

