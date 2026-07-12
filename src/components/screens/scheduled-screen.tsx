"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, BellRing, CalendarClock, CheckCircle2, CreditCard, Pause, Play, Plus, ReceiptText, RefreshCw, Trash2 } from "lucide-react";
import { ScheduledTransactionDialog } from "@/components/finance/ScheduledTransactionDialog";
import { usePlanningData } from "@/hooks/use-planning-data";
import type { FinanceAccount, FinanceMovement, ScheduledFrequency, ScheduledTransaction, ScheduledTransactionType } from "@/lib/finance-types";
import { AuroraBadge, AuroraBankLogo, AuroraButton, AuroraCard, AuroraEmptyState, AuroraSection } from "@/components/aurora";
import { cn, formatCurrency } from "@/lib/utils";

const typeLabel: Record<ScheduledTransactionType, string> = {
  expense: "Gasto fijo",
  income: "Ingreso recurrente",
  transfer: "Transferencia",
  debt_payment: "Pago de deuda",
  subscription: "SuscripciÃ³n",
};

const frequencyLabel: Record<ScheduledFrequency, string> = {
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
  yearly: "Anual",
  custom: "Personalizada",
};



function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function daysUntil(date: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${date}T00:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function formatDueText(days: number) {
  if (days < 0) return `Vencido hace ${Math.abs(days)} dÃ­as`;
  if (days === 0) return "Vence hoy";
  if (days === 1) return "Vence maÃ±ana";
  return `Vence en ${days} dÃ­as`;
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
  return "danger" as const;
}

function amountColor(type: ScheduledTransactionType) {
  if (type === "income") return "text-[#047857]";
  if (type === "transfer" || type === "debt_payment") return "text-[#2563EB]";
  return "text-[#DC2626]";
}

function movementFromScheduled(item: ScheduledTransaction): FinanceMovement {
  const isIncome = item.type === "income";
  const isTransfer = item.type === "transfer" || item.type === "debt_payment";
  return {
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
    <article className="rounded-[20px] border border-[#E5E7EB] bg-white p-4 shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-[#111827]">{item.name}</h3>
              <AuroraBadge tone={badgeTone(item)}>{typeLabel[item.type]}</AuroraBadge>
              <AuroraBadge tone={item.status === "active" ? "success" : item.status === "paused" ? "warning" : "neutral"}>{statusLabel}</AuroraBadge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
              {account?.bank_name ? (
                <span className="inline-flex items-center gap-2">
                  <AuroraBankLogo bankName={account.bank_name} bankCustomName={account.bank_custom_name} size="sm" className="h-7 w-7 border-0 shadow-none" />
                  {item.account}
                </span>
              ) : (
                <span>{item.account}</span>
              )}
              {item.destinationAccount ? <span>{`${item.account} a ${item.destinationAccount}`}</span> : <span>{item.category}</span>}
              <span>{frequencyLabel[item.frequency]}</span>
              <span>{formatDate(item.nextDueDate)}</span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className={cn("text-xl font-bold", amountColor(item.type))}>{item.type === "income" ? "+" : ""}{formatCurrency(item.amount)}</p>
          <p className={dueDays <= 5 && item.status === "active" ? "mt-1 text-sm font-semibold text-[#B45309]" : "mt-1 text-sm text-[#6B7280]"}>{dueText}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <AuroraButton type="button" size="sm" className="bg-[#047857] shadow-[0_4px_12px_rgba(4,120,87,0.22)] hover:bg-[#065F46]" onClick={onPaid} disabled={item.status !== "active"}>
          <CheckCircle2 className="h-4 w-4" />
          Marcar como pagado
        </AuroraButton>
        <AuroraButton type="button" variant="secondary" size="sm" onClick={onEdit}>Editar</AuroraButton>
        <AuroraButton type="button" variant="secondary" size="sm" onClick={onToggle}>
          {item.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          {item.status === "paused" ? "Reactivar" : "Pausar"}
        </AuroraButton>
        <AuroraButton type="button" variant="danger" size="sm" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Eliminar
        </AuroraButton>
      </div>
    </article>
  );
}

export function ScheduledScreen() {
  const { scheduled, accounts, error, saveScheduled: persistScheduled, toggleScheduled, confirmScheduled, remove } = usePlanningData();
  const [movementsCreated, setMovementsCreated] = useState<FinanceMovement[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingItem = scheduled.find((item) => item.id === editingId) ?? null;

  const sections = useMemo(() => {
    const active = scheduled.filter((item) => item.status === "active").sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate));
    return [
      { title: "PrÃ³ximos", rows: active.slice(0, 5) },
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
    <div className="space-y-8">
      <AuroraSection
        eyebrow="Programados"
        title="Programados"
        description="Gastos fijos, ingresos recurrentes y suscripciones."
        action={
          <AuroraButton type="button" icon={<Plus className="h-4 w-4" />} className="bg-[#047857] shadow-[0_4px_12px_rgba(4,120,87,0.22)] hover:bg-[#065F46]" onClick={() => { setEditingId(null); setOpen(true); }}>
            Nuevo programado
          </AuroraButton>
        }
      />

      {error ? <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}

      <AuroraCard className="rounded-[20px] p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_240px] md:items-center">
          <div>
            <p className="text-sm font-bold text-[#111827]">Flujo recurrente estimado</p>
            <p className="mt-1 text-sm leading-6 text-[#6B7280]">
              Revisa vencimientos y confirma pagos antes de crear registros.
            </p>
          </div>
          <div className="rounded-[20px] bg-[#ECFDF5] p-4">
            <p className="text-sm font-bold text-[#047857]">{scheduled.filter((item) => item.status === "active").length} programados activos</p>
            <p className="mt-1 text-xs leading-5 text-[#6B7280]">Los registros se crean solo al confirmar pago.</p>
          </div>
        </div>
      </AuroraCard>

      {sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-[#6B7280]" />
            <h2 className="text-lg font-bold text-[#111827]">{section.title}</h2>
            <span className="text-sm text-[#6B7280]">({section.rows.length})</span>
          </div>
          {section.rows.length > 0 ? (
            <div className="grid gap-3">
              {section.rows.map((item) => (
                <ScheduledItem
                  key={item.id}
                  item={item}
                  accounts={accounts}
                  onPaid={() => markPaid(item)}
                  onEdit={() => { setEditingId(item.id); setOpen(true); }}
                  onToggle={() => void toggleScheduled(item)}
                  onDelete={() => void remove("scheduled_transactions", item.id)}
                />
              ))}
            </div>
          ) : (
            <AuroraEmptyState
              title="Sin pagos en esta secciÃ³n"
              description="Cuando haya programados que coincidan, aparecerÃ¡n aquÃ­."
              icon={<CalendarClock className="h-8 w-8" />}
              className="border-dashed bg-[#F9FAFB] shadow-none"
            />
          )}
        </section>
      ))}

      {movementsCreated.length > 0 ? (
        <AuroraCard title="Registros creados desde programados" className="rounded-[20px]">
          <div className="space-y-2">
            {movementsCreated.slice(0, 4).map((movement, index) => (
              <div key={`${movement.description}-${index}`} className="flex items-center justify-between rounded-xl bg-[#F9FAFB] px-4 py-3 text-sm">
                <span className="font-semibold">{movement.description}</span>
                <span className={movement.amount < 0 ? "font-bold text-[#DC2626]" : "font-bold text-[#047857]"}>{formatCurrency(movement.amount)}</span>
              </div>
            ))}
          </div>
        </AuroraCard>
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
    </div>
  );
}



