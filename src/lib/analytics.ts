// Shared analytics calculations for the Análisis/Categorías surface, consumed by
// both the desktop page and the mobile experience so the numbers never diverge.
// Keep the math here (pure + tested) and the data fetching in use-analytics.

export type MonthlyKpis = {
  /** Total income for the period (positive). */
  income: number;
  /** Total expenses for the period (positive). */
  expenses: number;
  /** income - expenses (can be negative). */
  balance: number;
  /** Savings rate as a percentage, or null when there is no income to divide by. */
  savingsRate: number | null;
};

/**
 * First day of the calendar month for `reference`, as `YYYY-MM-01`.
 * Matches how monthly_budgets / category_spending_summary key the month, so the
 * whole app agrees on what "current month" means.
 */
export function currentMonthStart(reference: Date = new Date()): string {
  return `${reference.toISOString().slice(0, 7)}-01`;
}

/** Derive the KPI set from a period's income/expenses totals. */
export function computeMonthlyKpis(input: { income: number; expenses: number }): MonthlyKpis {
  const income = Number.isFinite(input.income) ? input.income : 0;
  const expenses = Number.isFinite(input.expenses) ? input.expenses : 0;
  const balance = income - expenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : null;
  return { income, expenses, balance, savingsRate };
}
