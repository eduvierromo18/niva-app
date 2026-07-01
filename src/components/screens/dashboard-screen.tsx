"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowDownLeft,
  ArrowRightLeft,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Lightbulb,
  PiggyBank,
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
  if (days < 0) return `Vencido hace ${Math.abs(days)} dias`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence manana";
  return `Vence en ${days} dias`;
}

export function DashboardScreen() {
  const router = useRouter();
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [movementDialogOpen, setMovementDialogOpen] = useState(false);
  const [movementType, setMovementType] = useState("Gasto");
  const [accounts, setAccounts] = useState(initialAccounts);
  const [movements, setMovements] = useState(initialMovements);

  const netWorth = accounts.reduce((sum, account) => sum + account.balance, 0);
  const availableToday = accounts
    .filter((account) => account.type !== "Tarjeta")
    .reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const upcomingScheduled = scheduledTransactions
    .filter((item) => item.status === "active")
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))
    .slice(0, 4);

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
    <div className="space-y-10">
      <AuroraCard className="rounded-[20px] p-6 sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1fr_320px] xl:items-end">
          <div>
            <AuroraBadge tone="success">Inicio</AuroraBadge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">Tu dinero</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6B7280]">
              Hola, Luis. Tu dinero esta estable y listo para cubrir los pagos cercanos sin tocar tu reserva.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <AuroraButton type="button" icon={<Plus className="h-4 w-4" />} onClick={() => openMovement("Gasto")}>
                Nuevo registro
              </AuroraButton>
              <AuroraButton type="button" variant="secondary" icon={<Plus className="h-4 w-4" />} onClick={() => setAccountDialogOpen(true)}>
                Nueva cuenta
              </AuroraButton>
            </div>
          </div>

          <div className="rounded-[20px] border border-[#DBEAFE] bg-[#EFF6FF] p-6">
            <p className="text-sm font-bold text-[#2563EB]">Tu dinero</p>
            <p className="mt-3 text-4xl font-bold tracking-tight text-[#111827]">{formatCurrency(netWorth)}</p>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">
              {formatCurrency(availableToday)} disponible hoy sin considerar tarjetas de credito.
            </p>
            <Link href="/accounts" className="mt-5 inline-flex text-sm font-bold text-[#2563EB]">
              Ver detalle
            </Link>
          </div>
        </div>
      </AuroraCard>

      <AuroraCard className="rounded-[20px] border-[#A7F3D0] p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#047857]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#047857]">Enfoque de hoy</p>
              <h2 className="mt-2 text-2xl font-bold text-[#111827]">Cubrir pagos cercanos sin mover tu reserva</h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-[#6B7280]">
                Tienes pagos programados esta semana. Tu dinero disponible permite cubrirlos si mantienes los gastos variables bajo control.
              </p>
            </div>
          </div>
          <div className="rounded-[20px] bg-[#ECFDF5] p-5">
            <p className="text-xs font-bold uppercase text-[#047857]">Tu dinero disponible</p>
            <p className="mt-3 text-3xl font-bold text-[#111827]">{formatCurrency(availableToday)}</p>
            <p className="mt-2 text-xs leading-5 text-[#6B7280]">Lectura diaria para decidir con calma.</p>
          </div>
        </div>
      </AuroraCard>

      <AuroraSection title="Resumen del mes">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <AuroraStatCard
              key={metric.label}
              label={metric.label}
              value={formatMetricValue(metric)}
              delta={formatDelta(metric.delta)}
              trend={metric.trend}
              icon={<metric.icon className="h-5 w-5" />}
              className="rounded-[20px]"
            />
          ))}
        </div>
      </AuroraSection>

      <AuroraSection title="Acciones rapidas">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { icon: ArrowDownLeft, label: "Registro", description: "Registra gasto o ingreso", onClick: () => openMovement("Gasto") },
            { icon: ArrowRightLeft, label: "Transferencia", description: "Entre tus cuentas", onClick: () => openMovement("Transferencia") },
            { icon: CalendarClock, label: "Programado", description: "Pagos recurrentes", onClick: () => router.push("/programados") },
            { icon: PiggyBank, label: "Cuenta", description: "Agrega un saldo", onClick: () => setAccountDialogOpen(true) },
          ].map((action) => (
            <button key={action.label} type="button" onClick={action.onClick} className="text-left">
              <AuroraCard className="h-full rounded-[20px] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-[#111827]">{action.label}</p>
                    <p className="mt-1 text-sm leading-6 text-[#6B7280]">{action.description}</p>
                  </div>
                </div>
              </AuroraCard>
            </button>
          ))}
        </div>
      </AuroraSection>

      <AuroraSection
        title="Mis cuentas"
        action={<Link href="/accounts" className="text-sm font-bold text-[#2563EB]">Ver detalle</Link>}
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
              className="rounded-[20px]"
            />
          ))}
        </div>
      </AuroraSection>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AuroraCard
          title="Proximos pagos"
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
                  <p className={cn("shrink-0 text-sm font-bold", isIncome ? "text-[#047857]" : "text-[#111827]")}>
                    {isIncome ? "+" : ""}
                    {formatCurrency(item.amount)}
                  </p>
                </div>
              );
            })}
          </div>
        </AuroraCard>

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
                icon={movement.type === "Ingreso" ? <WalletCards className="h-4 w-4" /> : <ReceiptText className="h-4 w-4" />}
                className="shadow-none"
              />
            ))}
          </div>
        </AuroraCard>
      </section>

      <AuroraSection title="Insights">
        <div className="grid gap-4 lg:grid-cols-2">
          <AuroraInsightCard
            icon={<Sparkles className="h-5 w-5" />}
            tone="warning"
            title="Restaurantes subieron"
            description="Gastaste 18% mas que el mes pasado en comida fuera de casa."
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

      <AuroraSection title="Metas">
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

      <AccountDialog open={accountDialogOpen} onClose={() => setAccountDialogOpen(false)} onSave={addAccount} />
      <MovementDialog open={movementDialogOpen} defaultType={movementType} accounts={accounts} onClose={() => setMovementDialogOpen(false)} onSave={addMovement} />
    </div>
  );
}
