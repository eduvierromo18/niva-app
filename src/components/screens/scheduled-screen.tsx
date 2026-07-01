"use client";

import { useMemo, useState } from "react";
import { ArrowRightLeft, BellRing, CalendarClock, CheckCircle2, CreditCard, Pause, Play, Plus, ReceiptText, RefreshCw, Trash2 } from "lucide-react";
import { BankAvatar } from "@/components/finance/BankAvatar";
import { ScheduledTransactionDialog } from "@/components/finance/ScheduledTransactionDialog";
import { accounts, scheduledTransactions as initialScheduled } from "@/lib/finance-data";
import type { FinanceMovement, ScheduledFrequency, ScheduledTransaction, ScheduledTransactionType } from "@/lib/finance-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

const typeLabel: Record<ScheduledTransactionType, string> = {
  expense: "Gasto fijo",
  income: "Ingreso recurrente",
  transfer: "Transferencia",
  debt_payment: "Pago de deuda",
  subscription: "Suscripcion",
};

const frequencyLabel: Record<ScheduledFrequency, string> = {
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
  yearly: "Anual",
  custom: "Personalizada",
};

function addFrequency(date: string, frequency: ScheduledFrequency) {
  const next = new Date(`${date}T00:00:00`);
  if (frequency === "weekly") next.setDate(next.getDate() + 7);
  if (frequency === "biweekly") next.setDate(next.getDate() + 14);
  if (frequency === "monthly" || frequency === "custom") next.setMonth(next.getMonth() + 1);
  if (frequency === "yearly") next.setFullYear(next.getFullYear() + 1);
  return next.toISOString().slice(0, 10);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T00:00:00`));
}

function daysUntil(date: string) {
  const today = new Date("2026-06-27T00:00:00");
  const due = new Date(`${date}T00:00:00`);
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

function scheduledIcon(type: ScheduledTransactionType) {
  if (type === "income") return RefreshCw;
  if (type === "transfer") return ArrowRightLeft;
  if (type === "debt_payment") return CreditCard;
  if (type === "subscription") return BellRing;
  return ReceiptText;
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
  onPaid,
  onEdit,
  onToggle,
  onDelete,
}: {
  item: ScheduledTransaction;
  onPaid: () => void;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const Icon = scheduledIcon(item.type);
  const account = accounts.find((entry) => entry.name === item.account);
  const dueDays = daysUntil(item.nextDueDate);
  const dueText = dueDays < 0 ? `Vencido hace ${Math.abs(dueDays)} dias` : dueDays === 0 ? "Vence hoy" : `Vence en ${dueDays} dias`;

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-bold text-slate-950 dark:text-zinc-50">{item.name}</h3>
              <Badge>{typeLabel[item.type]}</Badge>
              <Badge className={item.status === "paused" ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-200" : undefined}>{item.status === "active" ? "Activo" : item.status === "paused" ? "Pausado" : "Finalizado"}</Badge>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-zinc-400">
              {account?.bank_name ? <BankAvatar bankName={account.bank_name} bankCustomName={account.bank_custom_name} size="sm" showName /> : <span>{item.account}</span>}
              {item.destinationAccount ? <span>{`${item.account} -> ${item.destinationAccount}`}</span> : <span>{item.category}</span>}
              <span>{frequencyLabel[item.frequency]}</span>
              <span>{formatDate(item.nextDueDate)}</span>
            </div>
          </div>
        </div>
        <div className="text-left md:text-right">
          <p className={item.type === "income" ? "text-xl font-bold text-emerald-700" : "text-xl font-bold text-slate-950 dark:text-zinc-50"}>{item.type === "income" ? "+" : ""}{formatCurrency(item.amount)}</p>
          <p className={dueDays <= 5 && item.status === "active" ? "mt-1 text-sm font-semibold text-amber-700" : "mt-1 text-sm text-slate-500"}>{dueText}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" className="h-9 px-3" onClick={onPaid} disabled={item.status !== "active"}>
          <CheckCircle2 className="h-4 w-4" />
          Marcar como pagado
        </Button>
        <Button type="button" variant="secondary" className="h-9 px-3" onClick={onEdit}>Editar</Button>
        <Button type="button" variant="secondary" className="h-9 px-3" onClick={onToggle}>
          {item.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          {item.status === "paused" ? "Reactivar" : "Pausar"}
        </Button>
        <Button type="button" variant="ghost" className="h-9 px-3 text-rose-600" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </div>
    </article>
  );
}

export function ScheduledScreen() {
  const [scheduled, setScheduled] = useState(initialScheduled);
  const [movementsCreated, setMovementsCreated] = useState<FinanceMovement[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingItem = scheduled.find((item) => item.id === editingId) ?? null;

  const sections = useMemo(() => {
    const active = scheduled.filter((item) => item.status === "active").sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate));
    return [
      { title: "Proximos", rows: active.slice(0, 5) },
      { title: "Gastos fijos", rows: scheduled.filter((item) => item.type === "expense" && item.status === "active") },
      { title: "Ingresos recurrentes", rows: scheduled.filter((item) => item.type === "income" && item.status === "active") },
      { title: "Suscripciones", rows: scheduled.filter((item) => item.type === "subscription" && item.status === "active") },
      { title: "Pausados", rows: scheduled.filter((item) => item.status === "paused") },
    ];
  }, [scheduled]);

  function saveScheduled(value: ScheduledTransaction) {
    setScheduled((current) => current.some((item) => item.id === value.id) ? current.map((item) => item.id === value.id ? value : item) : [value, ...current]);
    setEditingId(null);
  }

  function markPaid(item: ScheduledTransaction) {
    setMovementsCreated((current) => [movementFromScheduled(item), ...current]);
    setScheduled((current) => current.map((entry) => entry.id === item.id ? { ...entry, nextDueDate: addFrequency(entry.nextDueDate, entry.frequency) } : entry));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">Calendario financiero</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950 dark:text-zinc-50">Programados</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">Gastos fijos, ingresos recurrentes y suscripciones.</p>
        </div>
        <Button type="button" onClick={() => { setEditingId(null); setOpen(true); }}>
          <Plus className="h-4 w-4" />
          Nuevo programado
        </Button>
      </div>

      <Card>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-[1fr_240px] md:items-center">
            <div>
              <p className="text-sm font-bold text-slate-950 dark:text-zinc-50">Flujo recurrente estimado</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                Revisa vencimientos y confirma pagos antes de crear registros.
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4 dark:bg-emerald-950">
              <p className="text-sm font-bold text-emerald-900 dark:text-emerald-100">{scheduled.filter((item) => item.status === "active").length} programados activos</p>
              <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-200">Los registros se crean solo al confirmar pago.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {sections.map((section) => (
        <section key={section.title} className="space-y-3">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-slate-500" />
            <h2 className="text-lg font-bold text-slate-950 dark:text-zinc-50">{section.title}</h2>
            <span className="text-sm text-slate-500">({section.rows.length})</span>
          </div>
          {section.rows.length > 0 ? (
            <div className="grid gap-3">
              {section.rows.map((item) => (
                <ScheduledItem
                  key={item.id}
                  item={item}
                  onPaid={() => markPaid(item)}
                  onEdit={() => { setEditingId(item.id); setOpen(true); }}
                  onToggle={() => setScheduled((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: entry.status === "paused" ? "active" : "paused" } : entry))}
                  onDelete={() => setScheduled((current) => current.filter((entry) => entry.id !== item.id))}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-zinc-800 dark:bg-zinc-950">No hay elementos en esta seccion.</div>
          )}
        </section>
      ))}

      {movementsCreated.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Registros creados desde programados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {movementsCreated.slice(0, 4).map((movement, index) => (
              <div key={`${movement.description}-${index}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm dark:bg-zinc-900">
                <span className="font-semibold">{movement.description}</span>
                <span className={movement.amount < 0 ? "font-bold text-rose-600" : "font-bold text-emerald-700"}>{formatCurrency(movement.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
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
