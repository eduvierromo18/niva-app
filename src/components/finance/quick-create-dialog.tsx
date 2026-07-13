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
  categoryId?: string;
};

export type CategoryOption = { id: string; name: string };

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
  categoryOptions,
  categoryLabel,
  requirePositiveAmount = false,
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
  categoryOptions?: CategoryOption[];
  categoryLabel?: string;
  // Opt-in: reject amount <= 0 with a visible error. Off by default so records
  // that legitimately allow $0 (e.g. a paid-off liability) keep working.
  requirePositiveAmount?: boolean;
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
  const [categoryId, setCategoryId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initialValue?.name ?? "");
    setAmount(initialValue ? String(initialValue.amount) : "");
    setSecondary(initialValue?.secondary ?? "");
    setCurrent(initialValue?.current !== undefined ? String(initialValue.current) : "");
    setExtra(initialValue?.extra ?? "");
    setExtraAmount(initialValue?.extraAmount !== undefined ? String(initialValue.extraAmount) : "");
    setCategoryId(initialValue?.categoryId ?? "");
    setError("");
  }, [initialValue, open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // When a category selector is used, the picked category is the record's
    // identity — validate it instead of the free-text name.
    if (categoryOptions) {
      if (!categoryId) return;
    } else if (!name.trim()) {
      return;
    }
    const numericAmount = Number(amount) || 0;
    if (requirePositiveAmount && numericAmount <= 0) {
      setError("Ingresa un monto mayor a $0.");
      return;
    }
    const selectedCategory = categoryOptions?.find((option) => option.id === categoryId);
    const saved = await onSave({
      name: selectedCategory ? selectedCategory.name : name.trim(),
      amount: numericAmount,
      secondary,
      current: Number(current) || 0,
      extra,
      extraAmount: Number(extraAmount) || 0,
      categoryId: categoryOptions ? categoryId : undefined,
    });
    if (saved === false) return;
    setName("");
    setAmount("");
    setSecondary("");
    setCurrent("");
    setExtra("");
    setExtraAmount("");
    setCategoryId("");
    setError("");
    onClose();
  }

  return (
    <Dialog open={open} title={title} description={description} onClose={onClose}>
      <form className="grid gap-4" onSubmit={submit}>
        {categoryOptions ? (
          <Field label={categoryLabel ?? "Categoría"}>
            <select className={inputClass} value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
              <option value="">Selecciona una categoría</option>
              {categoryOptions.map((option) => (
                <option key={option.id} value={option.id}>{option.name}</option>
              ))}
            </select>
          </Field>
        ) : (
          <Field label="Nombre">
            <input className={inputClass} value={name} onChange={(event) => setName(event.target.value)} />
          </Field>
        )}
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
        {error ? <div className="rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-3 text-sm font-semibold text-[var(--niva-color-danger)]">{error}</div> : null}
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Dialog>
  );
}

