"use client";

import { useState } from "react";
import { CircleDollarSign, MoreHorizontal, Plus, WalletCards } from "lucide-react";
import { AccountDialog, type AccountFormValue } from "@/components/finance/account-dialog";
import { useMovements } from "@/hooks/use-movements";
import type { FinanceAccount, FinanceMovement } from "@/lib/finance-types";
import { cn, formatCurrency } from "@/lib/utils";
import { NivaAlert, NivaBankLogo, NivaButton, NivaEmptyState, NivaIconButton, NivaLayoutSurface, NivaModal, NivaSection, NivaSkeleton } from "@/design-system";
import { useAccounts } from "@/hooks/use-accounts";
import { countLabel, findLastMovement, getAccountStatus, type AccountStatus } from "@/lib/accounts";

type PendingDeleteAccount = {
  index: number;
  account: FinanceAccount;
};

function moneyTextColor(value: number) {
  if (value > 0) return "text-[var(--niva-account-positive)]";
  if (value < 0) return "text-[var(--niva-account-review)]";
  return "text-[var(--niva-account-foreground)]";
}

function statusClasses(tone: AccountStatus["tone"]) {
  if (tone === "ready") return "border-[var(--niva-account-positive-border)] bg-[var(--niva-account-positive-surface)] text-[var(--niva-account-positive)]";
  if (tone === "review") return "border-[var(--niva-account-review-border)] bg-[var(--niva-account-review-surface)] text-[var(--niva-account-review)]";
  return "border-[var(--niva-account-border)] bg-[var(--niva-account-subtle)] text-[var(--niva-account-muted)]";
}

function typeLabel(type: string) {
  if (type === "Banco") return "Cuenta";
  if (type === "Tarjeta") return "Tarjeta";
  if (type === "Efectivo") return "Efectivo";
  if (type === "Inversion") return "Inversión";
  return type;
}

function lastActivityText(lastMovement?: FinanceMovement | null) {
  if (!lastMovement) return "Sin actividad reciente";
  return `${lastMovement.description} · ${lastMovement.date}`;
}

function AccountsLoadingState() {
  return (
    <div className="space-y-10" aria-label="Cargando cuentas">
      <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
        <NivaLayoutSurface className="rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] p-5 shadow-none sm:p-7">
          <NivaSkeleton className="h-4 w-16" />
          <NivaSkeleton className="mt-4 h-16 w-full max-w-lg" />
          <NivaSkeleton className="mt-5 h-4 w-full max-w-md" />
        </NivaLayoutSurface>
        <div className="grid gap-3">
          <NivaSkeleton className="h-28 w-full rounded-[var(--niva-radius-lg)]" />
          <NivaSkeleton className="h-28 w-full rounded-[var(--niva-radius-lg)]" />
          <NivaSkeleton className="h-28 w-full rounded-[var(--niva-radius-lg)]" />
        </div>
      </section>
      <NivaLayoutSurface className="rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] p-5 shadow-none">
        <div className="space-y-4">
          <NivaSkeleton className="h-12 w-full" />
          <NivaSkeleton className="h-12 w-full" />
          <NivaSkeleton className="h-12 w-full" />
        </div>
      </NivaLayoutSurface>
    </div>
  );
}

export function AccountsScreen() {
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDeleteAccount | null>(null);
  const { movements } = useMovements();
  const {
    accounts,
    isLoading,
    error,
    clearError,
    saveAccount,
    deleteAccount,
    totals,
    moneyDistribution,
    institutionGroups,
  } = useAccounts();

  const { totalMoney, availableMoney, creditImpact, reservedMoney, lowBalanceCount, principalAccount } = totals;
  const activeInstitutionGroups = institutionGroups.filter((group) => group.accounts.length > 0);
  const inactiveInstitutionGroups = institutionGroups.filter((group) => group.accounts.length === 0);

  function openNewAccount() {
    clearError();
    setEditingIndex(null);
    setOpen(true);
  }

  function openEditAccount(index: number) {
    clearError();
    setEditingIndex(index);
    setOpen(true);
    setOpenMenuId(null);
  }

  async function saveAccountFromDialog(account: AccountFormValue) {
    const didSave = await saveAccount(account, editingIndex);
    if (didSave) setEditingIndex(null);
    return didSave;
  }

  function requestDeleteAccount(index: number, account: FinanceAccount) {
    setPendingDelete({ index, account });
    setOpenMenuId(null);
  }

  async function confirmDeleteAccount() {
    if (!pendingDelete) return;
    if (await deleteAccount(pendingDelete.index)) setPendingDelete(null);
  }

  return (
    <div className="min-h-full bg-[var(--niva-account-background)] px-1 py-2 text-[var(--niva-account-foreground)] sm:px-2">
      <div className="mx-auto max-w-6xl space-y-10">
        <NivaSection
          eyebrow="Cuentas"
          title="Dónde está mi dinero"
          description="Una lectura simple de tus cuentas activas, separada por dinero disponible, impacto de tarjetas y espacios de ahorro."
          action={<NivaButton type="button" iconLeft={<Plus className="h-4 w-4" />} onClick={openNewAccount} className="hidden sm:inline-flex">Agregar cuenta</NivaButton>}
          className="[&_h2]:text-[clamp(2rem,5vw,4.5rem)] [&_h2]:font-semibold [&_h2]:leading-[0.98] [&_p:first-child]:text-[var(--niva-account-positive)] [&_p:first-child]:tracking-[0.16em] [&_p:not(:first-child)]:text-[var(--niva-account-muted)]"
        />

        {error ? <NivaAlert tone="danger" title={error} /> : null}

        {isLoading ? (
          <AccountsLoadingState />
        ) : (
          <>
            <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <NivaLayoutSurface className="rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] p-5 shadow-none sm:p-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--niva-account-muted)]">Total</p>
                <div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className={cn("text-[clamp(2.5rem,9vw,5.5rem)] font-semibold leading-none", moneyTextColor(totalMoney))}>
                      {formatCurrency(totalMoney)}
                    </p>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-[var(--niva-account-muted)]">
                      {lowBalanceCount > 0 ? "Hay cuentas por revisar, pero la distribución principal está visible." : "Todo listo: tus cuentas activas están organizadas abajo."}
                    </p>
                    <NivaLayoutSurface className="mt-5 rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-subtle)] p-4 shadow-none lg:hidden">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--niva-account-muted)]">Disponible</p>
                      <p className="mt-2 text-3xl font-semibold text-[var(--niva-account-positive)]">{formatCurrency(availableMoney)}</p>
                    </NivaLayoutSurface>
                  </div>
                  <div className="hidden border-t border-[var(--niva-account-border)] pt-4 sm:block sm:w-48 sm:border-l sm:border-t-0 sm:pl-5 sm:pt-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--niva-account-muted)]">Cuentas activas</p>
                    <p className="mt-2 text-3xl font-semibold text-[var(--niva-account-foreground)]">{accounts.length}</p>
                  </div>
                </div>
              </NivaLayoutSurface>

              <div className="grid gap-3">
                <NivaLayoutSurface className="hidden rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] p-5 shadow-none lg:block">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--niva-account-muted)]">Disponible</p>
                  <p className="mt-2 text-3xl font-semibold text-[var(--niva-account-positive)]">{formatCurrency(availableMoney)}</p>
                </NivaLayoutSurface>
                <NivaLayoutSurface className="rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] p-5 shadow-none">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--niva-account-muted)]">Ahorro / inversión</p>
                  <p className="mt-2 text-2xl font-semibold text-[var(--niva-account-foreground)]">{formatCurrency(reservedMoney)}</p>
                </NivaLayoutSurface>
                <NivaLayoutSurface className="rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] p-5 shadow-none">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--niva-account-muted)]">Impacto tarjetas</p>
                  <p className={cn("mt-2 text-2xl font-semibold", moneyTextColor(creditImpact))}>{formatCurrency(creditImpact)}</p>
                </NivaLayoutSurface>
              </div>
            </section>

            <NivaSection title="Distribución" description="Dónde vive el dinero, sin instituciones vacías ocupando espacio." className="[&_h2]:text-[var(--niva-account-foreground)] [&_p]:text-[var(--niva-account-muted)]">
              <NivaLayoutSurface className="divide-y divide-[var(--niva-account-border)] rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] shadow-none">
                {moneyDistribution.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="grid gap-4 px-4 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--niva-radius-md)] border border-[var(--niva-account-border)] bg-[var(--niva-account-subtle)] text-[var(--niva-account-positive)]">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-[var(--niva-account-foreground)]">{item.label}</p>
                          <p className="text-sm text-[var(--niva-account-muted)]">{countLabel(item.count)}</p>
                        </div>
                      </div>
                      <p className={cn("text-2xl font-semibold sm:text-right", moneyTextColor(item.total))}>{formatCurrency(item.total)}</p>
                    </div>
                  );
                })}
              </NivaLayoutSurface>
            </NivaSection>

            <NivaSection title="Cuentas activas" description="Agrupadas por institución o tipo. Solo aparecen espacios con cuentas." className="[&_h2]:text-[var(--niva-account-foreground)] [&_p]:text-[var(--niva-account-muted)]">
              <div className="space-y-5">
                {activeInstitutionGroups.length === 0 ? (
                  <NivaEmptyState
                    title="Aún no hay cuentas"
                    description="Agrega una cuenta para ver tu dinero organizado por institución."
                    actionLabel="Agregar cuenta"
                    icon={<WalletCards className="h-8 w-8" />}
                    onAction={openNewAccount}
                    className="border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] shadow-none"
                  />
                ) : null}

                {activeInstitutionGroups.map((group) => (
                  <NivaLayoutSurface key={group.id} className="rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] shadow-none">
                    <div className="flex flex-col gap-4 border-b border-[var(--niva-account-border)] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                      <div className="flex min-w-0 items-center gap-4">
                        {group.cash ? (
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--niva-radius-md)] border border-[var(--niva-account-positive-border)] bg-[var(--niva-account-positive-surface)] text-[var(--niva-account-positive)]">
                            <CircleDollarSign className="h-6 w-6" />
                          </div>
                        ) : (
                          <div className="rounded-[var(--niva-radius-md)] border border-[var(--niva-account-border)] bg-[var(--niva-account-subtle)] p-1">
                            <NivaBankLogo bankName={group.bankName} size="md" className="border-0 shadow-none" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="truncate text-xl font-semibold text-[var(--niva-account-foreground)]">{group.displayName}</h3>
                          <p className="mt-1 text-sm text-[var(--niva-account-muted)]">{countLabel(group.accounts.length)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 sm:text-right">
                        <span aria-label={`Estado: ${group.status.label}`} className={cn("rounded-[var(--niva-radius-full)] border px-3 py-1 text-xs font-semibold", statusClasses(group.status.tone))}>{group.status.label}</span>
                        <p className={cn("text-2xl font-semibold", moneyTextColor(group.total))}>{formatCurrency(group.total)}</p>
                      </div>
                    </div>

                    <div className="divide-y divide-[var(--niva-account-border)]">
                      {group.accounts.map((account) => {
                        const originalIndex = accounts.findIndex((item) => item === account);
                        const menuId = account.id ?? account.name;
                        const menuDomId = `account-actions-${menuId}`;
                        const lastMovement = findLastMovement(account, movements);
                        const accountStatus = getAccountStatus(account, lastMovement, principalAccount?.id);
                        const isBankLike = account.type === "Banco" || account.type === "Tarjeta" || Boolean(account.bank_name);
                        const Icon = account.icon;

                        return (
                          <article key={menuId} className="grid gap-4 p-4 sm:grid-cols-[minmax(0,1.25fr)_minmax(0,0.8fr)_auto] sm:items-center sm:p-5">
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--niva-radius-md)] border border-[var(--niva-account-border)] bg-[var(--niva-account-subtle)] text-[var(--niva-account-positive)]">
                                {isBankLike ? <NivaBankLogo bankName={account.bank_name ?? group.bankName} bankCustomName={account.bank_custom_name} size="sm" className="h-8 w-8 border-0 shadow-none" /> : <Icon className="h-5 w-5" />}
                              </div>
                              <div className="min-w-0">
                                <h4 className="truncate text-base font-semibold text-[var(--niva-account-foreground)]">{account.name}</h4>
                                <p className="mt-1 text-sm text-[var(--niva-account-muted)]">{typeLabel(account.type)} · {account.alias ?? group.displayName}</p>
                                <p className="mt-2 text-xs leading-5 text-[var(--niva-account-muted)]">Última actividad: {lastActivityText(lastMovement)}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                              <span aria-label={`Estado: ${accountStatus.label}`} className={cn("rounded-[var(--niva-radius-full)] border px-3 py-1 text-xs font-semibold", statusClasses(accountStatus.tone))}>{accountStatus.label}</span>
                              <span className="rounded-[var(--niva-radius-full)] border border-[var(--niva-account-border)] bg-[var(--niva-account-subtle)] px-3 py-1 text-xs font-semibold text-[var(--niva-account-muted)]">{typeLabel(account.type)}</span>
                            </div>

                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                              <p className={cn("text-2xl font-semibold", moneyTextColor(account.balance))}>{formatCurrency(account.balance)}</p>
                              <div className="relative">
                                <NivaIconButton
                                  type="button"
                                  icon={<MoreHorizontal className="h-4 w-4" />}
                                  label={`Acciones de ${account.name}`}
                                  variant="ghost"
                                  aria-haspopup="menu"
                                  aria-expanded={openMenuId === menuId}
                                  aria-controls={openMenuId === menuId ? menuDomId : undefined}
                                  onClick={() => setOpenMenuId(openMenuId === menuId ? null : menuId)}
                                />
                                {openMenuId === menuId ? (
                                  <NivaLayoutSurface
                                    id={menuDomId}
                                    role="menu"
                                    onKeyDown={(event) => {
                                      if (event.key === "Escape") setOpenMenuId(null);
                                    }}
                                    className="absolute right-0 top-11 z-20 w-40 rounded-[var(--niva-radius-lg)] border-[var(--niva-account-border)] bg-[var(--niva-account-surface)] p-2 shadow-none"
                                  >
                                    <NivaButton type="button" role="menuitem" variant="ghost" className="w-full justify-start text-[var(--niva-account-foreground)]" onClick={() => openEditAccount(originalIndex)}>
                                      Editar
                                    </NivaButton>
                                    <NivaButton type="button" role="menuitem" variant="ghost" className="w-full justify-start text-[var(--niva-account-review)] hover:bg-[var(--niva-account-review-surface)]" onClick={() => requestDeleteAccount(originalIndex, account)}>
                                      Eliminar
                                    </NivaButton>
                                  </NivaLayoutSurface>
                                ) : null}
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </NivaLayoutSurface>
                ))}
              </div>
            </NivaSection>

            <div className="sm:hidden">
              <NivaButton type="button" iconLeft={<Plus className="h-4 w-4" />} onClick={openNewAccount} className="w-full">
                Agregar cuenta
              </NivaButton>
            </div>

            {inactiveInstitutionGroups.length > 0 ? (
              <NivaLayoutSurface className="rounded-[var(--niva-radius-lg)] border-dashed border-[var(--niva-account-border)] bg-[var(--niva-account-subtle)] p-4 shadow-none">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--niva-radius-md)] border border-[var(--niva-account-border)] text-[var(--niva-account-muted)]">
                      <WalletCards className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--niva-account-foreground)]">Instituciones sin cuentas</p>
                      <p className="mt-1 text-sm leading-6 text-[var(--niva-account-muted)]">
                        {inactiveInstitutionGroups.map((group) => group.displayName).join(", ")}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--niva-account-muted)]">Secundario</p>
                </div>
              </NivaLayoutSurface>
            ) : null}
          </>
        )}

        <AccountDialog
          open={open}
          initialValue={editingIndex !== null ? { ...accounts[editingIndex], balance: accounts[editingIndex].initialBalance ?? accounts[editingIndex].balance } : null}
          onClose={() => {
            setOpen(false);
            setEditingIndex(null);
          }}
          onSave={saveAccountFromDialog}
        />

        <NivaModal
          open={Boolean(pendingDelete)}
          title="Eliminar cuenta"
          description={pendingDelete ? `Vas a eliminar ${pendingDelete.account.name}. Esta acción no se puede deshacer.` : undefined}
          onClose={() => setPendingDelete(null)}
          footer={
            <div className="mt-6 flex justify-end gap-3">
              <NivaButton type="button" variant="secondary" size="sm" onClick={() => setPendingDelete(null)}>
                Cancelar
              </NivaButton>
              <NivaButton type="button" variant="danger" size="sm" onClick={() => void confirmDeleteAccount()}>
                Eliminar
              </NivaButton>
            </div>
          }
        >
          <p className="text-sm leading-6 text-[var(--niva-color-muted)]">Confirma que quieres quitar esta cuenta de la vista de cuentas activas.</p>
        </NivaModal>
      </div>
    </div>
  );
}
