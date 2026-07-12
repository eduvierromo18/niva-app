"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, Field, inputClass } from "@/components/ui/dialog";

export type QuickCreateValue = {
  name: string;
  amount: number;
  secondary: string;
  current?: number;
  extra?: string;
  extraAmount?: number;
};

export function QuickCreateDialog({
  open,
  title,
  description,
  amountLabel,
  currentLabel,
  secondaryLabel,
  secondaryPlaceholder,
  extraLabel,
  extraPlaceholder,
  extraAmountLabel,
  initialValue,
  onClose,
  onSave,
}: {
  open: boolean;
  title: string;
  description: string;
  amountLabel: string;
  currentLabel?: string;
  secondaryLabel: string;
  secondaryPlaceholder: string;
  extraLabel?: string;
  extraPlaceholder?: string;
  extraAmountLabel?: string;
  initialValue?: QuickCreateValue | null;
  onClose: () => void;
  onSave: (value: QuickCreateValue) => Promise<boolean | void> | boolean | void;
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [secondary, setSecondary] = useState("");
  const [current, setCurrent] = useState("");
  const [extra, setExtra] = useState("");
  const [extraAmount, setExtraAmount] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initialValue?.name ?? "");
    setAmount(initialValue ? String(initialValue.amount) : "");
    setSecondary(initialValue?.secondary ?? "");
    setCurrent(initialValue?.current !== undefined ? String(initialValue.current) : "");
    setExtra(initialValue?.extra ?? "");
    setExtraAmount(initialValue?.extraAmount !== undefined ? String(initialValue.extraAmount) : "");
  }, [initialValue, open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    const saved = await onSave({
      name: name.trim(),
      amount: Number(amount) || 0,
      secondary,
      current: Number(current) || 0,
      extra,
      extraAmount: Number(extraAmount) || 0,
    });
    if (saved === false) return;
    setName("");
    setAmount("");
    setSecondary("");
    setCurrent("");
    setExtra("");
    setExtraAmount("");
    onClose();
  }

  return (
    <Dialog open={open} title={title} description={description} onClose={onClose}>
      <form className="grid gap-4" onSubmit={submit}>
        <Field label="Nombre">
          <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={amountLabel}>
            <input className={inputClass} type="number" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </Field>
          {currentLabel ? (
            <Field label={currentLabel}>
              <input className={inputClass} type="number" value={current} onChange={(event) => setCurrent(event.target.value)} />
            </Field>
          ) : null}
          <Field label={secondaryLabel}>
            <input className={inputClass} value={secondary} onChange={(event) => setSecondary(event.target.value)} placeholder={secondaryPlaceholder} />
          </Field>
          {extraLabel ? (
            <Field label={extraLabel}>
              <input className={inputClass} value={extra} onChange={(event) => setExtra(event.target.value)} placeholder={extraPlaceholder} />
            </Field>
          ) : null}
          {extraAmountLabel ? (
            <Field label={extraAmountLabel}>
              <input className={inputClass} type="number" value={extraAmount} onChange={(event) => setExtraAmount(event.target.value)} />
            </Field>
          ) : null}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Dialog>
  );
}

