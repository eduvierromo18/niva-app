import { ArrowDownRight, ArrowUpRight, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const cards = [
  { label: "Ingreso total", value: 42500, icon: ArrowUpRight, tone: "text-emerald-600" },
  { label: "Gasto total", value: 28600, icon: ArrowDownRight, tone: "text-rose-500" },
  { label: "Ahorro neto", value: 13900, icon: PiggyBank, tone: "text-sky-600" },
];

export function SummaryCards() {
  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <article key={card.label} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-500">{card.label}</p>
            <card.icon className={`h-5 w-5 ${card.tone}`} />
          </div>
          <p className="mt-3 text-3xl font-bold text-slate-950">{formatCurrency(card.value)}</p>
          <p className="mt-2 text-sm text-slate-500">Este mes</p>
        </article>
      ))}
    </section>
  );
}
