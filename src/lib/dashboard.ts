import type { FinanceAccount } from "@/lib/finance-types";

type GoalProgressInput = {
  current: number;
  target: number;
};

export function getFeaturedGoalProgress(goal?: GoalProgressInput) {
  if (!goal || goal.target <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((goal.current / goal.target) * 100)));
}

export type SpendableSummary = {
  /** Balance kept aside (reserva / ahorro accounts), protected from daily spending. */
  reserved: number;
  /** Positive cash across non-credit accounts, before subtracting reserved. */
  availableCash: number;
  /** What is actually free to decide with today: availableCash minus reserved. */
  spendable: number;
  /** spendable as a percentage of availableCash (0 when there is no cash). */
  spendableRatio: number;
};

/**
 * Single source of truth for the "Disponible vs. Reservado" home numbers,
 * shared by the desktop dashboard and the mobile home. Do not re-derive these
 * inline per surface — extend this function so both stay in sync.
 */
export function getSpendableSummary(accounts: FinanceAccount[]): SpendableSummary {
  const reserved = accounts
    .filter((account) => account.alias === "Reserva" || account.name.toLowerCase().includes("ahorro"))
    .reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const availableCash = accounts
    .filter((account) => account.type !== "Tarjeta")
    .reduce((sum, account) => sum + Math.max(account.balance, 0), 0);
  const spendable = Math.max(availableCash - reserved, 0);
  const spendableRatio = availableCash > 0 ? Math.round((spendable / availableCash) * 100) : 0;
  return { reserved, availableCash, spendable, spendableRatio };
}
