"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarClock, Flag, Lightbulb, Plus, ReceiptText, WalletCards } from "lucide-react";
import { AccountDialog, type AccountFormValue } from "@/components/finance/account-dialog";
import { MovementDialog, type MovementFormValue } from "@/components/finance/movement-dialog";
import { usePlanningData } from "@/hooks/use-planning-data";
import { useMovements } from "@/hooks/use-movements";
import { useAccounts } from "@/hooks/use-accounts";
import { getFeaturedGoalProgress } from "@/lib/dashboard";
import { cn, formatCurrency } from "@/lib/utils";
import { NivaBadge, NivaButton, NivaContentGrid, NivaLayoutSurface, NivaProgress, NivaSection } from "@/design-system";
import { nivaFocusRing, nivaTransition } from "@/design-system/tokens";

const today = new Date("2026-06-29T00:00:00");

function daysUntil(date: string) {
  const due = new Date(`${date}T00:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function formatDueLabel(days: number) {
  if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  return `Vence en ${days} días`;
}

function amountToneForMovement(type: string) {
  if (type === "Ingreso") return "positive" as const;
  if (type === "Gasto") return "negative" as const;
  return "neutral" as const;
}

function amountToneClass(tone: ReturnType<typeof amountToneForMovement>) {
  if (tone === "positive") return "text-[var(--niva-color-success)]";
  if (tone === "negative") return "text-[var(--niva-color-danger)]";
  return "text-[var(--niva-color-foreground)]";
}

function scheduledAmountTone(type: string) {
  if (type === "income") return "text-[var(--niva-color-success)]";
  if (type === "transfer") return "text-[var(--niva-color-info)]";
  return "text-[var(--niva-color-danger)]";
}

export function DashboardScreen() {
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState("Gasto");
  const { accounts, categories, movements, saveMovement, reload } = useMovements();
  const { saveAccount } = useAccounts();
  const { goals, scheduled: scheduledTransactions } = usePlanningData();

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
  const featuredGoalProgress = getFeaturedGoalProgress(featuredGoal);

  const availableRatio = availableToday > 0 ? Math.round((spendableToday / availableToday) * 100) : 0;

  async function addAccount(account: AccountFormValue) {
    const saved = await saveAccount(account, null);
    if (saved) await reload();
    return saved;
  }

  function openMovement(type: string) {
    setMovementType(type);
    setMovementDialogOpen(true);
  }

  async function addMovement(movement: MovementFormValue) {
    return saveMovement(movement);
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] space-y-10 px-1 pb-6 sm:px-2 lg:space-y-12">
      <NivaSection className="pt-2 sm:pt-4">
        <p className="text-sm font-medium text-[var(--niva-color-muted)]">Tu panorama financiero de hoy.</p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="max-w-[12ch] text-4xl font-semibold leading-[1.02] text-[var(--niva-color-foreground)] sm:text-5xl lg:text-6xl">
              Tu dinero, con calma.
            </h1>
          </div>
          <NivaButton type="button" size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => openMovement("Gasto")}>
            Nuevo registro
          </NivaButton>
        </div>
      </NivaSection>

      <NivaLayoutSurface className="rounded-[var(--niva-radius-3xl)] border-0 bg-[var(--niva-color-inverse-surface)] px-6 py-8 text-[var(--niva-color-inverse-foreground)] shadow-[var(--niva-shadow-xl)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-xs font-bold uppercase text-[var(--niva-color-inverse-muted)]">Resumen diario</p>
          <NivaBadge tone="success">Hoy</NivaBadge>
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
          <div className="min-w-0">
            <p className="max-w-4xl text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-5xl">
              Hay {formatCurrency(spendableToday)} libres para decidir y {formatCurrency(reservedBalance)} protegidos fuera del ruido diario.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--niva-color-inverse-muted)] sm:text-lg">
              En los próximos días aparecen {formatCurrency(upcomingExpenses)} programados. La lectura importante: tu reserva sigue separada y el margen de hoy permanece visible.
            </p>
          </div>
          <div className="border-t border-[var(--niva-color-inverse-subtle)] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-sm font-medium text-[var(--niva-color-inverse-muted)]">Margen disponible</p>
            <p className="mt-3 text-5xl font-semibold tracking-tight">{availableRatio}%</p>
            <p className="mt-4 text-sm leading-6 text-[var(--niva-color-inverse-muted)]">
              Del efectivo positivo queda accesible despues de apartar la reserva.
            </p>
          </div>
        </div>
      </NivaLayoutSurface>

      <NivaContentGrid columns={3} className="border-y border-[var(--niva-color-border)] py-6">
        {[
          { label: "Disponible", value: formatCurrency(spendableToday), helper: "Listo para hoy", tone: "text-[var(--niva-color-success)]" },
          { label: "Reservado", value: formatCurrency(reservedBalance), helper: "Separado de decisiones diarias", tone: "text-[var(--niva-color-muted)]" },
          { label: "Total", value: formatCurrency(netWorth), helper: "Patrimonio neto actual", tone: "text-[var(--niva-color-foreground)]" },
        ].map((item) => (
          <div key={item.label} className="min-w-0">
            <p className="text-xs font-bold uppercase text-[var(--niva-color-muted)]">{item.label}</p>
            <p className={cn("mt-3 break-words text-2xl font-semibold tracking-tight sm:text-3xl", item.tone)}>{item.value}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--niva-color-muted)]">{item.helper}</p>
          </div>
        ))}
      </NivaContentGrid>

      {nextScheduled ? (
        <section className="grid gap-5 lg:grid-cols-[12rem_minmax(0,1fr)] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase text-[var(--niva-color-muted)]">Próximo compromiso</p>
            <p className="mt-3 text-sm leading-6 text-[var(--niva-color-muted)]">Solo el siguiente evento.</p>
          </div>
          <NivaLayoutSurface className="px-5 py-5 sm:px-6">
            <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-info)]">
                  <CalendarClock className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-[var(--niva-color-foreground)]">{nextScheduled.name}</h2>
                  <p className={cn("mt-2 text-sm font-semibold", nextScheduledDays !== null && nextScheduledDays <= 5 ? "text-[var(--niva-color-warning)]" : "text-[var(--niva-color-muted)]")}>
                    {nextScheduledDays !== null ? formatDueLabel(nextScheduledDays) : "Sin fecha"}
                  </p>
                </div>
              </div>
              <p className={cn("text-2xl font-semibold tracking-tight", scheduledAmountTone(nextScheduled.type))}>
                {nextScheduled.type === "income" ? "+" : ""}
                {formatCurrency(nextScheduled.amount)}
              </p>
            </div>
          </NivaLayoutSurface>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]">
        <div className="min-w-0">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase text-[var(--niva-color-muted)]">Actividad reciente</p>
              <h2 className="mt-3 text-2xl font-semibold text-[var(--niva-color-foreground)]">Últimos movimientos</h2>
            </div>
            <Link
              href="/movements"
              className={cn("text-sm font-semibold text-[var(--niva-color-info)]", nivaTransition, nivaFocusRing, "hover:text-[var(--niva-color-accent-hover)]")}
            >
              Ver todos
            </Link>
          </div>

          <NivaLayoutSurface className="mt-5 divide-y divide-[var(--niva-color-border)] px-5">
            {recentMovements.map((movement) => {
              const tone = amountToneForMovement(movement.type);

              return (
                <div key={`${movement.date}-${movement.description}`} className="grid gap-4 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-info)]">
                      {movement.type === "Ingreso" ? <WalletCards className="h-5 w-5" /> : <ReceiptText className="h-5 w-5" />}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-[var(--niva-color-foreground)]">{movement.description}</h3>
                      <p className="mt-1 text-sm leading-6 text-[var(--niva-color-muted)]">
                        {movement.account} / {movement.category}
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className={cn("text-base font-semibold", amountToneClass(tone))}>{formatCurrency(movement.amount)}</p>
                    <p className="mt-1 text-xs font-bold text-[var(--niva-color-muted)]">{movement.date}</p>
                  </div>
                </div>
              );
            })}
          </NivaLayoutSurface>
        </div>

        <div className="grid min-w-0 gap-5">
          <NivaLayoutSurface variant="subtle" className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-surface)] text-[var(--niva-color-success)]">
                <Flag className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase text-[var(--niva-color-muted)]">Meta principal</p>
            </div>
            {featuredGoal ? (
              <>
                <h3 className="mt-5 text-xl font-semibold text-[var(--niva-color-foreground)]">{featuredGoal.name}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--niva-color-muted)]">
                  {formatCurrency(featuredGoal.current)} de {formatCurrency(featuredGoal.target)} para {featuredGoal.date}
                </p>
                <NivaProgress value={featuredGoalProgress} label={featuredGoal.name} className="mt-6" />
                <p className="mt-3 text-sm font-semibold text-[var(--niva-color-success)]">{featuredGoalProgress}% completado</p>
              </>
            ) : (
              <>
                <h3 className="mt-5 text-xl font-semibold text-[var(--niva-color-foreground)]">Define tu primera meta</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--niva-color-muted)]">
                  Convierte un objetivo importante en una cantidad y una fecha concretas.
                </p>
                <Link
                  href="/goals"
                  className={cn("mt-5 inline-flex min-h-9 items-center rounded-[var(--niva-radius-lg)] px-3 text-sm font-semibold text-[var(--niva-color-info)]", nivaTransition, nivaFocusRing, "hover:bg-[var(--niva-color-muted-surface)]")}
                >
                  Crear una meta
                </Link>
              </>
            )}
          </NivaLayoutSurface>

          <NivaLayoutSurface className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-info)]">
                <Lightbulb className="h-5 w-5" />
              </div>
              <p className="text-xs font-bold uppercase text-[var(--niva-color-muted)]">Lectura clave</p>
            </div>
            <h3 className="mt-5 text-xl font-semibold text-[var(--niva-color-foreground)]">Balance saludable</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--niva-color-muted)]">
              Tu balance mensual positivo cubre una parte relevante de gastos fijos. Mantener la reserva separada hace mas clara cada decision pequena.
            </p>
          </NivaLayoutSurface>

          <NivaButton
            type="button"
            variant="ghost"
            size="sm"
            className="justify-self-start"
            onClick={() => setAccountDialogOpen(true)}
          >
            Nueva cuenta
          </NivaButton>
        </div>
      </section>

      <AccountDialog open={accountDialogOpen} onClose={() => setAccountDialogOpen(false)} onSave={addAccount} />
      <MovementDialog open={movementDialogOpen} defaultType={movementType} accounts={accounts} categories={categories} onClose={() => setMovementDialogOpen(false)} onSave={addMovement} />
    </div>
  );
}
