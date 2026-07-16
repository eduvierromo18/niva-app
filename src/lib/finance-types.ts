import type { LucideIcon } from "lucide-react";
import type { BankCatalogItem } from "@/config/banks";

export type BankName = BankCatalogItem["id"] | string;
export type AccountType = "Banco" | "Efectivo" | "Ahorro" | "Tarjeta" | "Inversion" | "Deuda";

export type FinanceAccount = {
  id?: string;
  name: string;
  alias?: string;
  type: AccountType;
  balance: number;
  initialBalance?: number;
  currencyCode?: string;
  isArchived?: boolean;
  color: string;
  icon: LucideIcon;
  bank_name?: BankName | string;
  bank_custom_name?: string;
  statement_closing_day?: number;
  payment_due_day?: number;
  credit_limit?: number;
};

export type AccountFormValue = {
  name: string;
  alias?: string;
  type: AccountType;
  balance: number;
  bank_name?: string;
  bank_custom_name?: string;
  statement_closing_day?: number;
  payment_due_day?: number;
  credit_limit?: number;
};

export type FinanceMovement = {
  id?: string;
  occurredOn?: string;
  date: string;
  description: string;
  accountId?: string;
  account: string;
  destinationAccountId?: string;
  destinationAccount?: string;
  categoryId?: string;
  category: string;
  type: string;
  amount: number;
  merchant?: string;
};

export type FinanceMetric = {
  label: string;
  value: number;
  delta: number;
  trend: "up" | "down";
  icon: LucideIcon;
  percent?: boolean;
};

export type ScheduledTransactionType = "expense" | "income" | "transfer" | "debt_payment" | "subscription" | "msi_installment";
export type ScheduledFrequency = "weekly" | "biweekly" | "monthly" | "yearly" | "custom";
export type ScheduledStatus = "active" | "paused" | "finished";

export type ScheduledTransaction = {
  id: string;
  name: string;
  type: ScheduledTransactionType;
  amount: number;
  account: string;
  destinationAccount?: string;
  category?: string;
  frequency: ScheduledFrequency;
  startDate: string;
  nextDueDate: string;
  endDate?: string;
  status: ScheduledStatus;
  notes?: string;
  autoCreate: boolean;
  isInformational?: boolean;
  installmentNumber?: number;
  totalInstallments?: number;
};
