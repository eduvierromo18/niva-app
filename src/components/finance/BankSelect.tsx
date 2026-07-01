"use client";

import { defaultBankOptions } from "@/config/banks";
import { BankAvatar } from "@/components/finance/BankAvatar";
import { Field, inputClass } from "@/components/ui/dialog";

export function BankSelect({
  bankName,
  bankCustomName,
  onChange,
}: {
  bankName: string;
  bankCustomName: string;
  onChange: (value: { bank_name: string; bank_custom_name: string }) => void;
}) {
  const isOther = bankName === "other" || bankName === "Otro";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Banco">
        <div className="grid gap-2">
          <select
            className={inputClass}
            value={bankName}
            onChange={(event) => {
              const value = event.target.value;
              onChange({ bank_name: value, bank_custom_name: value === "other" ? bankCustomName : "" });
            }}
          >
            <option value="">Seleccionar banco opcional</option>
            {defaultBankOptions.map((bank) => (
              <option key={bank.id} value={bank.id}>{bank.name}</option>
            ))}
          </select>
          {bankName ? <BankAvatar bankName={bankName} bankCustomName={bankCustomName} size="sm" showName /> : null}
        </div>
      </Field>
      {isOther ? (
        <Field label="Nombre del banco">
          <input
            className={inputClass}
            value={bankCustomName}
            onChange={(event) => onChange({ bank_name: "other", bank_custom_name: event.target.value })}
            placeholder="Ej. Banregio, Santander, HSBC"
          />
        </Field>
      ) : null}
    </div>
  );
}
