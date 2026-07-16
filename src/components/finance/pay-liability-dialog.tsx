"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { NivaAlert, NivaButton, NivaInput, NivaModal, NivaSelect } from "@/design-system";
import type { FinanceAccount } from "@/lib/finance-types";

export type PayLiabilityValue = {
  amount: number;
  sourceAccountId: string;
};

export type PayableLiability = {
  id: string;
  name: string;
  balance: number;
  accountId: string | null;
};

export function PayLiabilityDialog({ open, liability, accounts = [], onClose, onSave }: {
  open: boolean;
  liability?: PayableLiability | null;
  accounts?: FinanceAccount[];
  onClose: () => void;
  onSave: (value: PayLiabilityValue) => Promise<boolean | void> | boolean | void;
}) {
  const accountOptions = useMemo(
    () => accounts.filter((item) => item.id && item.id !== liability?.accountId).map((item) => ({ label: item.name, value: item.id! })),
    [accounts, liability?.accountId],
  );
  const [amount, setAmount] = useState("");
  const [sourceAccountId, setSourceAccountId] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setAmount(liability ? String(liability.balance) : "");
    setSourceAccountId(accountOptions[0]?.value ?? "");
    setError("");
  }, [open, liability, accountOptions]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!amount || Number(amount) <= 0) return setError("Agrega un monto mayor a cero.");
    if (!sourceAccountId) return setError("Selecciona una cuenta origen.");
    setSaving(true);
    const saved = await onSave({ amount: Number(amount), sourceAccountId });
    setSaving(false);
    if (saved === false) return;
    onClose();
  }

  if (!liability) return null;

  return (
    <NivaModal open={open} title={`Pagar ${liability.name}`} onClose={onClose} className="max-w-md" footer={<></>}>
      <form className="grid gap-4" onSubmit={submit}>
        <NivaInput label="Monto a pagar" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="0.00" autoFocus />
        <NivaSelect label="Cuenta origen" value={sourceAccountId} onChange={(event) => setSourceAccountId(event.target.value)} options={accountOptions} />
        {error ? <NivaAlert tone="danger" title={error} /> : null}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <NivaButton type="button" variant="secondary" onClick={onClose}>Cancelar</NivaButton>
          <NivaButton type="submit" disabled={saving}>{saving ? "Guardando..." : "Registrar pago"}</NivaButton>
        </div>
      </form>
    </NivaModal>
  );
}
