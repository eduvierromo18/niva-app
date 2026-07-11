"use client";

import { FormEvent, useEffect, useId, useState } from "react";
import { defaultBankOptions, findBank } from "@/config/banks";
import { NivaAlert, NivaBankLogo, NivaButton, NivaInput, NivaModal, NivaSelect } from "@/design-system";
import type { AccountFormValue, AccountType } from "@/lib/finance-types";

export type { AccountFormValue } from "@/lib/finance-types";

type AccountDialogErrors = Partial<Record<"name" | "balance" | "bankCustomName", string>>;

const accountTypeOptions: Array<{ label: string; value: AccountType }> = [
  { label: "Banco", value: "Banco" },
  { label: "Efectivo", value: "Efectivo" },
  { label: "Ahorro", value: "Ahorro" },
  { label: "Tarjeta", value: "Tarjeta" },
  { label: "Inversion", value: "Inversion" },
];

export function AccountDialog({
  open,
  initialValue,
  onClose,
  onSave,
}: {
  open: boolean;
  initialValue?: AccountFormValue | null;
  onClose: () => void;
  onSave: (account: AccountFormValue) => boolean | void;
}) {
  const formId = useId();
  const [name, setName] = useState("");
  const [alias, setAlias] = useState("");
  const [type, setType] = useState<AccountType>("Banco");
  const [balance, setBalance] = useState("0");
  const [bankName, setBankName] = useState("");
  const [bankCustomName, setBankCustomName] = useState("");
  const [errors, setErrors] = useState<AccountDialogErrors>({});

  useEffect(() => {
    if (!open) return;
    setName(initialValue?.name ?? "");
    setAlias(initialValue?.alias ?? "");
    setType(initialValue?.type ?? "Banco");
    setBalance(String(initialValue?.balance ?? 0));
    setBankName(initialValue?.bank_name ? findBank(initialValue.bank_name, initialValue.bank_custom_name).id : "");
    setBankCustomName(initialValue?.bank_custom_name ?? "");
    setErrors({});
  }, [initialValue, open]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const isBank = type === "Banco";
    const isCustomBank = isBank && bankName === "other";
    const parsedBalance = Number(balance);
    const nextErrors: AccountDialogErrors = {};

    if (!name.trim()) nextErrors.name = "El nombre de la cuenta es obligatorio.";
    if (!Number.isFinite(parsedBalance)) nextErrors.balance = "Ingresa un saldo válido.";
    if (isCustomBank && !bankCustomName.trim()) nextErrors.bankCustomName = "Ingresa el nombre del banco.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const didSave = onSave({
      name: name.trim(),
      alias: alias.trim() || undefined,
      type,
      balance: parsedBalance,
      bank_name: isBank && bankName ? bankName : undefined,
      bank_custom_name: isCustomBank ? bankCustomName.trim() : undefined,
    });

    if (didSave === false) return;

    setName("");
    setAlias("");
    setType("Banco");
    setBalance("0");
    setBankName("");
    setBankCustomName("");
    setErrors({});
    onClose();
  }

  return (
    <NivaModal
      open={open}
      title={initialValue ? "Editar cuenta" : "Agregar cuenta"}
      onClose={onClose}
      footer={null}
      className="max-w-2xl"
    >
      <form className="grid gap-4" onSubmit={submit}>
        <p className="text-sm leading-6 text-[var(--niva-color-muted)]">Carga o ajusta una cuenta manual para registrar saldos y actividad.</p>
        {Object.keys(errors).length > 0 ? <NivaAlert tone="danger" title="Revisa los datos de la cuenta." /> : null}
        <NivaInput id={`${formId}-name`} label="Nombre" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ej. Cuenta BBVA" error={errors.name} required />
        <NivaInput id={`${formId}-alias`} label="Alias visible" value={alias} onChange={(event) => setAlias(event.target.value)} placeholder="Ej. Nomina, ahorro, diaria" />
        <div className="grid gap-4 sm:grid-cols-2">
          <NivaSelect
            id={`${formId}-type`}
            label="Tipo"
            value={type}
            onChange={(event) => {
              const nextType = event.target.value as AccountType;
              setType(nextType);
              if (event.target.value !== "Banco") {
                setBankName("");
                setBankCustomName("");
              }
            }}
            options={accountTypeOptions}
          />
          <NivaInput id={`${formId}-balance`} label="Saldo inicial" type="number" value={balance} onChange={(event) => setBalance(event.target.value)} error={errors.balance} required />
        </div>
        {type === "Banco" ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <NivaSelect
                id={`${formId}-bank`}
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
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--niva-color-foreground)]">
                  <NivaBankLogo bankName={bankName} bankCustomName={bankCustomName} size="sm" className="h-7 w-7 border-0 shadow-none" />
                  {findBank(bankName, bankCustomName).name}
                </span>
              ) : null}
            </div>
            {bankName === "other" ? (
              <NivaInput
                id={`${formId}-custom-bank`}
                label="Nombre del banco"
                value={bankCustomName}
                onChange={(event) => setBankCustomName(event.target.value)}
                placeholder="Ej. Banregio, Santander, HSBC"
                error={errors.bankCustomName}
                required
              />
            ) : null}
          </div>
        ) : null}
        <div className="flex justify-end gap-3 pt-2">
          <NivaButton type="button" variant="secondary" onClick={onClose}>Cancelar</NivaButton>
          <NivaButton type="submit">Guardar cuenta</NivaButton>
        </div>
      </form>
    </NivaModal>
  );
}
