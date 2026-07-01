import type { FinanceAccount } from "@/lib/finance-types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BankAvatar } from "@/components/finance/BankAvatar";
import { findBank, getBankDisplayName } from "@/config/banks";
import { cn } from "@/lib/utils";

function displayBank(account: FinanceAccount) {
  if (account.bank_name === "other") return account.bank_custom_name;
  return account.bank_name ? getBankDisplayName(account.bank_name, account.bank_custom_name) : undefined;
}

export function AccountCard({
  account,
  compact = false,
  onEdit,
  onDelete,
}: {
  account: FinanceAccount;
  compact?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const Icon = account.icon;
  const bank = displayBank(account);
  const bankConfig = findBank(account.bank_name, account.bank_custom_name);
  const showBankAvatar = account.type === "Banco" || Boolean(account.bank_name);

  return (
    <article
      className={cn("group overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950", compact ? "min-w-60" : "min-h-40")}
      style={{ borderTopColor: showBankAvatar ? bankConfig.color : undefined, borderTopWidth: showBankAvatar ? 3 : undefined }}
    >
      <div className="flex items-start justify-between gap-3">
        {showBankAvatar ? (
          <BankAvatar bankName={account.bank_name} bankCustomName={account.bank_custom_name} size="lg" />
        ) : (
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-sm", account.color)}>
            <Icon className="h-6 w-6" />
          </div>
        )}
        <Badge>{bank ?? account.type}</Badge>
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold text-slate-500 dark:text-zinc-400">{account.alias || account.type}</p>
        <h3 className="mt-1 truncate text-lg font-bold text-slate-950 dark:text-zinc-50">{account.name}</h3>
        <p className="mt-3 text-2xl font-bold tracking-tight text-slate-950 dark:text-zinc-50">{formatCurrency(account.balance)}</p>
      </div>
      {onEdit || onDelete ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {onEdit ? <Button type="button" variant="secondary" className="h-9 px-3" onClick={onEdit}>Editar</Button> : null}
          {onDelete ? <Button type="button" variant="ghost" className="h-9 px-3 text-rose-600" onClick={onDelete}>Eliminar</Button> : null}
        </div>
      ) : null}
    </article>
  );
}
