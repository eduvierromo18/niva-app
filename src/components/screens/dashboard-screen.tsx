"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Lightbulb,
  Plus,
  ReceiptText,
  Sparkles,
  WalletCards,
} from "lucide-react";
import { AccountDialog, type AccountFormValue } from "@/components/finance/account-dialog";
import { MovementDialog, type MovementFormValue } from "@/components/finance/movement-dialog";
import { accounts as initialAccounts, goals, metrics, movements as initialMovements, scheduledTransactions } from "@/lib/finance-data";
import { cn, formatCurrency } from "@/lib/utils";
import {
  AuroraAccountCard,
  AuroraBadge,
  AuroraButton,
  AuroraCard,
  AuroraGoalCard,
  AuroraInsightCard,
  AuroraSection,
  AuroraStatCard,
  AuroraTimelineCard,
} from "@/components/aurora";

const today = new Date("2026-06-29T00:00:00");
const compactCardClass = "min-h-[148px] rounded-[20px]";

function daysUntil(date: string) {
  const due = new Date(`${date}T00:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function formatMetricValue(metric: (typeof metrics)[number]) {
  return metric.percent ? `${metric.value.toFixed(1)}%` : formatCurrency(metric.value);
}

function formatDelta(delta: number) {
  return `${delta > 0 ? "+" : ""}${delta.toFixed(1)}% vs. mes anterior`;
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
    <div className="space-y-8">
      <AuroraCard className="overflow-hidden rounded-[20px] p-0">
        <div className="grid min-w-0 gap-0 lg:grid-cols-[1.05fr_1fr]">
          <div className="flex min-h-[250px] min-w-0 flex-col justify-between p-6 sm:p-7">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <AuroraBadge tone="success">Estado saludable</AuroraBadge>
                <span className="text-xs font-semibold text-[#6B7280]">Última actualización: hoy</span>
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-[#111827] sm:text-4xl">Tu dinero</h1>
              <p className="mt-3 max-w-xl break-words text-sm leading-6 text-[#6B7280]">
                Vista tranquila de lo que tienes, lo que puedes usar y lo que conviene mantener reservado.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <AuroraButton type="button" size="sm" icon={<Plus className="h-4 w-4" />} onClick={() => openMovement("Gasto")}>
                Nuevo registro
              </AuroraButton>
              <AuroraButton type="button" size="sm" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => setAccountDialogOpen(true)}>
                Nueva cuenta
              </AuroraButton>
            </div>
          </div>

          <div className="grid min-w-0 border-t border-[#E5E7EB] bg-[#F9FAFB] sm:grid-cols-3 lg:border-l lg:border-t-0">
            {[
              { label: "Total", value: formatCurrency(netWorth), detail: "En todas tus cuentas", tone: "text-[#2563EB]" },
              { label: "Para gastar", value: formatCurrency(spendableToday), detail: "Sin tocar reserva", tone: "text-[#047857]" },
              { label: "Reservado", value: formatCurrency(reservedBalance), detail: "Ahorro separado", tone: "text-[#6B7280]" },
            ].map((item, index) => (
              <div key={item.label} className={cn("flex min-h-[126px] flex-col justify-between p-5", index > 0 && "border-t border-[#E5E7EB] sm:border-l sm:border-t-0")}>
                <p className="text-xs font-bold uppercase text-[#6B7280]">{item.label}</p>
                <div>
                  <p className={cn("whitespace-nowrap text-[22px] font-bold tracking-tight sm:text-2xl", item.tone)}>{item.value}</p>
                  <p className="mt-2 text-xs font-medium leading-5 text-[#6B7280]">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AuroraCard>

      <AuroraCard className="rounded-[20px] border-[#A7F3D0] bg-[#F7FEFB] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-bold text-[#047857]">Enfoque de hoy</p>
                <AuroraBadge tone="success">Sin alertas</AuroraBadge>
              </div>
              <h2 className="mt-2 text-xl font-bold text-[#111827]">Cubrir pagos cercanos sin mover tu reserva</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6B7280]">
                Hay {formatCurrency(upcomingExpenses)} programados en los próximos días. Tu margen para gastar se mantiene claro.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:w-[300px]">
            <div className="rounded-[16px] border border-[#D1FAE5] bg-white p-4">
              <p className="text-xs font-bold uppercase text-[#047857]">Todo al día</p>
              <p className="mt-2 text-sm font-semibold text-[#111827]">Pagos visibles</p>
            </div>
            <div className="rounded-[16px] border border-[#DBEAFE] bg-white p-4">
              <p className="text-xs font-bold uppercase text-[#2563EB]">Margen</p>
              <p className="mt-2 text-sm font-semibold text-[#111827]">{formatCurrency(spendableToday)}</p>
            </div>
          </div>
        </div>
      </AuroraCard>

      <AuroraSection title="Resumen financiero" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <AuroraStatCard
              key={metric.label}
              label={metric.label}
              value={formatMetricValue(metric)}
              delta={formatDelta(metric.delta)}
              trend={metric.trend}
              icon={<metric.icon className="h-5 w-5" />}
              className={compactCardClass}
            />
          ))}
        </div>
      </AuroraSection>

      <AuroraSection
        title="Mis cuentas"
        action={<Link href="/accounts" className="text-sm font-bold text-[#2563EB]">Ver detalle</Link>}
        className="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {accounts.map((account) => (
            <AuroraAccountCard
              key={account.id ?? account.name}
              institution={account.alias ?? account.type}
              account={account.name}
              balance={formatCurrency(account.balance)}
              meta={account.type}
              icon={<account.icon className="h-5 w-5" />}
              status={account.balance >= 0 ? "active" : "muted"}
              statusLabel={account.balance >= 0 ? "Al día" : "Por revisar"}
              statusTone={account.balance >= 0 ? "success" : "neutral"}
              className={compactCardClass}
            />
          ))}
        </div>
      </AuroraSection>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <AuroraCard
          title="Actividad reciente"
          action={<AuroraButton type="button" size="sm" variant="ghost" onClick={() => openMovement("Gasto")}>Nuevo</AuroraButton>}
          className="rounded-[20px]"
        >
          <div className="space-y-3">
            {movements.slice(0, 5).map((movement, index) => (
              <AuroraTimelineCard
                key={`${movement.date}-${movement.description}-${index}`}
                date={movement.date}
                title={movement.description}
                description={`${movement.account} - ${movement.category}`}
                amount={formatCurrency(movement.amount)}
                amountTone={amountToneForMovement(movement.type)}
                icon={movement.type === "Ingreso" ? <WalletCards className="h-4 w-4" /> : <ReceiptText className="h-4 w-4" />}
                className="shadow-none"
              />
            ))}
          </div>
        </AuroraCard>

        <AuroraCard
          title="Programados próximos"
          action={<Link href="/programados" className="text-sm font-bold text-[#2563EB]">Ver todos</Link>}
          className="rounded-[20px]"
        >
          <div className="space-y-3">
            {upcomingScheduled.map((item) => {
              const days = daysUntil(item.nextDueDate);
              const isIncome = item.type === "income";
              return (
                <div key={item.id} className="flex items-center gap-4 rounded-[20px] bg-[#F9FAFB] p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#111827]">{item.name}</p>
                    <p className={cn("mt-1 text-xs font-semibold", days <= 5 ? "text-[#B45309]" : "text-[#6B7280]")}>{formatDueLabel(days)}</p>
                  </div>
                  <p className={cn("shrink-0 text-sm font-bold", scheduledAmountTone(item.type))}>
                    {isIncome ? "+" : ""}
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </AuroraCard>
      </section>

      <AuroraSection title="Objetivos" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {goals.slice(0, 3).map((goal) => (
            <AuroraGoalCard
              key={goal.name}
              title={goal.name}
              current={formatCurrency(goal.current)}
              target={formatCurrency(goal.target)}
              progress={Math.round((goal.current / goal.target) * 100)}
              className="rounded-[20px]"
            />
          ))}
        </div>
      </AuroraSection>

      <AuroraSection title="Insights" className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <AuroraInsightCard
            icon={<Sparkles className="h-5 w-5" />}
            tone="warning"
            title="Restaurantes subieron"
            description="Gastaste 18% más que el mes pasado en comida fuera de casa."
            className="rounded-[20px]"
          />
          <AuroraInsightCard
            icon={<Lightbulb className="h-5 w-5" />}
            tone="success"
            title="Balance saludable"
            description="Tu balance mensual positivo cubre una parte relevante de gastos fijos."
            className="rounded-[20px]"
          />
        </div>
      </AuroraSection>

      <AccountDialog open={accountDialogOpen} onClose={() => setAccountDialogOpen(false)} onSave={addAccount} />
      <MovementDialog open={movementDialogOpen} defaultType={movementType} accounts={accounts} onClose={() => setMovementDialogOpen(false)} onSave={addMovement} />
    </div>
  );
}
