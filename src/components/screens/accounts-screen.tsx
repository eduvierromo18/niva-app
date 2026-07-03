"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  CircleDollarSign,
  CreditCard,
  Landmark,
  MoreHorizontal,
  PiggyBank,
  Plus,
  WalletCards,
} from "lucide-react";
import { AccountDialog, type AccountFormValue } from "@/components/finance/account-dialog";
import { accounts as initialAccounts, movements } from "@/lib/finance-data";
import type { FinanceAccount, FinanceMovement } from "@/lib/finance-types";
import { getBankDisplayName, normalizeBankName } from "@/config/banks";
import { cn, formatCurrency } from "@/lib/utils";
import { AuroraBankLogo, AuroraButton, AuroraIconButton, AuroraSection } from "@/components/aurora";

type InstitutionConfig = {
  id: string;
  label: string;
  bankName?: string;
  cash?: boolean;
};

type AccountStatus = {
  label: string;
  tone: "ready" | "review" | "quiet";
};

const institutionConfigs: InstitutionConfig[] = [
  { id: "bbva", label: "BBVA", bankName: "bbva" },
  { id: "nu", label: "Nu", bankName: "nu" },
  { id: "american-express", label: "American Express", bankName: "american-express" },
  { id: "banorte", label: "Banorte", bankName: "banorte" },
  { id: "banamex", label: "Banamex", bankName: "banamex" },
  { id: "mercado-pago", label: "Mercado Pago", bankName: "mercado-pago" },
  { id: "dollarapp", label: "DollarApp", bankName: "dollarapp" },
  { id: "cash", label: "Efectivo", cash: true },
  { id: "other", label: "Otro", bankName: "other" },
];

function isSavingsAccount(account: FinanceAccount) {
  const value = `${account.name} ${account.alias ?? ""} ${account.type}`.toLowerCase();
  return value.includes("ahorro") || value.includes("reserva") || value.includes("inversion");
}

function getInstitutionId(account: FinanceAccount) {
  if (account.type === "Efectivo") return "cash";
  return normalizeBankName(account.bank_name ?? account.bank_custom_name ?? "other") || "other";
}

function findLastMovement(account: FinanceAccount, allMovements: FinanceMovement[]) {
  return allMovements.find((movement) => movement.account === account.name || movement.destinationAccount === account.name);
}

function countLabel(count: number) {
  return count === 1 ? "1 cuenta" : `${count} cuentas`;
}

function getAccountStatus(account: FinanceAccount, lastMovement?: FinanceMovement | null, principalAccountId?: string): AccountStatus {
  if (account.id === principalAccountId) return { label: "Cuenta principal", tone: "quiet" };
  if (account.balance < 0 || (account.type !== "Tarjeta" && account.balance < 1000)) return { label: "Por revisar", tone: "review" };
  if (!lastMovement) return { label: "Sin actividad reciente", tone: "quiet" };
  return { label: "Todo listo", tone: "ready" };
}

function getGroupStatus(accounts: FinanceAccount[]): AccountStatus {
  if (accounts.length === 0) return { label: "Sin cuentas", tone: "quiet" };
  if (accounts.some((account) => account.balance < 0)) return { label: "Por revisar", tone: "review" };
  return { label: "Todo listo", tone: "ready" };
}

function moneyTextColor(value: number) {
  if (value > 0) return "text-[#0F6B4D]";
  if (value < 0) return "text-[#9A4B35]";
  return "text-[#211F1B]";
}

function statusClasses(tone: AccountStatus["tone"]) {
  if (tone === "ready") return "border-[#B7D7C6] bg-[#EEF6F1] text-[#0F6B4D]";
  if (tone === "review") return "border-[#E7C8B8] bg-[#F7EEE8] text-[#9A4B35]";
  return "border-[#D9D1C5] bg-[#F7F1E8] text-[#6E655B]";
}

function typeLabel(type: string) {
  if (type === "Banco") return "Cuenta";
  if (type === "Tarjeta") return "Tarjeta";
  if (type === "Efectivo") return "Efectivo";
  if (type === "Inversion") return "Inversion";
  return type;
}

function lastActivityText(lastMovement?: FinanceMovement | null) {
  if (!lastMovement) return "Sin actividad reciente";
  return `${lastMovement.description} · ${lastMovement.date}`;
}

export function AccountsScreen() {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const totalMoney = accounts.reduce((sum, account) => sum + account.balance, 0);
  const availableMoney = accounts.filter((account) => account.type !== "Tarjeta").reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const creditImpact = accounts.filter((account) => account.type === "Tarjeta").reduce((sum, account) => sum + account.balance, 0);
  const reservedMoney = accounts.filter((account) => isSavingsAccount(account) || account.type === "Inversion").reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const lowBalanceCount = accounts.filter((account) => account.balance < 0 || (account.type !== "Tarjeta" && account.balance < 1000)).length;
  const principalAccount = accounts
    .filter((account) => account.type !== "Tarjeta")
    .sort((a, b) => b.balance - a.balance)[0];

  const moneyDistribution = [
    {
      label: "Bancos",
      icon: Landmark,
      total: accounts.filter((account) => account.type === "Banco" && !isSavingsAccount(account)).reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Banco" && !isSavingsAccount(account)).length,
    },
    {
      label: "Tarjetas",
      icon: CreditCard,
      total: accounts.filter((account) => account.type === "Tarjeta").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Tarjeta").length,
    },
    {
      label: "Efectivo",
      icon: CircleDollarSign,
      total: accounts.filter((account) => account.type === "Efectivo").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Efectivo").length,
    },
    {
      label: "Ahorro",
      icon: PiggyBank,
      total: accounts.filter(isSavingsAccount).reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter(isSavingsAccount).length,
    },
    {
      label: "Inversiones",
      icon: Banknote,
      total: accounts.filter((account) => account.type === "Inversion").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Inversion").length,
    },
  ];

  const institutionGroups = useMemo(
    () =>
      institutionConfigs.map((institution) => {
        const groupAccounts = accounts.filter((account) => getInstitutionId(account) === institution.id);
        return {
          ...institution,
          accounts: groupAccounts,
          total: groupAccounts.reduce((sum, account) => sum + account.balance, 0),
          status: getGroupStatus(groupAccounts),
        };
      }),
    [accounts],
  );
  const activeInstitutionGroups = institutionGroups.filter((group) => group.accounts.length > 0);
  const inactiveInstitutionGroups = institutionGroups.filter((group) => group.accounts.length === 0);

  function openNewAccount() {
    setEditingIndex(null);
    setOpen(true);
  }

  function openEditAccount(index: number) {
    setEditingIndex(index);
    setOpen(true);
    setOpenMenuId(null);
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

  function deleteAccount(index: number) {
    setAccounts((current) => current.filter((_, itemIndex) => itemIndex !== index));
    setOpenMenuId(null);
  }

  return (
    <div className="min-h-full bg-[#F4EDE2] px-1 py-2 text-[#211F1B] sm:px-2">
      <div className="mx-auto max-w-6xl space-y-10">
        <AuroraSection
          eyebrow="Cuentas"
          title="Dónde está mi dinero"
          description="Una lectura simple de tus cuentas activas, separada por dinero disponible, impacto de tarjetas y espacios de ahorro."
          action={<AuroraButton type="button" icon={<Plus className="h-4 w-4" />} onClick={openNewAccount} className="hidden sm:inline-flex">Agregar cuenta</AuroraButton>}
          className="[&_h2]:text-[clamp(2rem,5vw,4.5rem)] [&_h2]:font-semibold [&_h2]:leading-[0.98] [&_p:first-child]:text-[#0F6B4D] [&_p:first-child]:tracking-[0.16em] [&_p:not(:first-child)]:text-[#6E655B]"
        />

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="rounded-lg border border-[#D8CDBD] bg-[#FBF7EF] p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6E655B]">Total</p>
            <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className={cn("text-[clamp(2.5rem,9vw,5.5rem)] font-semibold leading-none", moneyTextColor(totalMoney))}>
                  {formatCurrency(totalMoney)}
                </p>
                <p className="mt-4 max-w-xl text-sm leading-6 text-[#6E655B]">
                  {lowBalanceCount > 0 ? "Hay cuentas por revisar, pero la distribución principal está visible." : "Todo listo: tus cuentas activas están organizadas abajo."}
                </p>
                <div className="mt-5 rounded-lg border border-[#D8CDBD] bg-[#F7F1E8] p-4 lg:hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E655B]">Disponible</p>
                  <p className="mt-2 text-3xl font-semibold text-[#0F6B4D]">{formatCurrency(availableMoney)}</p>
                </div>
              </div>
              <div className="hidden border-t border-[#D8CDBD] pt-4 sm:block sm:w-48 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E655B]">Cuentas activas</p>
                <p className="mt-2 text-3xl font-semibold text-[#211F1B]">{accounts.length}</p>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <div className="hidden rounded-lg border border-[#D8CDBD] bg-[#FBF7EF] p-5 lg:block">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E655B]">Disponible</p>
              <p className="mt-2 text-3xl font-semibold text-[#0F6B4D]">{formatCurrency(availableMoney)}</p>
            </div>
            <div className="rounded-lg border border-[#D8CDBD] bg-[#FBF7EF] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E655B]">Ahorro / inversión</p>
              <p className="mt-2 text-2xl font-semibold text-[#211F1B]">{formatCurrency(reservedMoney)}</p>
            </div>
            <div className="rounded-lg border border-[#D8CDBD] bg-[#FBF7EF] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E655B]">Impacto tarjetas</p>
              <p className={cn("mt-2 text-2xl font-semibold", moneyTextColor(creditImpact))}>{formatCurrency(creditImpact)}</p>
            </div>
          </div>
        </section>

        <AuroraSection title="Distribución" description="Dónde vive el dinero, sin instituciones vacías ocupando espacio." className="[&_h2]:text-[#211F1B] [&_p]:text-[#6E655B]">
          <div className="divide-y divide-[#D8CDBD] rounded-lg border border-[#D8CDBD] bg-[#FBF7EF]">
            {moneyDistribution.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="grid gap-4 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#D8CDBD] bg-[#F7F1E8] text-[#0F6B4D]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-base font-semibold text-[#211F1B]">{item.label}</p>
                      <p className="text-sm text-[#6E655B]">{countLabel(item.count)}</p>
                    </div>
                  </div>
                  <p className={cn("text-2xl font-semibold sm:text-right", moneyTextColor(item.total))}>{formatCurrency(item.total)}</p>
                </div>
              );
            })}
          </div>
        </AuroraSection>

        <AuroraSection title="Cuentas activas" description="Agrupadas por institución o tipo. Solo aparecen espacios con cuentas." className="[&_h2]:text-[#211F1B] [&_p]:text-[#6E655B]">
          <div className="space-y-5">
            {activeInstitutionGroups.map((group) => {
              const groupName = group.bankName ? getBankDisplayName(group.bankName) : group.label;

              return (
                <section key={group.id} className="rounded-lg border border-[#D8CDBD] bg-[#FBF7EF]">
                  <div className="flex flex-col gap-4 border-b border-[#D8CDBD] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                    <div className="flex min-w-0 items-center gap-4">
                      {group.cash ? (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#B7D7C6] bg-[#EEF6F1] text-[#0F6B4D]">
                          <CircleDollarSign className="h-6 w-6" />
                        </div>
                      ) : (
                        <div className="rounded-md border border-[#D8CDBD] bg-[#F7F1E8] p-1">
                          <AuroraBankLogo bankName={group.bankName} size="md" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-semibold text-[#211F1B]">{groupName}</h3>
                        <p className="mt-1 text-sm text-[#6E655B]">{countLabel(group.accounts.length)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:text-right">
                      <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", statusClasses(group.status.tone))}>{group.status.label}</span>
                      <p className={cn("text-2xl font-semibold", moneyTextColor(group.total))}>{formatCurrency(group.total)}</p>
                    </div>
                  </div>

                  <div className="divide-y divide-[#D8CDBD]">
                    {group.accounts.map((account) => {
                      const originalIndex = accounts.findIndex((item) => item === account);
                      const menuId = account.id ?? account.name;
                      const lastMovement = findLastMovement(account, movements);
                      const accountStatus = getAccountStatus(account, lastMovement, principalAccount?.id);
                      const isBankLike = account.type === "Banco" || account.type === "Tarjeta" || Boolean(account.bank_name);
                      const Icon = account.icon;

                      return (
                        <article key={menuId} className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,0.8fr)_auto] sm:items-center sm:p-5">
                          <div className="flex min-w-0 items-start gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#D8CDBD] bg-[#F7F1E8] text-[#0F6B4D]">
                              {isBankLike ? <AuroraBankLogo bankName={account.bank_name ?? group.bankName} bankCustomName={account.bank_custom_name} size="sm" className="h-8 w-8 border-0 shadow-none" /> : <Icon className="h-5 w-5" />}
                            </div>
                            <div className="min-w-0">
                              <h4 className="truncate text-base font-semibold text-[#211F1B]">{account.name}</h4>
                              <p className="mt-1 text-sm text-[#6E655B]">{typeLabel(account.type)} · {account.alias ?? groupName}</p>
                              <p className="mt-2 text-xs leading-5 text-[#6E655B]">Última actividad: {lastActivityText(lastMovement)}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                            <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", statusClasses(accountStatus.tone))}>{accountStatus.label}</span>
                            <span className="rounded-full border border-[#D8CDBD] bg-[#F7F1E8] px-3 py-1 text-xs font-semibold text-[#6E655B]">{typeLabel(account.type)}</span>
                          </div>

                          <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <p className={cn("text-2xl font-semibold", moneyTextColor(account.balance))}>{formatCurrency(account.balance)}</p>
                            <div className="relative">
                              <AuroraIconButton
                                type="button"
                                icon={<MoreHorizontal className="h-4 w-4" />}
                                label={`Acciones de ${account.name}`}
                                variant="ghost"
                                onClick={() => setOpenMenuId(openMenuId === menuId ? null : menuId)}
                              />
                              {openMenuId === menuId ? (
                                <div className="absolute right-0 top-11 z-20 w-40 rounded-lg border border-[#D8CDBD] bg-[#FBF7EF] p-2 shadow-none">
                                  <button type="button" className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-[#211F1B] hover:bg-[#F7F1E8]" onClick={() => openEditAccount(originalIndex)}>
                                    Editar
                                  </button>
                                  <button type="button" className="w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-[#9A4B35] hover:bg-[#F7EEE8]" onClick={() => deleteAccount(originalIndex)}>
                                    Eliminar
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </AuroraSection>

        <div className="sm:hidden">
          <AuroraButton type="button" icon={<Plus className="h-4 w-4" />} onClick={openNewAccount} className="w-full">
            Agregar cuenta
          </AuroraButton>
        </div>

        {inactiveInstitutionGroups.length > 0 ? (
          <section className="rounded-lg border border-dashed border-[#D8CDBD] bg-[#F7F1E8] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#D8CDBD] text-[#6E655B]">
                  <WalletCards className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#211F1B]">Instituciones sin cuentas</p>
                  <p className="mt-1 text-sm leading-6 text-[#6E655B]">
                    {inactiveInstitutionGroups.map((group) => (group.bankName ? getBankDisplayName(group.bankName) : group.label)).join(", ")}
                  </p>
                </div>
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6E655B]">Secundario</p>
            </div>
          </section>
        ) : null}

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
    </div>
  );
}
