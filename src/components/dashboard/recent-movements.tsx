import { formatCurrency } from "@/lib/utils";

const movements = [
  { description: "Nomina", category: "Sueldo", amount: 32000, type: "income" },
  { description: "Supermercado", category: "Comida", amount: 1850, type: "expense" },
  { description: "Renta", category: "Hogar", amount: 8500, type: "expense" },
  { description: "Ahorro automatico", category: "Transferencia", amount: 5000, type: "transfer" },
];

export function RecentMovements() {
  return (
    <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-4 border-b border-slate-200 pb-4">
        <h3 className="text-lg font-bold text-slate-950">Actividad reciente</h3>
        <p className="text-sm text-slate-500">Ultimas capturas manuales</p>
      </div>
      <div className="space-y-3">
        {movements.map((movement) => (
          <div key={movement.description} className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50 p-3">
            <div>
              <p className="text-sm font-semibold text-slate-950">{movement.description}</p>
              <p className="text-xs text-slate-500">{movement.category}</p>
            </div>
            <p className={movement.type === "expense" ? "font-semibold text-rose-600" : "font-semibold text-emerald-600"}>
              {movement.type === "expense" ? "-" : "+"}
              {formatCurrency(movement.amount)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
