"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { NivaAlert, NivaButton, NivaInput, NivaModal, NivaSelect } from "@/design-system";
import { accounts as defaultAccounts } from "@/lib/finance-data";
import type { FinanceAccount } from "@/lib/finance-types";

export type MovementFormValue = {
  date: string;
  description: string;
  account: string;
  destinationAccount?: string;
  category: string;
  type: string;
  amount: number;
};

const typeOptions = [
  { label: "Gasto", value: "Gasto" },
  { label: "Ingreso", value: "Ingreso" },
  { label: "Transferencia", value: "Transferencia" },
];

const categoryOptions = [
  { label: "Comida", value: "Comida" },
  { label: "Vivienda", value: "Vivienda" },
  { label: "Transporte", value: "Transporte" },
  { label: "Ingresos", value: "Ingresos" },
  { label: "Transferencia", value: "Transferencia" },
];

export function MovementDialog({
  open,
  initialValue,
  defaultType = "Gasto",
  accounts = defaultAccounts,
  onClose,
  onSave,
}: {
  open: boolean;
  initialValue?: MovementFormValue | null;
  defaultType?: string;
  accounts?: FinanceAccount[];
  onClose: () => void;
  onSave: (movement: MovementFormValue) => void;
}) {
  const accountOptions = useMemo(() => accounts.map((item) => ({ label: item.name, value: item.name })), [accounts]);
  const [type, setType] = useState("Gasto");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Comida");
  const [account, setAccount] = useState("Cuenta nomina");
  const [destinationAccount, setDestinationAccount] = useState("Ahorro");
  const [date, setDate] = useState("Hoy");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setType(initialValue?.type ?? defaultType);
    setDescription(initialValue?.description ?? "");
    setAmount(initialValue ? String(Math.abs(initialValue.amount)) : "");
    setCategory(initialValue?.category ?? "Comida");
    setAccount(initialValue?.account ?? accountOptions[0]?.value ?? "Cuenta nomina");
    setDestinationAccount(initialValue?.destinationAccount ?? accountOptions.find((item) => item.value !== (initialValue?.account ?? account))?.value ?? "Ahorro");
    setDate(initialValue?.date ?? "Hoy");
    setError("");
  }, [account, accountOptions, defaultType, initialValue, open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!description.trim()) {
      setError("Agrega una descripcion para guardar el registro.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Agrega un monto mayor a cero.");
      return;
    }
    if (type === "Transferencia" && account === destinationAccount) {
      setError("La cuenta origen y destino deben ser diferentes.");
      return;
    }

    const numericAmount = Math.abs(Number(amount) || 0);
    onSave({
      date,
      description: description.trim(),
      account,
      destinationAccount: type === "Transferencia" ? destinationAccount : undefined,
      category: type === "Transferencia" ? "Transferencia" : category,
      type,
      amount: type === "Gasto" ? -numericAmount : numericAmount,
    });
    setDescription("");
    setAmount("");
    onClose();
  }

  return (
    <NivaModal
      open={open}
      title={initialValue ? "Editar registro" : "Nuevo registro"}
      onClose={onClose}
      className="max-w-xl"
      footer={<></>}
    >
      <form className="grid gap-4" onSubmit={submit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <NivaSelect label="Tipo" value={type} onChange={(event) => setType(event.target.value)} options={typeOptions} />
          <NivaInput label="Monto" type="number" min="0" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" autoFocus />
        </div>

        {type === "Transferencia" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <NivaSelect
              label="Cuenta origen"
              value={account}
              onChange={(event) => setAccount(event.target.value)}
              options={accountOptions.filter((item) => item.value !== destinationAccount)}
            />
            <NivaSelect
              label="Cuenta destino"
              value={destinationAccount}
              onChange={(event) => setDestinationAccount(event.target.value)}
              options={accountOptions.filter((item) => item.value !== account)}
            />
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <NivaSelect label="Cuenta" value={account} onChange={(event) => setAccount(event.target.value)} options={accountOptions} />
            <NivaSelect label="Categoria" value={category} onChange={(event) => setCategory(event.target.value)} options={categoryOptions} />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <NivaInput label="Descripcion" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Ej. Supermercado" />
          <NivaInput label="Fecha" value={date} onChange={(event) => setDate(event.target.value)} placeholder="Hoy" />
        </div>

        {error ? <NivaAlert tone="danger" title={error} /> : null}

        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <NivaButton type="button" variant="secondary" onClick={onClose}>Cancelar</NivaButton>
          <NivaButton type="submit">Guardar</NivaButton>
        </div>
      </form>
    </NivaModal>
  );
}
