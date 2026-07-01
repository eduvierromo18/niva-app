"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import type { FinanceAccount } from "@/lib/finance-types";
import { BankAvatar } from "@/components/finance/BankAvatar";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

const groupOrder = ["Bancos", "Efectivo", "Ahorro", "Tarjetas / Deudas", "Otros"];

function accountGroup(account: FinanceAccount) {
  if (account.type === "Banco") return "Bancos";
  if (account.type === "Efectivo") return "Efectivo";
  if (account.type === "Ahorro" || account.alias?.toLowerCase().includes("ahorro")) return "Ahorro";
  if (account.type === "Tarjeta" || account.type === "Deuda") return "Tarjetas / Deudas";
  return "Otros";
}

function accountSubtitle(account: FinanceAccount) {
  if (account.type === "Banco") return account.alias || account.bank_custom_name || account.bank_name || "Banco";
  return account.alias || account.type;
}

export function AccountSelect({
  accounts,
  value,
  onChange,
  label = "Cuenta",
  excludeValue,
}: {
  accounts: FinanceAccount[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  excludeValue?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = accounts.find((account) => account.name === value);

  const grouped = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return groupOrder.map((group) => {
      const items = accounts.filter((account) => {
        if (account.name === excludeValue) return false;
        const matchesGroup = accountGroup(account) === group;
        const matchesQuery = !normalizedQuery || [account.name, account.alias, account.bank_name, account.bank_custom_name, account.type]
          .filter(Boolean)
          .some((item) => String(item).toLowerCase().includes(normalizedQuery));
        return matchesGroup && matchesQuery;
      });
      return { group, items };
    }).filter((group) => group.items.length > 0);
  }, [accounts, excludeValue, query]);

  return (
    <div className="relative grid gap-2">
      <span className="text-sm font-semibold text-slate-700 dark:text-zinc-200">{label}</span>
      <Button
        type="button"
        variant="secondary"
        className="h-auto min-h-12 w-full justify-between px-3 py-2 text-left"
        onClick={() => setOpen((current) => !current)}
      >
        {selected ? (
          <span className="flex min-w-0 items-center gap-3">
            {selected.type === "Banco" ? (
              <BankAvatar bankName={selected.bank_name} bankCustomName={selected.bank_custom_name} size="sm" />
            ) : (
              <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white", selected.color)}>
                <selected.icon className="h-4 w-4" />
              </span>
            )}
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">{selected.name}</span>
              <span className="block truncate text-xs text-slate-500">{accountSubtitle(selected)} · {formatCurrency(selected.balance)}</span>
            </span>
          </span>
        ) : (
          <span className="text-sm text-slate-500">Seleccionar cuenta</span>
        )}
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </Button>

      {open ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-slate-100 p-3 dark:border-zinc-800">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input className={`${inputClass} w-full pl-9`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar cuenta" />
            </div>
          </div>
          <div className="max-h-72 overflow-y-auto p-2">
            {grouped.map(({ group, items }) => (
              <div key={group} className="py-1">
                <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-400">{group}</p>
                {items.map((account) => (
                  <button
                    key={account.name}
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-slate-50 dark:hover:bg-zinc-900"
                    onClick={() => {
                      onChange(account.name);
                      setOpen(false);
                      setQuery("");
                    }}
                  >
                    {account.type === "Banco" ? (
                      <BankAvatar bankName={account.bank_name} bankCustomName={account.bank_custom_name} size="sm" />
                    ) : (
                      <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white", account.color)}>
                        <account.icon className="h-4 w-4" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-950 dark:text-zinc-50">{account.name}</span>
                      <span className="block truncate text-xs text-slate-500">{accountSubtitle(account)}</span>
                    </span>
                    <span className={cn("text-sm font-bold", account.balance < 0 ? "text-rose-600" : "text-slate-900 dark:text-zinc-50")}>{formatCurrency(account.balance)}</span>
                    {account.name === value ? <Check className="h-4 w-4 text-emerald-700" /> : null}
                  </button>
                ))}
              </div>
            ))}
            {grouped.length === 0 ? <p className="p-4 text-center text-sm text-slate-500">No hay cuentas con ese criterio.</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
