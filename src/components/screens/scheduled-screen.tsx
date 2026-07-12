"use client";

import { useMemo, useState } from "react";
import {
  ArrowRightLeft,
  BellRing,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Pause,
  Play,
  Plus,
  ReceiptText,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { ScheduledTransactionDialog } from "@/components/finance/ScheduledTransactionDialog";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { usePlanningData } from "@/hooks/use-planning-data";
import type {
  FinanceAccount,
  FinanceMovement,
  ScheduledFrequency,
  ScheduledTransaction,
  ScheduledTransactionType,
} from "@/lib/finance-types";
import {
  NivaBadge,
  NivaBankLogo,
  NivaButton,
  NivaCard,
  NivaEmptyState,
} from "@/design-system";
import { cn, formatCurrency } from "@/lib/utils";

const typeLabel: Record<ScheduledTransactionType, string> = {
  expense: "Gasto fijo",
  income: "Ingreso recurrente",
  transfer: "Transferencia",
  debt_payment: "Pago de deuda",
  subscription: "Suscripción",
};

const frequencyLabel: Record<ScheduledFrequency, string> = {
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
  yearly: "Anual",
  custom: "Personalizada",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function daysUntil(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${date}T00:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function formatDueText(days: number) {
  if (days < 0) return `Vencido hace ${Math.abs(days)} días`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence mañana";
  return `Vence en ${days} días`;
}

function scheduledIcon(type: ScheduledTransactionType) {
  if (type === "income") return RefreshCw;
  if (type === "transfer") return ArrowRightLeft;
  if (type === "debt_payment") return CreditCard;
  if (type === "subscription") return BellRing;
  return ReceiptText;
}

function badgeTone(item: ScheduledTransaction) {
  if (item.status === "paused") return "warning" as const;
  if (item.status === "finished") return "neutral" as const;
  if (item.type === "income") return "success" as const;
  if (item.type === "transfer" || item.type === "debt_payment") return "info" as const;
  return "neutral" as const;
}

function amountColor(type: ScheduledTransactionType) {
  if (type === "income") return "text-[var(--niva-color-success)]";
  if (type === "transfer" || type === "debt_payment") return "text-[var(--niva-color-info)]";
  return "text-[var(--niva-color-foreground)]";
}

function movementFromScheduled(item: ScheduledTransaction): FinanceMovement {
  const isIncome = item.type === "income";
  const isTransfer = item.type === "transfer" || item.type === "debt_payment";
  return {
    id: `${item.id}-${new Date().toISOString()}`,
    date: "Hoy",
    description: item.name,
    merchant: typeLabel[item.type],
    account: item.account,
    destinationAccount: item.destinationAccount,
    category: isTransfer ? "Transferencia" : item.category ?? "Programado",
    type: isTransfer ? "Transferencia" : isIncome ? "Ingreso" : "Gasto",
    amount: isIncome || isTransfer ? item.amount : -item.amount,
  };
}

function ScheduledItem({
  item,
  accounts,
  onPaid,
  onEdit,
  onToggle,
  onDelete,
}: {
  item: ScheduledTransaction;
  accounts: FinanceAccount[];
  onPaid: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const Icon = scheduledIcon(item.type);
  const account = accounts.find((entry) => entry.name === item.account);
  const dueDays = daysUntil(item.nextDueDate);
  const dueText = formatDueText(dueDays);
  const statusLabel = item.status === "active" ? "Activo" : item.status === "paused" ? "Pausado" : "Finalizado";

  return (
    <NivaCard className="p-5 transition-[box-shadow] duration-[var(--niva-motion-base)] hover:shadow-[var(--niva-shadow-md)]">
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--niva-radius-lg)] bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-info)]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold tracking-[-0.02em] text-[var(--niva-color-foreground)]">{item.name}</h3>
              <NivaBadge tone={badgeTone(item)}>{typeLabel[item.type]}</NivaBadge>
              <NivaBadge tone={item.status === "active" ? "success" : item.status === "paused" ? "warning" : "neutral"}>
                {statusLabel}
              </NivaBadge>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[var(--niva-color-muted)]">
              {account?.bank_name ? (
                <span className="inline-flex items-center gap-2">
                  <NivaBankLogo
                    bankName={account.bank_name}
                    bankCustomName={account.bank_custom_name}
                    size="sm"
                    className="h-7 w-7 border-0 p-1 shadow-none"
                  />
                  {item.account}
                </span>
              ) : (
                <span>{item.account}</span>
              )}
              {item.destinationAccount ? <span>{`${item.account} a ${item.destinationAccount}`}</span> : <span>{item.category}</span>}
              <span>{frequencyLabel[item.frequency]}</span>
              <span className="font-[family-name:var(--font-niva-mono)] text-xs">{formatDate(item.nextDueDate)}</span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className={cn("font-[family-name:var(--font-niva-display)] text-xl font-semibold tracking-[-0.03em]", amountColor(item.type))}>
            {item.type === "income" ? "+" : ""}
            {formatCurrency(item.amount)}
          </p>
          <p className={cn("mt-1 text-sm", dueDays <= 5 && item.status === "active" ? "font-semibold text-[var(--niva-color-foreground)]" : "text-[var(--niva-color-muted)]")}>
            {dueText}
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--niva-color-border)] pt-4">
        <NivaButton type="button" size="sm" iconLeft={<CheckCircle2 className="h-4 w-4" />} onClick={onPaid} disabled={item.status !== "active"}>
          Marcar como pagado
        </NivaButton>
        <NivaButton type="button" variant="secondary" size="sm" onClick={onEdit}>
          Editar
        </NivaButton>
        <NivaButton
          type="button"
          variant="secondary"
          size="sm"
          iconLeft={item.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          onClick={onToggle}
        >
          {item.status === "paused" ? "Reactivar" : "Pausar"}
        </NivaButton>
        <NivaButton type="button" variant="danger" size="sm" iconLeft={<Trash2 className="h-4 w-4" />} onClick={onDelete}>
          Eliminar
        </NivaButton>
      </div>
    </NivaCard>
  );
}

export function ScheduledScreen() {
  const {
    scheduled,
    accounts,
    error,
    saveScheduled: persistScheduled,
    toggleScheduled,
    confirmScheduled,
    remove,
  } = usePlanningData();
  const [movementsCreated, setMovementsCreated] = useState<FinanceMovement[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingItem = scheduled.find((item) => item.id === editingId) ?? null;

  const sections = useMemo(() => {
    const active = scheduled
      .filter((item) => item.status === "active")
      .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate));
    return [
      { title: "Próximos", rows: active.slice(0, 5) },
      { title: "Gastos fijos", rows: scheduled.filter((item) => item.type === "expense" && item.status === "active") },
      { title: "Ingresos recurrentes", rows: scheduled.filter((item) => item.type === "income" && item.status === "active") },
      { title: "Suscripciones", rows: scheduled.filter((item) => item.type === "subscription" && item.status === "active") },
      { title: "Pausados", rows: scheduled.filter((item) => item.status === "paused") },
    ];
  }, [scheduled]);

  async function saveScheduled(value: ScheduledTransaction) {
    const saved = await persistScheduled(value);
    if (saved) setEditingId(null);
    return saved;
  }

  async function markPaid(item: ScheduledTransaction) {
    const saved = await confirmScheduled(item.id);
    if (saved) setMovementsCreated((current) => [movementFromScheduled(item), ...current]);
  }

  return (
    <PageScaffold
      title="Programados"
      description="Gastos fijos, ingresos recurrentes y suscripciones."
      action={
        <NivaButton
          type="button"
          iconLeft={<Plus className="h-4 w-4" />}
          onClick={() => {
            setEditingId(null);
            setOpen(true);
          }}
        >
          Nuevo programado
        </NivaButton>
      }
    >
      {error ? (
        <div className="mb-5 rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-4 text-sm text-[var(--niva-color-foreground)]">
          {error}
        </div>
      ) : null}

      <NivaCard className="mb-8 p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_240px] md:items-center">
          <div>
            <p className="font-semibold text-[var(--niva-color-foreground)]">Flujo recurrente estimado</p>
            <p className="mt-1 text-sm leading-6 text-[var(--niva-color-muted)]">
              Revisa vencimientos y confirma pagos antes de crear registros.
            </p>
          </div>
          <div className="rounded-[var(--niva-radius-lg)] bg-[var(--niva-color-accent-surface)] p-4">
            <p className="text-sm font-semibold text-[var(--niva-color-accent)]">
              {scheduled.filter((item) => item.status === "active").length} programados activos
            </p>
            <p className="mt-1 text-xs leading-5 text-[var(--niva-color-muted)]">Los registros se crean solo al confirmar pago.</p>
          </div>
        </div>
      </NivaCard>

      <div className="space-y-9">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <div className="flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-[var(--niva-color-muted)]" />
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--niva-color-foreground)]">{section.title}</h2>
              <span className="text-sm text-[var(--niva-color-muted)]">({section.rows.length})</span>
            </div>
            {section.rows.length > 0 ? (
              <div className="grid gap-3">
                {section.rows.map((item) => (
                  <ScheduledItem
                    key={item.id}
                    item={item}
                    accounts={accounts}
                    onPaid={() => void markPaid(item)}
                    onEdit={() => {
                      setEditingId(item.id);
                      setOpen(true);
                    }}
                    onToggle={() => void toggleScheduled(item)}
                    onDelete={() => void remove("scheduled_transactions", item.id)}
                  />
                ))}
              </div>
            ) : (
              <NivaEmptyState
                title="Sin pagos en esta sección"
                description="Cuando haya programados que coincidan, aparecerán aquí."
                icon={<CalendarClock className="h-8 w-8" />}
                className="border-dashed bg-[var(--niva-color-muted-surface)] shadow-none"
              />
            )}
          </section>
        ))}
      </div>

      {movementsCreated.length > 0 ? (
        <NivaCard className="mt-9 p-5">
          <h2 className="text-lg font-semibold text-[var(--niva-color-foreground)]">Registros creados desde programados</h2>
          <div className="mt-4 space-y-2">
            {movementsCreated.slice(0, 4).map((movement) => (
              <div key={movement.id} className="flex items-center justify-between rounded-[var(--niva-radius-lg)] bg-[var(--niva-color-muted-surface)] px-4 py-3 text-sm">
                <span className="font-semibold">{movement.description}</span>
                <span className={movement.amount < 0 ? "font-semibold text-[var(--niva-color-foreground)]" : "font-semibold text-[var(--niva-color-success)]"}>
                  {formatCurrency(movement.amount)}
                </span>
              </div>
            ))}
          </div>
        </NivaCard>
      ) : null}

      <ScheduledTransactionDialog
        open={open}
        initialValue={editingItem}
        accounts={accounts}
        onClose={() => {
          setOpen(false);
          setEditingId(null);
        }}
        onSave={saveScheduled}
      />
    </PageScaffold>
  );
}
