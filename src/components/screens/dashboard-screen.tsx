"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock3, Flag, Lightbulb, Plus, ReceiptText, WalletCards } from "lucide-react";
import { AccountDialog, type AccountFormValue } from "@/components/finance/account-dialog";
import { MovementDialog, type MovementFormValue } from "@/components/finance/movement-dialog";
import { accounts as initialAccounts, goals, movements as initialMovements, scheduledTransactions } from "@/lib/finance-data";
import { cn, formatCurrency } from "@/lib/utils";
import { AuroraBadge, AuroraButton } from "@/components/aurora";

const today = new Date("2026-06-29T00:00:00");

function daysUntil(date: string) {
  const due = new Date(`${date}T00:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function formatDueLabel(days: number) {
  if (days < 0) return `Vencido hace ${Math.abs(days)} dias`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence manana";
  return `Vence en ${days} dias`;
}

function amountToneForMovement(type: string) {
  if (type === "Ingreso") return "positive" as const;
  if (type === "Gasto") return "negative" as const;
  return "neutral" as const;
}

function scheduledAmountTone(type: string) {
  if (type === "income") return "text-[#047857]";
  if (type === "transfer") return "text-[#2563EB]";
  return "text-[#DC2626]";
}

export function DashboardScreen() {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState("Gasto");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [movements, setMovements] = useState(initialMovements);

  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);
  const reservedBalance = accounts
    .filter((account) => account.alias === "Reserva" || account.name.toLowerCase().includes("ahorro"))
    .reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const availableToday = accounts
    .filter((account) => account.type !== "Tarjeta")
    .reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const spendableToday = Math.max(availableToday - reservedBalance, 0);
  const upcomingScheduled = scheduledTransactions
    .filter((item) => item.status === "active")
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))
    .slice(0, 4);
  const upcomingExpenses = upcomingScheduled
    .filter((item) => item.type !== "income")
    .reduce((sum, item) => sum + item.amount, 0);
  const nextScheduled = upcomingScheduled[0];
  const nextScheduledDays = nextScheduled ? daysUntil(nextScheduled.nextDueDate) : null;
  const recentMovement = movements[0];
  const featuredGoal = goals[0];
  const featuredGoalProgress = Math.round((featuredGoal.current / featuredGoal.target) * 100);

  function addAccount(account: AccountFormValue) {
    setAccounts((current) => [
      ...current,
      {
        ...account,
        color: "bg-slate-800",
        icon: initialAccounts[0].icon,
      },
    ]);
  }

  function openMovement(type: string) {
    setMovementType(type);
    setMovementDialogOpen(true);
  }

  function addMovement(movement: MovementFormValue) {
    setMovements((current) => [movement, ...current]);
  }

  return (
    <div className="space-y-6">
      <section
        className="box-border rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-7 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:w-full sm:px-8 sm:py-9 xl:px-10"
        style={{ width: "min(100%, calc(100vw - 3.75rem))" }}
      >
        <div className="flex flex-col gap-8 xl:grid xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] xl:gap-10">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Daily Brief</p>
              <AuroraBadge tone="success">Hoy</AuroraBadge>
            </div>

            <div className="mt-8 max-w-3xl">
              <p className="text-xl font-semibold text-[#111827] sm:text-2xl">Buenos dias, Luis.</p>
              <h1 className="mt-5 max-w-[14ch] text-4xl font-semibold leading-[1.05] text-[#111827] sm:max-w-none sm:text-5xl lg:text-6xl">
                Todo bajo control.
              </h1>
              <p className="mt-6 max-w-[28ch] break-words text-base leading-7 text-[#6B7280] sm:max-w-2xl sm:text-lg">
                Hay {formatCurrency(upcomingExpenses)} programados en los proximos dias. Tu reserva se mantiene separada y tu margen para hoy sigue claro.
              </p>
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <AuroraButton type="button" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => openMovement("Gasto")}>
                Nuevo registro
              </AuroraButton>
              <AuroraButton type="button" size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => setAccountDialogOpen(true)}>
                Nueva cuenta
              </AuroraButton>
            </div>
          </div>

          <div className="grid min-w-0 gap-4">
            {nextScheduled ? (
              <div className="rounded-[22px] border border-[#E5E7EB] bg-[#FAFAFA] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Proximo evento importante</p>
                    <div className="mt-3 grid min-w-0 gap-2 sm:flex sm:items-baseline sm:justify-between sm:gap-3">
                      <h2 className="min-w-0 text-lg font-semibold text-[#111827]">{nextScheduled.name}</h2>
                      <p className={cn("text-sm font-bold", scheduledAmountTone(nextScheduled.type))}>
                        {nextScheduled.type === "income" ? "+" : ""}
                        {formatCurrency(nextScheduled.amount)}
                      </p>
                    </div>
                    <p className={cn("mt-1 text-sm font-semibold", nextScheduledDays !== null && nextScheduledDays <= 5 ? "text-[#B45309]" : "text-[#6B7280]")}>
                      {nextScheduledDays !== null ? formatDueLabel(nextScheduledDays) : "Sin fecha"}
                    </p>
                  </div>
                </div>
              </div>
            ) : null}

            <div className="rounded-[22px] border border-[#E5E7EB] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Dinero disponible</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Disponible hoy", value: formatCurrency(spendableToday), tone: "text-[#047857]" },
                  { label: "Reservado", value: formatCurrency(reservedBalance), tone: "text-[#6B7280]" },
                  { label: "Total", value: formatCurrency(netWorth), tone: "text-[#111827]" },
                ].map((item) => (
                  <div key={item.label} className="min-w-0">
                    <p className="text-xs font-semibold text-[#6B7280]">{item.label}</p>
                    <p className={cn("mt-2 break-words text-xl font-semibold tracking-tight", item.tone)}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-[#E5E7EB] pt-6 lg:grid-cols-3">
          {recentMovement ? (
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Actividad reciente</p>
              <div className="mt-4 rounded-[22px] border border-[#E5E7EB] bg-[#FAFAFA] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#2563EB] shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                    {recentMovement.type === "Ingreso" ? <WalletCards className="h-5 w-5" /> : <ReceiptText className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-[#111827]">{recentMovement.description}</h3>
                    <p
                      className={cn(
                        "mt-2 text-sm font-bold",
                        amountToneForMovement(recentMovement.type) === "positive" && "text-[#047857]",
                        amountToneForMovement(recentMovement.type) === "negative" && "text-[#DC2626]",
                        amountToneForMovement(recentMovement.type) === "neutral" && "text-[#111827]",
                      )}
                    >
                      {formatCurrency(recentMovement.amount)}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#6B7280]">{recentMovement.account} - {recentMovement.category}</p>
                    <p className="mt-4 text-xs font-bold text-[#6B7280]">{recentMovement.date}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="min-w-0 rounded-[22px] border border-[#E5E7EB] bg-[#FAFAFA] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#047857] shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
                <Flag className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Objetivo destacado</p>
                <h3 className="mt-3 truncate text-base font-semibold text-[#111827]">{featuredGoal.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  {formatCurrency(featuredGoal.current)} de {formatCurrency(featuredGoal.target)}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
                  <div className="h-full rounded-full bg-[#047857]" style={{ width: `${featuredGoalProgress}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-[22px] border border-[#E5E7EB] bg-white p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F9FAFB] text-[#2563EB]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-wide text-[#6B7280]">Insight</p>
                <h3 className="mt-3 text-base font-semibold text-[#111827]">Balance saludable</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                  Tu balance mensual positivo cubre una parte relevante de gastos fijos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-4 text-sm font-semibold">
          <Link href="/programados" className="text-[#2563EB] transition hover:text-[#1D4ED8]">Ver programados</Link>
          <Link href="/accounts" className="text-[#2563EB] transition hover:text-[#1D4ED8]">Ver cuentas</Link>
          <Link href="/goals" className="text-[#2563EB] transition hover:text-[#1D4ED8]">Ver objetivos</Link>
        </div>
      </section>

      <AccountDialog open={accountDialogOpen} onClose={() => setAccountDialogOpen(false)} onSave={addAccount} />
      <MovementDialog open={movementDialogOpen} defaultType={movementType} accounts={accounts} onClose={() => setMovementDialogOpen(false)} onSave={addMovement} />
    </div>
  );
}
