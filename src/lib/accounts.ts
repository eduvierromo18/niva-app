import {
  Banknote,
  CircleDollarSign,
  CreditCard,
  Landmark,
  PiggyBank,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { getBankDisplayName, normalizeBankName } from "@/config/banks";
import type { AccountFormValue, FinanceAccount, FinanceMovement } from "@/lib/finance-types";

export type InstitutionConfig = {
  id: string;
  label: string;
  bankName?: string;
  cash?: boolean;
};

export type AccountStatus = {
  label: string;
  tone: "ready" | "review" | "quiet";
};

export type AccountTotals = {
  totalMoney: number;
  availableMoney: number;
  creditImpact: number;
  reservedMoney: number;
  lowBalanceCount: number;
  principalAccount?: FinanceAccount;
};

export type AccountDistributionItem = {
  label: string;
  icon: LucideIcon;
  total: number;
  count: number;
};

export type AccountInstitutionGroup = InstitutionConfig & {
  accounts: FinanceAccount[];
  total: number;
  status: AccountStatus;
  displayName: string;
};

export const accountInstitutionConfigs: InstitutionConfig[] = [
  { id: "bbva", label: "BBVA", bankName: "bbva" },
  { id: "nu", label: "Nu", bankName: "nu" },
  { id: "american-express", label: "American Express", bankName: "american-express" },
  { id: "banorte", label: "Banorte", bankName: "banorte" },
  { id: "banamex", label: "Banamex", bankName: "banamex" },
  { id: "mercado-pago", label: "Mercado Pago", bankName: "mercado-pago" },
  { id: "dollarapp", label: "DollarApp", bankName: "dollarapp" },
  { id: "cash", label: "Efectivo", cash: true },
  { id: "other", label: "Otro", bankName: "other" },
];

export function isSavingsAccount(account: FinanceAccount) {
  const value = `${account.name} ${account.alias ?? ""} ${account.type}`.toLowerCase();
  return value.includes("ahorro") || value.includes("reserva") || value.includes("inversion");
}

export function getInstitutionId(account: FinanceAccount) {
  if (account.type === "Efectivo") return "cash";
  return normalizeBankName(account.bank_name ?? account.bank_custom_name ?? "other") || "other";
}

export function findLastMovement(account: FinanceAccount, allMovements: FinanceMovement[]) {
  return allMovements.find((movement) => movement.account === account.name || movement.destinationAccount === account.name);
}

export function countLabel(count: number) {
  return count === 1 ? "1 cuenta" : `${count} cuentas`;
}

export function getAccountStatus(account: FinanceAccount, lastMovement?: FinanceMovement | null, principalAccountId?: string): AccountStatus {
  if (account.id === principalAccountId) return { label: "Cuenta principal", tone: "quiet" };
  if (account.balance < 0 || (account.type !== "Tarjeta" && account.balance < 1000)) return { label: "Por revisar", tone: "review" };
  if (!lastMovement) return { label: "Sin actividad reciente", tone: "quiet" };
  return { label: "Todo listo", tone: "ready" };
}

export function getGroupStatus(accounts: FinanceAccount[]): AccountStatus {
  if (accounts.length === 0) return { label: "Sin cuentas", tone: "quiet" };
  if (accounts.some((account) => account.balance < 0)) return { label: "Por revisar", tone: "review" };
  return { label: "Todo listo", tone: "ready" };
}

export function getAccountTotals(accounts: FinanceAccount[]): AccountTotals {
  const cashLikeAccounts = accounts.filter((account) => account.type !== "Tarjeta");
  const principalAccount = [...cashLikeAccounts].sort((a, b) => b.balance - a.balance)[0];

  return {
    totalMoney: accounts.reduce((sum, account) => sum + account.balance, 0),
    availableMoney: cashLikeAccounts.reduce((sum, account) => sum + Math.max(account.balance, 0), 0),
    creditImpact: accounts.filter((account) => account.type === "Tarjeta").reduce((sum, account) => sum + account.balance, 0),
    reservedMoney: accounts.filter((account) => isSavingsAccount(account) || account.type === "Inversion").reduce((sum, account) => sum + Math.max(account.balance, 0), 0),
    lowBalanceCount: accounts.filter((account) => account.balance < 0 || (account.type !== "Tarjeta" && account.balance < 1000)).length,
    principalAccount,
  };
}

export function getMoneyDistribution(accounts: FinanceAccount[]): AccountDistributionItem[] {
  return [
    {
      label: "Bancos",
      icon: Landmark,
      total: accounts.filter((account) => account.type === "Banco" && !isSavingsAccount(account)).reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Banco" && !isSavingsAccount(account)).length,
    },
    {
      label: "Tarjetas",
      icon: CreditCard,
      total: accounts.filter((account) => account.type === "Tarjeta").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Tarjeta").length,
    },
    {
      label: "Efectivo",
      icon: CircleDollarSign,
      total: accounts.filter((account) => account.type === "Efectivo").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Efectivo").length,
    },
    {
      label: "Ahorro",
      icon: PiggyBank,
      total: accounts.filter(isSavingsAccount).reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter(isSavingsAccount).length,
    },
    {
      label: "Inversiones",
      icon: Banknote,
      total: accounts.filter((account) => account.type === "Inversion").reduce((sum, account) => sum + account.balance, 0),
      count: accounts.filter((account) => account.type === "Inversion").length,
    },
  ];
}

export function getInstitutionGroups(accounts: FinanceAccount[]): AccountInstitutionGroup[] {
  return accountInstitutionConfigs.map((institution) => {
    const groupAccounts = accounts.filter((account) => getInstitutionId(account) === institution.id);

    return {
      ...institution,
      accounts: groupAccounts,
      total: groupAccounts.reduce((sum, account) => sum + account.balance, 0),
      status: getGroupStatus(groupAccounts),
      displayName: institution.bankName ? getBankDisplayName(institution.bankName) : institution.label,
    };
  });
}

export function createFinanceAccount(account: AccountFormValue): FinanceAccount {
  return {
    ...account,
    id: `account-${crypto.randomUUID()}`,
    color: "bg-[var(--niva-account-foreground)]",
    icon: WalletCards,
  };
}

export function updateAccountAtIndex(accounts: FinanceAccount[], index: number, account: AccountFormValue) {
  if (index < 0 || index >= accounts.length) {
    throw new Error("No se encontró la cuenta seleccionada.");
  }

  return accounts.map((item, itemIndex) => (itemIndex === index ? { ...item, ...account } : item));
}

export function deleteAccountAtIndex(accounts: FinanceAccount[], index: number) {
  if (index < 0 || index >= accounts.length) {
    throw new Error("No se encontró la cuenta seleccionada.");
  }

  return accounts.filter((_, itemIndex) => itemIndex !== index);
}
