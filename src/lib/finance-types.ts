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
  color: string;
  icon: LucideIcon;
  bank_name?: BankName | string;
  bank_custom_name?: string;
};

export type AccountFormValue = {
  name: string;
  alias?: string;
  type: AccountType;
  balance: number;
  bank_name?: string;
  bank_custom_name?: string;
};

export type FinanceMovement = {
  date: string;
  description: string;
  account: string;
  destinationAccount?: string;
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

export type ScheduledTransactionType = "expense" | "income" | "transfer" | "debt_payment" | "subscription";
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
};
