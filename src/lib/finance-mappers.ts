import { Banknote, CircleDollarSign, CreditCard, Landmark, PiggyBank, TrendingUp, WalletCards } from "lucide-react";
import type { Tables } from "@/types/database";
import type { AccountType, FinanceAccount, FinanceMovement } from "@/lib/finance-types";

type AccountBalanceRow = Tables<"account_balances">;
type MovementRow = Tables<"movements">;
type CategoryRow = Pick<Tables<"categories">, "id" | "name">;

const dbToUiType: Record<NonNullable<AccountBalanceRow["type"]>, AccountType> = {
  cash: "Efectivo",
  checking: "Banco",
  savings: "Ahorro",
  credit_card: "Tarjeta",
  loan: "Deuda",
  investment: "Inversion",
  other: "Banco",
};

export const uiToDbType = {
  Efectivo: "cash",
  Banco: "checking",
  Ahorro: "savings",
  Tarjeta: "credit_card",
  Deuda: "loan",
  Inversion: "investment",
} as const;

function iconForAccount(type: AccountType) {
  if (type === "Efectivo") return CircleDollarSign;
  if (type === "Ahorro") return PiggyBank;
  if (type === "Tarjeta") return CreditCard;
  if (type === "Inversion") return TrendingUp;
  if (type === "Deuda") return Banknote;
  if (type === "Banco") return Landmark;
  return WalletCards;
}

export function mapAccount(row: AccountBalanceRow): FinanceAccount {
  const type = dbToUiType[row.type ?? "other"];
  return {
    id: row.id ?? undefined,
    name: row.name ?? "Cuenta",
    alias: row.alias ?? undefined,
    type,
    balance: Number(row.balance ?? row.initial_balance ?? 0),
    initialBalance: Number(row.initial_balance ?? 0),
    currencyCode: row.currency_code ?? "MXN",
    isArchived: Boolean(row.is_archived),
    color: row.color ?? "bg-[var(--niva-color-foreground)]",
    icon: iconForAccount(type),
    bank_name: row.bank_name ?? undefined,
    bank_custom_name: row.bank_custom_name ?? undefined,
  };
}

export function mapMovement(
  row: MovementRow,
  accounts: FinanceAccount[],
  categories: CategoryRow[],
): FinanceMovement {
  const accountId = row.type === "transfer" ? row.from_account_id : row.account_id;
  const account = accounts.find((item) => item.id === accountId);
  const destination = accounts.find((item) => item.id === row.to_account_id);
  const category = categories.find((item) => item.id === row.category_id);
  const type = row.type === "income" ? "Ingreso" : row.type === "expense" ? "Gasto" : "Transferencia";
  const signedAmount = row.type === "expense" ? -Number(row.amount) : Number(row.amount);
  return {
    id: row.id,
    occurredOn: row.occurred_on,
    date: row.occurred_on,
    description: row.description || "Sin descripcion",
    accountId: accountId ?? undefined,
    account: account?.name ?? "Cuenta archivada",
    destinationAccountId: row.to_account_id ?? undefined,
    destinationAccount: destination?.name,
    categoryId: row.category_id ?? undefined,
    category: row.type === "transfer" ? "Transferencia" : category?.name ?? "Sin categoria",
    type,
    amount: signedAmount,
    merchant: row.merchant ?? undefined,
  };
}

