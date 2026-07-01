"use client";

import { FormEvent, useEffect, useState } from "react";
import { AccountSelect } from "@/components/finance/AccountSelect";
import { Button } from "@/components/ui/button";
import { Dialog, Field, inputClass } from "@/components/ui/dialog";
import { accounts as defaultAccounts } from "@/lib/finance-data";
import type { FinanceAccount, ScheduledFrequency, ScheduledStatus, ScheduledTransaction, ScheduledTransactionType } from "@/lib/finance-types";

const typeOptions: Array<{ value: ScheduledTransactionType; label: string }> = [
  { value: "expense", label: "Gasto fijo" },
  { value: "income", label: "Ingreso recurrente" },
  { value: "subscription", label: "Suscripcion" },
  { value: "debt_payment", label: "Pago de tarjeta/deuda" },
  { value: "transfer", label: "Transferencia" },
];

const frequencyOptions: Array<{ value: ScheduledFrequency; label: string }> = [
  { value: "weekly", label: "Semanal" },
  { value: "biweekly", label: "Quincenal" },
  { value: "monthly", label: "Mensual" },
  { value: "yearly", label: "Anual" },
  { value: "custom", label: "Personalizada" },
];

const statusOptions: Array<{ value: ScheduledStatus; label: string }> = [
  { value: "active", label: "Activo" },
  { value: "paused", label: "Pausado" },
  { value: "finished", label: "Finalizado" },
];

export function ScheduledTransactionDialog({
  open,
  initialValue,
  accounts = defaultAccounts,
  onClose,
  onSave,
}: {
  open: boolean;
  initialValue?: ScheduledTransaction | null;
  accounts?: FinanceAccount[];
  onClose: () => void;
  onSave: (value: ScheduledTransaction) => void;
}) {
  const [type, setType] = useState<ScheduledTransactionType>("expense");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState("Cuenta nomina");
  const [destinationAccount, setDestinationAccount] = useState("Ahorro");
  const [category, setCategory] = useState("Vivienda");
  const [frequency, setFrequency] = useState<ScheduledFrequency>("monthly");
  const [startDate, setStartDate] = useState("2026-06-27");
  const [nextDueDate, setNextDueDate] = useState("2026-07-01");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<ScheduledStatus>("active");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setType(initialValue?.type ?? "expense");
    setName(initialValue?.name ?? "");
    setAmount(initialValue ? String(initialValue.amount) : "");
    setAccount(initialValue?.account ?? "Cuenta nomina");
    setDestinationAccount(initialValue?.destinationAccount ?? "Ahorro");
    setCategory(initialValue?.category ?? "Vivienda");
    setFrequency(initialValue?.frequency ?? "monthly");
    setStartDate(initialValue?.startDate ?? "2026-06-27");
    setNextDueDate(initialValue?.nextDueDate ?? "2026-07-01");
    setEndDate(initialValue?.endDate ?? "");
    setNotes(initialValue?.notes ?? "");
    setStatus(initialValue?.status ?? "active");
    setError("");
  }, [initialValue, open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    if ((type === "transfer" || type === "debt_payment") && account === destinationAccount) {
      setError("La cuenta origen y destino deben ser diferentes.");
      return;
    }

    onSave({
      id: initialValue?.id ?? crypto.randomUUID(),
      name: name.trim(),
      type,
      amount: Math.abs(Number(amount) || 0),
      account,
      destinationAccount: type === "transfer" || type === "debt_payment" ? destinationAccount : undefined,
      category: type === "transfer" ? "Transferencia" : category,
      frequency,
      startDate,
      nextDueDate,
      endDate: endDate || undefined,
      status,
      notes: notes.trim() || undefined,
      autoCreate: initialValue?.autoCreate ?? false,
    });
    onClose();
  }

  return (
    <Dialog
      open={open}
      title={initialValue ? "Editar programado" : "Nuevo programado"}
      description="Registra pagos, ingresos, suscripciones o transferencias recurrentes."
      onClose={onClose}
    >
      <form className="grid gap-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <select className={inputClass} value={type} onChange={(event) => setType(event.target.value as ScheduledTransactionType)}>
              {typeOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </Field>
          <Field label="Monto">
            <input className={inputClass} type="number" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" />
          </Field>
        </div>
        <Field label="Nombre">
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Netflix, renta, nomina" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <AccountSelect accounts={accounts} value={account} onChange={setAccount} label={type === "income" ? "Cuenta destino" : "Cuenta origen"} excludeValue={type === "transfer" || type === "debt_payment" ? destinationAccount : undefined} />
          {type === "transfer" || type === "debt_payment" ? (
            <AccountSelect accounts={accounts} value={destinationAccount} onChange={setDestinationAccount} label="Cuenta destino" excludeValue={account} />
          ) : (
            <Field label="Categoria">
              <select className={inputClass} value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>Vivienda</option>
                <option>Comida</option>
                <option>Transporte</option>
                <option>Entretenimiento</option>
                <option>Servicios</option>
                <option>Ingresos</option>
              </select>
            </Field>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Frecuencia">
            <select className={inputClass} value={frequency} onChange={(event) => setFrequency(event.target.value as ScheduledFrequency)}>
              {frequencyOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </Field>
          <Field label="Fecha inicio">
            <input className={inputClass} type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
          </Field>
          <Field label="Proxima fecha">
            <input className={inputClass} type="date" value={nextDueDate} onChange={(event) => setNextDueDate(event.target.value)} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Fecha final opcional">
            <input className={inputClass} type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
          </Field>
          <Field label="Estado">
            <select className={inputClass} value={status} onChange={(event) => setStatus(event.target.value as ScheduledStatus)}>
              {statusOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Notas">
          <textarea className={`${inputClass} min-h-20 py-2`} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Notas internas opcionales" />
        </Field>
        {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm font-semibold text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-100">{error}</div> : null}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar programado</Button>
        </div>
      </form>
    </Dialog>
  );
}
