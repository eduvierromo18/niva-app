import Image from "next/image";
import { WalletCards } from "lucide-react";
import { findBank, getBankDisplayName } from "@/config/banks";
import { cn } from "@/lib/utils";

const sizeClass = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-12 w-12 rounded-xl",
  lg: "h-14 w-14 rounded-[20px]",
};

type AuroraBankLogoProps = {
  bankName?: string | null;
  bankCustomName?: string | null;
  size?: keyof typeof sizeClass;
  className?: string;
};

export function AuroraBankLogo({ bankName, bankCustomName, size = "md", className }: AuroraBankLogoProps) {
  const bank = findBank(bankName, bankCustomName);
  const label = getBankDisplayName(bankName, bankCustomName);

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-[#E5E7EB] bg-white p-2 shadow-[0_4px_12px_rgba(0,0,0,0.06)]",
        sizeClass[size],
        className,
      )}
      style={{ boxShadow: `inset 0 0 0 1px ${bank.color}1F, 0 4px 12px rgba(0,0,0,0.06)` }}
    >
      {bank.logo ? (
        <Image src={bank.logo} alt={label} fill sizes="56px" className="object-contain p-2" />
      ) : (
        <WalletCards className="h-5 w-5 text-[#6B7280]" />
      )}
    </span>
  );
}
