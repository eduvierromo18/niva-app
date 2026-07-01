import Image from "next/image";
import { findBank, getBankDisplayName } from "@/config/banks";
import { cn } from "@/lib/utils";

const sizeClass = {
  sm: "h-8 w-8 rounded-lg",
  md: "h-11 w-11 rounded-xl",
  lg: "h-14 w-14 rounded-2xl",
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
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-slate-200 bg-white p-1.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900",
          sizeClass[size],
        )}
        style={{ boxShadow: `inset 0 0 0 1px ${bank.color}1F` }}
      >
        <Image src={bank.logo} alt={label} fill sizes="56px" className="object-contain p-1" />
      </span>
      {showName ? <span className="truncate text-sm font-semibold text-slate-700 dark:text-zinc-200">{label}</span> : null}
    </span>
  );
}
