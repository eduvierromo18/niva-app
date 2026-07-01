"use client";

import { useState } from "react";
import { Banknote, CircleDollarSign, CreditCard, Landmark, PiggyBank, ShieldCheck, WalletCards } from "lucide-react";
import { AccountDialog, type AccountFormValue } from "@/components/finance/account-dialog";
import { BankAvatar } from "@/components/finance/BankAvatar";
import { CurrencyAmount } from "@/components/finance/currency-amount";
import { accounts as initialAccounts, movements } from "@/lib/finance-data";
import type { FinanceAccount, FinanceMovement } from "@/lib/finance-types";
import { findBank, getBankDisplayName, normalizeBankName } from "@/config/banks";
import { cn, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InstitutionConfig = {
  id: string;
  label: string;
  bankName?: string;
};

const institutionConfigs: InstitutionConfig[] = [
  { id: "bbva", label: "BBVA", bankName: "bbva" },
  { id: "nu", label: "Nu", bankName: "nu" },
  { id: "dollarapp", label: "DollarApp", bankName: "dollarapp" },
  { id: "cash", label: "Efectivo" },
];

function isSavingsAccount(account: FinanceAccount) {
  const value = `${account.name} ${account.alias ?? ""} ${account.type}`.toLowerCase();
  return value.includes("ahorro") || value.includes("reserva") || value.includes("inversion");
}

function isForeignCurrencyAccount(account: FinanceAccount) {
  const value = `${account.name} ${account.alias ?? ""} ${account.bank_name ?? ""} ${account.bank_custom_name ?? ""}`.toLowerCase();
  return value.includes("dollar") || value.includes("dolar") || value.includes("usd");
}

function getInstitutionId(account: FinanceAccount) {
  if (account.type === "Efectivo") return "cash";
  return normalizeBankName(account.bank_name ?? account.bank_custom_name ?? "other");
}

function findLastMovement(account: FinanceAccount, allMovements: FinanceMovement[]) {
  return allMovements.find((movement) => movement.account === account.name || movement.destinationAccount === account.name);
}

function countLabel(count: number) {
  return count === 1 ? "1 cuenta" : `${count} cuentas`;
}

export function AccountsScreen() {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);
  const availableToday = accounts
    .filter((account) => account.type !== "Tarjeta")
    .reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const savingsTotal = accounts.filter(isSavingsAccount).reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const financialHealth = netWorth > 0 && savingsTotal > 0 ? "Buena" : "En revision";

  const typeCards = [
    {
      label: "Bancos",
      icon: Landmark,
      total: accounts
        .filter((account) => account.type === "Banco" && !isSavingsAccount(account) && !isForeignCurrencyAccount(account))
        .reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Banco" && !isSavingsAccount(account) && !isForeignCurrencyAccount(account)).length,
      tone: "emerald",
    },
    {
      label: "Tarjetas",
      icon: CreditCard,
      total: accounts.filter((account) => account.type === "Tarjeta").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Tarjeta").length,
      tone: "rose",
    },
    {
      label: "Efectivo",
      icon: CircleDollarSign,
      total: accounts.filter((account) => account.type === "Efectivo").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Efectivo").length,
      tone: "cyan",
    },
    {
      label: "Ahorro / Inversion",
      icon: PiggyBank,
      total: savingsTotal,
      count: accounts.filter(isSavingsAccount).length,
      tone: "amber",
    },
    {
      label: "Moneda extranjera",
      icon: Banknote,
      total: accounts.filter(isForeignCurrencyAccount).reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter(isForeignCurrencyAccount).length,
      tone: "slate",
    },
  ];

  const institutionGroups = institutionConfigs.map((institution) => {
    const groupAccounts = accounts.filter((account) => getInstitutionId(account) === institution.id);
    return {
      ...institution,
      accounts: groupAccounts,
      total: groupAccounts.reduce((sum, account) => sum + account.balance, 0),
      bankColor: institution.bankName ? findBank(institution.bankName).color : "#0f172a",
    };
  });

  function openNewAccount() {
    setEditingIndex(null);
    setOpen(true);
  }

  function openEditAccount(index: number) {
    setEditingIndex(index);
    setOpen(true);
  }

  function addAccount(account: AccountFormValue) {
    setAccounts((current) => {
      if (editingIndex !== null) {
        return current.map((item, index) => (index === editingIndex ? { ...item, ...account } : item));
      }

      return [
        ...current,
        { ...account, color: "bg-slate-800", icon: initialAccounts[0].icon },
      ];
    });
    setEditingIndex(null);
  }

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Patrimonio</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-zinc-50 sm:text-4xl">Patrimonio</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-zinc-400">
            Administra todas tus cuentas y tu dinero.
          </p>
        </div>
        <Button onClick={openNewAccount}>
          <WalletCards className="h-4 w-4" />
          Nueva cuenta
        </Button>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Patrimonio liquido</p>
            <p className="mt-3 text-2xl font-bold text-slate-950 dark:text-zinc-50">{formatCurrency(netWorth)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Disponible hoy</p>
            <p className="mt-3 text-2xl font-bold text-slate-950 dark:text-zinc-50">{formatCurrency(availableToday)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Numero de cuentas</p>
            <p className="mt-3 text-2xl font-bold text-slate-950 dark:text-zinc-50">{accounts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">Salud financiera</p>
              <p className="mt-3 text-2xl font-bold text-emerald-700 dark:text-emerald-400">{financialHealth}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="h-6 w-6" />
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950 dark:text-zinc-50">Por tipo</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {typeCards.map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className={cn(
                      "flex h-11 w-11 items-center justify-center rounded-2xl",
                      item.tone === "emerald" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                      item.tone === "rose" && "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
                      item.tone === "cyan" && "bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300",
                      item.tone === "amber" && "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                      item.tone === "slate" && "bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-200",
                    )}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge>{countLabel(item.count)}</Badge>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-zinc-400">{item.label}</p>
                  <p className="mt-2 text-xl font-bold text-slate-950 dark:text-zinc-50">{formatCurrency(item.total)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950 dark:text-zinc-50">Por institucion</h2>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {institutionGroups.map((group) => (
            <Card key={group.id} className="overflow-hidden" style={{ borderTopColor: group.bankColor, borderTopWidth: 3 }}>
              <CardHeader className="flex-row items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {group.bankName ? (
                    <BankAvatar bankName={group.bankName} size="md" />
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-zinc-100 dark:text-zinc-950">
                      <CircleDollarSign className="h-5 w-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <CardTitle className="truncate">{group.bankName ? getBankDisplayName(group.bankName) : group.label}</CardTitle>
                    <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-zinc-400">{countLabel(group.accounts.length)}</p>
                  </div>
                </div>
                <p className="text-right text-lg font-bold text-slate-950 dark:text-zinc-50">{formatCurrency(group.total)}</p>
              </CardHeader>
              <CardContent className="space-y-3 p-3">
                {group.accounts.length > 0 ? (
                  group.accounts.map((account) => {
                    const originalIndex = accounts.findIndex((item) => item === account);
                    const lastMovement = findLastMovement(account, movements);
                    return (
                      <article key={account.id ?? account.name} className="rounded-xl bg-slate-50 p-4 dark:bg-zinc-900">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="truncate text-base font-bold text-slate-950 dark:text-zinc-50">{account.name}</h3>
                              <Badge>{account.type}</Badge>
                              <Badge className={account.balance >= 0 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300"}>
                                {account.balance >= 0 ? "Activa" : "Por pagar"}
                              </Badge>
                            </div>
                            <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">{account.alias ?? account.type}</p>
                            <p className="mt-2 text-xs text-slate-500 dark:text-zinc-400">
                              {lastMovement ? `Ultimo registro: ${lastMovement.description} - ${lastMovement.date}` : "Sin registros recientes"}
                            </p>
                          </div>
                          <div className="shrink-0 text-left sm:text-right">
                            <p className={cn("text-xl font-bold", account.balance >= 0 ? "text-slate-950 dark:text-zinc-50" : "text-rose-600 dark:text-rose-400")}>
                              <CurrencyAmount value={account.balance} />
                            </p>
                            <div className="mt-3 flex gap-2 sm:justify-end">
                              <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => openEditAccount(originalIndex)}>Editar</Button>
                              <Button type="button" variant="ghost" className="h-9 px-3 text-rose-600" onClick={() => setAccounts((current) => current.filter((_, itemIndex) => itemIndex !== originalIndex))}>Eliminar</Button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500 dark:border-zinc-800 dark:text-zinc-400">
                    No hay cuentas registradas para esta institucion.
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <AccountDialog
        open={open}
        initialValue={editingIndex !== null ? accounts[editingIndex] : null}
        onClose={() => {
          setOpen(false);
          setEditingIndex(null);
        }}
        onSave={addAccount}
      />
    </div>
  );
}
