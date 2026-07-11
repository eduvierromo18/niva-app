import Image from "next/image";
import { WalletCards } from "lucide-react";
import { findBank, getBankDisplayName } from "@/config/banks";
import { cn } from "@/lib/utils";

const sizeClass = {
  sm: "h-9 w-9 rounded-[var(--niva-radius-md)]",
  md: "h-12 w-12 rounded-[var(--niva-radius-xl)]",
  lg: "h-14 w-14 rounded-[var(--niva-radius-2xl)]",
};

export type NivaBankLogoProps = {
  bankName?: string | null;
  bankCustomName?: string | null;
  size?: keyof typeof sizeClass;
  className?: string;
};

export function NivaBankLogo({ bankName, bankCustomName, size = "md", className }: NivaBankLogoProps) {
  const bank = findBank(bankName, bankCustomName);
  const label = getBankDisplayName(bankName, bankCustomName);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] p-2 shadow-[var(--niva-shadow-sm)]",
        sizeClass[size],
        className,
      )}
    >
      {bank.logo ? (
        <Image src={bank.logo} alt={label} fill sizes="56px" className="object-contain p-2" />
      ) : (
        <WalletCards className="h-5 w-5 text-[var(--niva-color-muted)]" />
      )}
    </span>
  );
}
