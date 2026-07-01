"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, inputClass } from "@/components/ui/dialog";
import { findBank } from "@/config/banks";
import { BankSelect } from "@/components/finance/BankSelect";

export type AccountFormValue = {
  name: string;
  alias?: string;
  type: string;
  balance: number;
  bank_name?: string;
  bank_custom_name?: string;
};

export function AccountDialog({
  open,
  initialValue,
  onClose,
  onSave,
}: {
  open: boolean;
  initialValue?: AccountFormValue | null;
  onClose: () => void;
  onSave: (account: AccountFormValue) => void;
}) {
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [type, setType] = useState("Banco");
  const [balance, setBalance] = useState("0");
  const [bankName, setBankName] = useState("");
  const [bankCustomName, setBankCustomName] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initialValue?.name ?? "");
    setAlias(initialValue?.alias ?? "");
    setType(initialValue?.type ?? "Banco");
    setBalance(String(initialValue?.balance ?? 0));
    setBankName(initialValue?.bank_name ? findBank(initialValue.bank_name, initialValue.bank_custom_name).id : "");
    setBankCustomName(initialValue?.bank_custom_name ?? "");
  }, [initialValue, open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    const isBank = type === "Banco";
    const isCustomBank = isBank && bankName === "other";

    onSave({
      name: name.trim(),
      alias: alias.trim() || undefined,
      type,
      balance: Number(balance) || 0,
      bank_name: isBank && bankName ? bankName : undefined,
      bank_custom_name: isCustomBank ? bankCustomName.trim() : undefined,
    });
    setName("");
    setAlias("");
    setType("Banco");
    setBalance("0");
    setBankName("");
    setBankCustomName("");
    onClose();
  }

  return (
    <Dialog
      open={open}
      title={initialValue ? "Editar cuenta" : "Agregar cuenta"}
      description="Carga o ajusta una cuenta manual para registrar saldos y actividad."
      onClose={onClose}
    >
      <form className="grid gap-4" onSubmit={submit}>
        <Field label="Nombre">
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Cuenta BBVA" />
        </Field>
        <Field label="Alias visible">
          <input className={inputClass} value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="Ej. Nomina, ahorro, diaria" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Tipo">
            <select
              className={inputClass}
              value={type}
              onChange={(event) => {
                setType(event.target.value);
                if (event.target.value !== "Banco") {
                  setBankName("");
                  setBankCustomName("");
                }
              }}
            >
              <option>Banco</option>
              <option>Efectivo</option>
              <option>Ahorro</option>
              <option>Tarjeta</option>
              <option>Inversion</option>
            </select>
          </Field>
          <Field label="Saldo inicial">
            <input className={inputClass} type="number" value={balance} onChange={(event) => setBalance(event.target.value)} />
          </Field>
        </div>
        {type === "Banco" ? (
          <BankSelect
            bankName={bankName}
            bankCustomName={bankCustomName}
            onChange={(value) => {
              setBankName(value.bank_name);
              setBankCustomName(value.bank_custom_name);
            }}
          />
        ) : null}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar cuenta</Button>
        </div>
      </form>
    </Dialog>
  );
}
