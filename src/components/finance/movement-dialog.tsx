"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { NivaAlert, NivaButton, NivaInput, NivaModal, NivaSelect } from "@/design-system";
import type { FinanceAccount } from "@/lib/finance-types";

export type MovementFormValue = {
  occurredOn?: string;
  date: string;
  description: string;
  accountId?: string;
  account: string;
  destinationAccountId?: string;
  destinationAccount?: string;
  categoryId?: string;
  category: string;
  type: string;
  amount: number;
  merchant?: string;
};

type CategoryOption = { id: string; name: string; type: "income" | "expense" };
const typeOptions = [
  { label: "Gasto", value: "Gasto" },
  { label: "Ingreso", value: "Ingreso" },
  { label: "Transferencia", value: "Transferencia" },
];

export function MovementDialog({ open, initialValue, defaultType = "Gasto", accounts = [], categories = [], onClose, onSave }: {
  open: boolean;
  initialValue?: MovementFormValue | null;
  defaultType?: string;
  accounts?: FinanceAccount[];
  categories?: CategoryOption[];
  onClose: () => void;
  onSave: (movement: MovementFormValue) => Promise<boolean | void> | boolean | void;
}) {
  const accountOptions = useMemo(() => accounts.filter((item) => item.id).map((item) => ({ label: item.name, value: item.id! })), [accounts]);
  const [type, setType] = useState("Gasto");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const categoryType = type === "Ingreso" ? "income" : "expense";
  const categoryOptions = categories.filter((item) => item.type === categoryType).map((item) => ({ label: item.name, value: item.id }));

  useEffect(() => {
    if (!open) return;
    const firstAccount = accountOptions[0]?.value ?? "";
    const initialAccountId = initialValue?.accountId ?? accounts.find((item) => item.name === initialValue?.account)?.id ?? firstAccount;
    setType(initialValue?.type ?? defaultType);
    setDescription(initialValue?.description ?? "");
    setAmount(initialValue ? String(Math.abs(initialValue.amount)) : "");
    setAccountId(initialAccountId);
    setDestinationAccountId(initialValue?.destinationAccountId ?? accountOptions.find((item) => item.value !== initialAccountId)?.value ?? "");
    setCategoryId(initialValue?.categoryId ?? "");
    setDate(initialValue?.occurredOn ?? initialValue?.date ?? new Date().toISOString().slice(0, 10));
    setError("");
  }, [accountOptions, accounts, defaultType, initialValue, open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!description.trim()) return setError("Agrega una descripcion para guardar el registro.");
    if (!amount || Number(amount) <= 0) return setError("Agrega un monto mayor a cero.");
    if (!accountId) return setError("Selecciona una cuenta.");
    if (type === "Transferencia" && (!destinationAccountId || accountId === destinationAccountId)) return setError("La cuenta origen y destino deben ser diferentes.");
    if (type !== "Transferencia" && !categoryId) return setError("Selecciona una categoria.");

    const account = accounts.find((item) => item.id === accountId);
    const destination = accounts.find((item) => item.id === destinationAccountId);
    const category = categories.find((item) => item.id === categoryId);
    setSaving(true);
    const saved = await onSave({
      date,
      description: description.trim(),
      accountId,
      account: account?.name ?? "Cuenta",
      destinationAccountId: type === "Transferencia" ? destinationAccountId : undefined,
      destinationAccount: type === "Transferencia" ? destination?.name : undefined,
      categoryId: type === "Transferencia" ? undefined : categoryId,
      category: type === "Transferencia" ? "Transferencia" : category?.name ?? "Sin categoria",
      type,
      amount: type === "Gasto" ? -Math.abs(Number(amount)) : Math.abs(Number(amount)),
    });
    setSaving(false);
    if (saved === false) return;
    setDescription("");
    setAmount("");
    onClose();
  }

  return (
    <NivaModal open={open} title={initialValue ? "Editar registro" : "Nuevo registro"} onClose={onClose} className="max-w-xl" footer={<></>}>
      <form className="grid gap-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <NivaSelect label="Tipo" value={type} onChange={(event) => { setType(event.target.value); setCategoryId(""); }} options={typeOptions} />
          <NivaInput label="Monto" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" autoFocus />
        </div>
        {type === "Transferencia" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NivaSelect label="Cuenta origen" value={accountId} onChange={(event) => setAccountId(event.target.value)} options={accountOptions.filter((item) => item.value !== destinationAccountId)} />
            <NivaSelect label="Cuenta destino" value={destinationAccountId} onChange={(event) => setDestinationAccountId(event.target.value)} options={accountOptions.filter((item) => item.value !== accountId)} />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <NivaSelect label="Cuenta" value={accountId} onChange={(event) => setAccountId(event.target.value)} options={accountOptions} />
            <NivaSelect label="Categoria" value={categoryId} onChange={(event) => setCategoryId(event.target.value)} options={[{ label: "Selecciona una categoria", value: "" }, ...categoryOptions]} />
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <NivaInput label="Descripcion" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ej. Supermercado" />
          <NivaInput label="Fecha" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        {error ? <NivaAlert tone="danger" title={error} /> : null}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <NivaButton type="button" variant="secondary" onClick={onClose}>Cancelar</NivaButton>
          <NivaButton type="submit" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</NivaButton>
        </div>
      </form>
    </NivaModal>
  );
}

