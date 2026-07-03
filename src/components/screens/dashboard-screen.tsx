"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, Flag, Lightbulb, Plus, ReceiptText, WalletCards } from "lucide-react";
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
  const recentMovements = movements.slice(0, 5);
  const featuredGoal = goals[0];
  const featuredGoalProgress = Math.round((featuredGoal.current / featuredGoal.target) * 100);
  const availableRatio = availableToday > 0 ? Math.round((spendableToday / availableToday) * 100) : 0;

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
    <div className="mx-auto w-full max-w-[1180px] space-y-10 px-1 pb-6 sm:px-2 lg:space-y-12">
      <section className="space-y-4 pt-2 sm:pt-4">
        <p className="text-sm font-medium text-[#6B7280]">Buenos dias, Luis.</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="max-w-[12ch] text-4xl font-semibold leading-[1.02] text-[#111827] sm:text-5xl lg:text-6xl">
              Tu dinero, con calma.
            </h1>
          </div>
          <AuroraButton type="button" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => openMovement("Gasto")}>
            Nuevo registro
          </AuroraButton>
        </div>
      </section>

      <section className="rounded-[28px] bg-[#111827] px-6 py-8 text-white shadow-[0_28px_70px_rgba(17,24,39,0.18)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase text-white/60">Daily Brief</p>
          <AuroraBadge tone="success">Hoy</AuroraBadge>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="min-w-0">
            <p className="max-w-4xl text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-5xl">
              Hay {formatCurrency(spendableToday)} libres para decidir y {formatCurrency(reservedBalance)} protegidos fuera del ruido diario.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/68 sm:text-lg">
              En los proximos dias aparecen {formatCurrency(upcomingExpenses)} programados. La lectura importante: tu reserva sigue separada y el margen de hoy permanece visible.
            </p>
          </div>
          <div className="border-t border-white/14 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-sm font-medium text-white/58">Margen disponible</p>
            <p className="mt-3 text-5xl font-semibold tracking-tight">{availableRatio}%</p>
            <p className="mt-4 text-sm leading-6 text-white/62">
              Del efectivo positivo queda accesible despues de apartar la reserva.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-5 border-y border-[#E5E7EB] py-6 sm:grid-cols-3">
        {[
          { label: "Available", value: formatCurrency(spendableToday), helper: "Listo para hoy", tone: "text-[#047857]" },
          { label: "Reserved", value: formatCurrency(reservedBalance), helper: "Separado de decisiones diarias", tone: "text-[#6B7280]" },
          { label: "Total", value: formatCurrency(netWorth), helper: "Patrimonio neto actual", tone: "text-[#111827]" },
        ].map((item) => (
          <div key={item.label} className="min-w-0">
            <p className="text-xs font-bold uppercase text-[#6B7280]">{item.label}</p>
            <p className={cn("mt-3 break-words text-2xl font-semibold tracking-tight sm:text-3xl", item.tone)}>{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">{item.helper}</p>
          </div>
        ))}
      </section>

      {nextScheduled ? (
        <section className="grid gap-5 lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase text-[#6B7280]">Upcoming Commitment</p>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">Solo el siguiente evento.</p>
          </div>
          <div className="rounded-[24px] bg-white px-5 py-5 shadow-[0_12px_34px_rgba(15,23,42,0.06)] sm:px-6">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F3F4F6] text-[#2563EB]">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-[#111827]">{nextScheduled.name}</h2>
                  <p className={cn("mt-2 text-sm font-semibold", nextScheduledDays !== null && nextScheduledDays <= 5 ? "text-[#B45309]" : "text-[#6B7280]")}>
                    {nextScheduledDays !== null ? formatDueLabel(nextScheduledDays) : "Sin fecha"}
                  </p>
                </div>
              </div>
              <p className={cn("text-2xl font-semibold tracking-tight", scheduledAmountTone(nextScheduled.type))}>
                {nextScheduled.type === "income" ? "+" : ""}
                {formatCurrency(nextScheduled.amount)}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <div className="min-w-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-[#6B7280]">Recent Activity</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#111827]">Ultimos movimientos</h2>
            </div>
            <Link href="/movements" className="text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]">
              Ver todos
            </Link>
          </div>

          <div className="mt-5 divide-y divide-[#E5E7EB] rounded-[24px] bg-white px-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
            {recentMovements.map((movement) => (
              <div key={`${movement.date}-${movement.description}`} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F3F4F6] text-[#2563EB]">
                    {movement.type === "Ingreso" ? <WalletCards className="h-5 w-5" /> : <ReceiptText className="h-5 w-5" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-[#111827]">{movement.description}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#6B7280]">
                      {movement.account} / {movement.category}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p
                    className={cn(
                      "text-base font-semibold",
                      amountToneForMovement(movement.type) === "positive" && "text-[#047857]",
                      amountToneForMovement(movement.type) === "negative" && "text-[#DC2626]",
                      amountToneForMovement(movement.type) === "neutral" && "text-[#111827]",
                    )}
                  >
                    {formatCurrency(movement.amount)}
                  </p>
                  <p className="mt-1 text-xs font-bold text-[#6B7280]">{movement.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 gap-5">
          <section className="rounded-[24px] bg-[#F8FAFC] p-5 ring-1 ring-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#047857]">
                <Flag className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase text-[#6B7280]">Primary Goal</p>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#111827]">{featuredGoal.name}</h3>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              {formatCurrency(featuredGoal.current)} de {formatCurrency(featuredGoal.target)} para {featuredGoal.date}
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div className="h-full rounded-full bg-[#047857]" style={{ width: `${featuredGoalProgress}%` }} />
            </div>
            <p className="mt-3 text-sm font-semibold text-[#047857]">{featuredGoalProgress}% completado</p>
          </section>

          <section className="rounded-[24px] bg-white p-5 shadow-[0_12px_34px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3F4F6] text-[#2563EB]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase text-[#6B7280]">Insight</p>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[#111827]">Balance saludable</h3>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Tu balance mensual positivo cubre una parte relevante de gastos fijos. Mantener la reserva separada hace mas clara cada decision pequena.
            </p>
          </section>

          <button
            type="button"
            className="justify-self-start text-sm font-semibold text-[#2563EB] transition hover:text-[#1D4ED8]"
            onClick={() => setAccountDialogOpen(true)}
          >
            Nueva cuenta
          </button>
        </div>
      </section>

      <AccountDialog open={accountDialogOpen} onClose={() => setAccountDialogOpen(false)} onSave={addAccount} />
      <MovementDialog open={movementDialogOpen} defaultType={movementType} accounts={accounts} onClose={() => setMovementDialogOpen(false)} onSave={addMovement} />
    </div>
  );
}
