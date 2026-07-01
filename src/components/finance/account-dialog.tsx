"use client";

import { FormEvent, useEffect, useState } from "react";
import { defaultBankOptions, findBank } from "@/config/banks";
import { AuroraBankLogo, AuroraButton, AuroraInput, AuroraModal, AuroraSelect } from "@/components/aurora";

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
    <AuroraModal
      open={open}
      title={initialValue ? "Editar cuenta" : "Agregar cuenta"}
      onClose={onClose}
      footer={null}
      className="max-w-2xl"
    >
      <form className="grid gap-4" onSubmit={submit}>
        <p className="text-sm leading-6 text-[#6B7280]">Carga o ajusta una cuenta manual para registrar saldos y actividad.</p>
        <AuroraInput label="Nombre" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Cuenta BBVA" />
        <AuroraInput label="Alias visible" value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="Ej. Nomina, ahorro, diaria" />
        <div className="grid gap-4 sm:grid-cols-2">
          <AuroraSelect
            label="Tipo"
            value={type}
            onChange={(event) => {
              setType(event.target.value);
              if (event.target.value !== "Banco") {
                setBankName("");
                setBankCustomName("");
              }
            }}
            options={[
              { label: "Banco", value: "Banco" },
              { label: "Efectivo", value: "Efectivo" },
              { label: "Ahorro", value: "Ahorro" },
              { label: "Tarjeta", value: "Tarjeta" },
              { label: "Inversion", value: "Inversion" },
            ]}
          />
          <AuroraInput label="Saldo inicial" type="number" value={balance} onChange={(event) => setBalance(event.target.value)} />
        </div>
        {type === "Banco" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <AuroraSelect
                label="Banco"
                value={bankName}
                onChange={(event) => {
                  const value = event.target.value;
                  setBankName(value);
                  setBankCustomName(value === "other" ? bankCustomName : "");
                }}
                options={[
                  { label: "Seleccionar banco opcional", value: "" },
                  ...defaultBankOptions.map((bank) => ({ label: bank.name, value: bank.id })),
                ]}
              />
              {bankName ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#374151]">
                  <AuroraBankLogo bankName={bankName} bankCustomName={bankCustomName} size="sm" />
                  {findBank(bankName, bankCustomName).name}
                </span>
              ) : null}
            </div>
            {bankName === "other" ? (
              <AuroraInput
                label="Nombre del banco"
                value={bankCustomName}
                onChange={(event) => setBankCustomName(event.target.value)}
                placeholder="Ej. Banregio, Santander, HSBC"
              />
            ) : null}
          </div>
        ) : null}
        <div className="flex justify-end gap-3 pt-2">
          <AuroraButton type="button" variant="secondary" onClick={onClose}>Cancelar</AuroraButton>
          <AuroraButton type="submit">Guardar cuenta</AuroraButton>
        </div>
      </form>
    </AuroraModal>
  );
}
