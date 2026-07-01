import { Coins, Plus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const accounts = [{ name: "Efectivo", balance: 3000, color: "bg-cyan-500" }];

export function AccountStrip() {
  return (
    <section className="grid gap-3 md:grid-cols-[minmax(260px,380px)_minmax(260px,380px)_1fr]">
      {accounts.map((account) => (
        <article key={account.name} className={`${account.color} flex h-[70px] items-center gap-5 rounded-md px-5 text-white shadow-sm`}>
          <Coins className="h-7 w-7" />
          <div>
            <p className="font-bold">{account.name}</p>
            <p className="font-semibold">{formatCurrency(account.balance)}</p>
          </div>
        </article>
      ))}
      <button className="flex h-[70px] items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 bg-transparent text-lg text-slate-500 hover:bg-white">
        <Plus className="h-5 w-5" />
        Agregar cuenta
      </button>
    </section>
  );
}

