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
  ShieldCheck,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import { AccountDialog, type AccountFormValue } from "@/components/finance/account-dialog";
import { accounts as initialAccounts, movements } from "@/lib/finance-data";
import type { FinanceAccount, FinanceMovement } from "@/lib/finance-types";
import { findBank, getBankDisplayName, normalizeBankName } from "@/config/banks";
import { cn, formatCurrency } from "@/lib/utils";
import {
  AuroraAccountCard,
  AuroraBadge,
  AuroraBankLogo,
  AuroraButton,
  AuroraCard,
  AuroraEmptyState,
  AuroraHero,
  AuroraIconButton,
  AuroraSection,
} from "@/components/aurora";

type InstitutionConfig = {
  id: string;
  label: string;
  bankName?: string;
  cash?: boolean;
};

type AccountStatus = {
  label: string;
  tone: "info" | "success" | "warning" | "danger" | "neutral";
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
  if (account.id === principalAccountId) return { label: "Cuenta principal", tone: "info" };
  if (account.balance < 0 || (account.type !== "Tarjeta" && account.balance < 1000)) return { label: "Saldo bajo", tone: "warning" };
  if (!lastMovement) return { label: "Sin movimientos recientes", tone: "neutral" };
  return { label: "Todo correcto", tone: "success" };
}

function getGroupStatus(accounts: FinanceAccount[]): AccountStatus {
  if (accounts.length === 0) return { label: "Sin cuentas", tone: "neutral" };
  if (accounts.some((account) => account.balance < 0)) return { label: "Revisar saldo", tone: "warning" };
  return { label: "Todo correcto", tone: "success" };
}

function getConnectedBanksCount(accounts: FinanceAccount[]) {
  return new Set(
    accounts
      .filter((account) => account.type !== "Efectivo" && (account.bank_name || account.bank_custom_name))
      .map((account) => getInstitutionId(account)),
  ).size;
}

export function AccountsScreen() {
  const [open, setOpen] = useState(false);
  const [accounts, setAccounts] = useState(initialAccounts);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const availableMoney = accounts
    .filter((account) => account.type !== "Tarjeta")
    .reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const connectedBanks = getConnectedBanksCount(accounts);
  const lowBalanceCount = accounts.filter((account) => account.balance < 0 || (account.type !== "Tarjeta" && account.balance < 1000)).length;
  const generalStatus = lowBalanceCount > 0 ? "Hay cuentas por revisar." : "No tienes cuentas con alertas.";
  const principalAccount = accounts
    .filter((account) => account.type !== "Tarjeta")
    .sort((a, b) => b.balance - a.balance)[0];

  const typeCards = [
    {
      label: "Bancos",
      icon: Landmark,
      total: accounts.filter((account) => account.type === "Banco" && !isSavingsAccount(account)).reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Banco" && !isSavingsAccount(account)).length,
      tone: "info" as const,
    },
    {
      label: "Tarjetas",
      icon: CreditCard,
      total: accounts.filter((account) => account.type === "Tarjeta").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Tarjeta").length,
      tone: "danger" as const,
    },
    {
      label: "Efectivo",
      icon: CircleDollarSign,
      total: accounts.filter((account) => account.type === "Efectivo").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Efectivo").length,
      tone: "success" as const,
    },
    {
      label: "Ahorro",
      icon: PiggyBank,
      total: accounts.filter(isSavingsAccount).reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter(isSavingsAccount).length,
      tone: "warning" as const,
    },
    {
      label: "Inversiones",
      icon: Banknote,
      total: accounts.filter((account) => account.type === "Inversion").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Inversion").length,
      tone: "neutral" as const,
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
    <div className="space-y-10">
      <AuroraSection
        eyebrow="Cuentas"
        title="Cuentas"
        description="Administra todas tus cuentas desde un solo lugar."
        action={<AuroraButton type="button" icon={<Plus className="h-4 w-4" />} onClick={openNewAccount}>Nueva cuenta</AuroraButton>}
      />

      <AuroraHero
        greeting="Asi esta tu dinero."
        label="Tu dinero disponible"
        value={formatCurrency(availableMoney)}
        delta={generalStatus}
        action={
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[20px] bg-white/15 p-4">
              <p className="text-xs font-bold uppercase text-white/75">Cuentas</p>
              <p className="mt-2 text-2xl font-bold text-white">{accounts.length}</p>
            </div>
            <div className="rounded-[20px] bg-white/15 p-4">
              <p className="text-xs font-bold uppercase text-white/75">Bancos conectados</p>
              <p className="mt-2 text-2xl font-bold text-white">{connectedBanks}</p>
            </div>
            <div className="rounded-[20px] bg-white/15 p-4">
              <p className="text-xs font-bold uppercase text-white/75">Estado general</p>
              <p className="mt-2 text-sm font-bold leading-6 text-white">{lowBalanceCount > 0 ? "Por revisar" : "Todo organizado"}</p>
            </div>
          </div>
        }
      />

      <AuroraSection title="Por tipo" description="Una lectura rapida de donde esta tu dinero.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {typeCards.map((item) => {
            const Icon = item.icon;
            return (
              <AuroraCard key={item.label} className="rounded-[20px] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
                    item.tone === "info" && "bg-[#EFF6FF] text-[#2563EB]",
                    item.tone === "success" && "bg-[#ECFDF5] text-[#047857]",
                    item.tone === "warning" && "bg-[#FFFBEB] text-[#B45309]",
                    item.tone === "danger" && "bg-[#FEF2F2] text-[#DC2626]",
                    item.tone === "neutral" && "bg-[#F3F4F6] text-[#6B7280]",
                  )}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <AuroraBadge tone={item.tone}>{countLabel(item.count)}</AuroraBadge>
                </div>
                <p className="mt-5 text-sm font-bold text-[#6B7280]">{item.label}</p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">{formatCurrency(item.total)}</p>
              </AuroraCard>
            );
          })}
        </div>
      </AuroraSection>

      <AuroraSection title="Por institucion" description="Cada grupo muestra sus cuentas, saldo y estado sin ruido.">
        <div className="grid gap-5 xl:grid-cols-2">
          {institutionGroups.map((group) => {
            const groupName = group.bankName ? getBankDisplayName(group.bankName) : group.label;
            const bankColor = group.bankName ? findBank(group.bankName).color : "#111827";

            return (
              <AuroraCard key={group.id} className="rounded-[20px] p-5" style={{ borderTopColor: bankColor, borderTopWidth: 3 }}>
                <div className="flex flex-col gap-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      {group.cash ? (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
                          <CircleDollarSign className="h-6 w-6" />
                        </div>
                      ) : (
                        <AuroraBankLogo bankName={group.bankName} size="md" />
                      )}
                      <div className="min-w-0">
                        <h3 className="truncate text-xl font-bold text-[#111827]">{groupName}</h3>
                        <p className="mt-1 text-sm font-semibold text-[#6B7280]">{countLabel(group.accounts.length)}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xl font-bold text-[#111827]">{formatCurrency(group.total)}</p>
                      <AuroraBadge tone={group.status.tone} className="mt-2">{group.status.label}</AuroraBadge>
                    </div>
                  </div>

                  {group.accounts.length > 0 ? (
                    <div className="grid gap-3">
                      {group.accounts.map((account) => {
                        const originalIndex = accounts.findIndex((item) => item === account);
                        const menuId = account.id ?? account.name;
                        const lastMovement = findLastMovement(account, movements);
                        const accountStatus = getAccountStatus(account, lastMovement, principalAccount?.id);
                        const isBankLike = account.type === "Banco" || account.type === "Tarjeta" || Boolean(account.bank_name);
                        const Icon = account.icon;

                        return (
                          <AuroraAccountCard
                            key={menuId}
                            institution={account.alias ?? groupName}
                            account={account.name}
                            balance={formatCurrency(account.balance)}
                            typeLabel={account.type}
                            statusLabel={accountStatus.label}
                            statusTone={accountStatus.tone}
                            lastEntry={lastMovement ? `Ultimo registro: ${lastMovement.description} - ${lastMovement.date}` : "Ultimo registro: sin movimientos recientes"}
                            status={account.balance >= 0 ? "active" : "muted"}
                            icon={isBankLike ? <AuroraBankLogo bankName={account.bank_name ?? group.bankName} bankCustomName={account.bank_custom_name} size="md" className="h-12 w-12 border-0 shadow-none" /> : <Icon className="h-5 w-5" />}
                            className="relative rounded-[20px] bg-[#F9FAFB] shadow-none"
                            action={
                              <div className="relative">
                                <AuroraIconButton
                                  type="button"
                                  icon={<MoreHorizontal className="h-4 w-4" />}
                                  label={`Acciones de ${account.name}`}
                                  variant="ghost"
                                  onClick={() => setOpenMenuId(openMenuId === menuId ? null : menuId)}
                                />
                                {openMenuId === menuId ? (
                                  <div className="absolute right-0 top-11 z-20 w-40 rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-[0_12px_24px_rgba(0,0,0,0.12)]">
                                    <button type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#111827] hover:bg-[#F3F4F6]" onClick={() => openEditAccount(originalIndex)}>
                                      Editar
                                    </button>
                                    <button type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#9CA3AF]" disabled title="Ocultar no cambia datos en este sprint">
                                      Ocultar
                                    </button>
                                    <button type="button" className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#DC2626] hover:bg-[#FEF2F2]" onClick={() => deleteAccount(originalIndex)}>
                                      Eliminar
                                    </button>
                                  </div>
                                ) : null}
                              </div>
                            }
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <AuroraEmptyState
                      title="Sin cuentas registradas"
                      description="Cuando agregues una cuenta de esta institucion aparecera aqui."
                      icon={<WalletCards className="h-8 w-8" />}
                      className="border-dashed bg-[#F9FAFB] shadow-none"
                    />
                  )}
                </div>
              </AuroraCard>
            );
          })}
        </div>
      </AuroraSection>

      {lowBalanceCount > 0 ? (
        <AuroraCard className="rounded-[20px] border-[#FDE68A] bg-[#FFFBEB] p-5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#B45309]">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#B45309]">Hay cuentas por revisar</p>
              <p className="mt-1 text-sm leading-6 text-[#6B7280]">Todo organizado empieza por saber que cuenta necesita atencion.</p>
            </div>
          </div>
        </AuroraCard>
      ) : (
        <AuroraCard className="rounded-[20px] border-[#A7F3D0] bg-[#ECFDF5] p-5">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#047857]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#047857]">No tienes cuentas con alertas.</p>
              <p className="mt-1 text-sm leading-6 text-[#6B7280]">Todo organizado y listo para registrar el siguiente movimiento.</p>
            </div>
          </div>
        </AuroraCard>
      )}

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
