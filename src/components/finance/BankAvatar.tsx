import Image from "next/image";
import { findBank, getBankDisplayName } from "@/config/banks";
import { cn } from "@/lib/utils";

const sizeClass = {
  sm: "h-8 w-8 rounded-[var(--niva-radius-md)]",
  md: "h-11 w-11 rounded-[var(--niva-radius-lg)]",
  lg: "h-14 w-14 rounded-[var(--niva-radius-xl)]",
};

export function BankAvatar({
  bankName,
  bankCustomName,
  size = "md",
  showName = false,
}: {
  bankName?: string | null;
  bankCustomName?: string | null;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
}) {
  const bank = findBank(bankName, bankCustomName);
  const label = getBankDisplayName(bankName, bankCustomName);

  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] p-1.5 shadow-[var(--niva-shadow-sm)]",
          sizeClass[size],
        )}
        style={{ boxShadow: `inset 0 0 0 1px ${bank.color}1F` }}
      >
        <Image src={bank.logo} alt={label} fill sizes="56px" className="object-contain p-1" />
      </span>
      {showName ? <span className="truncate text-sm font-semibold text-[var(--niva-color-body)]">{label}</span> : null}
    </span>
  );
}
