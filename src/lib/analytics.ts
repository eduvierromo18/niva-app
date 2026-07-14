// Shared analytics calculations for the Análisis/Categorías surface, consumed by
// both the desktop page and the mobile experience so the numbers never diverge.
// Keep the math here (pure + tested) and the data fetching in use-analytics.

import type { FinanceMovement } from "@/lib/finance-types";

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

/** Calendar month for `reference`, as `YYYY-MM`. Basis for "current month". */
export function currentMonthPrefix(reference: Date = new Date()): string {
  return reference.toISOString().slice(0, 7);
}

/** Calendar month before `reference`, as `YYYY-MM`. */
export function previousMonthPrefix(reference: Date = new Date()): string {
  return new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth() - 1, 1)).toISOString().slice(0, 7);
}

/**
 * First day of the calendar month for `reference`, as `YYYY-MM-01`.
 * Matches how monthly_budgets / category_spending_summary key the month, so the
 * whole app agrees on what "current month" means.
 */
export function currentMonthStart(reference: Date = new Date()): string {
  return `${currentMonthPrefix(reference)}-01`;
}

/** Derive the KPI set from a period's income/expenses totals. */
export function computeMonthlyKpis(input: { income: number; expenses: number }): MonthlyKpis {
  const income = Number.isFinite(input.income) ? input.income : 0;
  const expenses = Number.isFinite(input.expenses) ? input.expenses : 0;
  const balance = income - expenses;
  const savingsRate = income > 0 ? (balance / income) * 100 : null;
  return { income, expenses, balance, savingsRate };
}

export type CategorySpend = {
  /** Category id, or a sentinel for the uncategorized bucket. */
  key: string;
  name: string;
  color: string;
  amount: number;
  count: number;
};

export const UNCATEGORIZED_KEY = "__uncategorized__";
const UNCATEGORIZED_COLOR = "#9CA3AF";

/**
 * Expense breakdown by category for the given month (`YYYY-MM`), derived from the
 * already-loaded movements + categories. Everything without an active category
 * (no category, or an archived one no longer in the list) folds into a single
 * "Sin categoría" bucket, so the totals reconcile with the Gastos KPI. Colors
 * come from categories.color — the same source category_spending_summary uses.
 */
export function computeCategoryBreakdown(
  movements: FinanceMovement[],
  categories: { id: string; name: string; color: string | null }[],
  monthPrefix: string,
): CategorySpend[] {
  const byId = new Map(categories.map((category) => [category.id, category]));
  const groups = new Map<string, CategorySpend>();
  for (const movement of movements) {
    if (movement.type !== "Gasto") continue;
    const occurred = movement.occurredOn ?? movement.date;
    if (!occurred || occurred.slice(0, 7) !== monthPrefix) continue;
    const category = movement.categoryId ? byId.get(movement.categoryId) : undefined;
    const key = category?.id ?? UNCATEGORIZED_KEY;
    const amount = Math.abs(movement.amount);
    const existing = groups.get(key);
    if (existing) {
      existing.amount += amount;
      existing.count += 1;
    } else {
      groups.set(key, {
        key,
        name: category?.name ?? "Sin categoría",
        color: category?.color ?? UNCATEGORIZED_COLOR,
        amount,
        count: 1,
      });
    }
  }
  return [...groups.values()].sort((a, b) => b.amount - a.amount);
}

export type DailyFlowPoint = { day: number; income: number; expenses: number };

/**
 * Daily income/expense totals for the current month, from day 1 through today
 * (no future days). Every elapsed day is present — days with no activity stay at
 * zero so the timeline is continuous. Transfers are excluded, matching the KPIs
 * and the category breakdown. Uses the same month/day basis as the other pieces.
 */
export function computeDailyFlow(movements: FinanceMovement[], reference: Date = new Date()): DailyFlowPoint[] {
  const monthPrefix = currentMonthPrefix(reference);
  const throughDay = Number(reference.toISOString().slice(8, 10));
  const points: DailyFlowPoint[] = Array.from({ length: throughDay }, (_, index) => ({ day: index + 1, income: 0, expenses: 0 }));
  for (const movement of movements) {
    if (movement.type === "Transferencia") continue;
    const occurred = movement.occurredOn ?? movement.date;
    if (!occurred || occurred.slice(0, 7) !== monthPrefix) continue;
    const day = Number(occurred.slice(8, 10));
    if (!(day >= 1 && day <= throughDay)) continue;
    const point = points[day - 1];
    if (movement.type === "Ingreso") point.income += Math.abs(movement.amount);
    else if (movement.type === "Gasto") point.expenses += Math.abs(movement.amount);
  }
  return points;
}

/**
 * One KPI's month-over-month change. `null` means "no comparable previous data"
 * (render "Sin mes anterior aún"). `direction` is the raw numeric movement;
 * `favorable` decides the color (green/red) and is metric-specific (for expenses
 * spending less is favorable). `percent` is null for direction-only metrics
 * (Balance, Ahorro) whose base can be negative/zero, so only the arrow is shown.
 */
export type MetricDelta = {
  percent: number | null;
  favorable: boolean;
  direction: "up" | "down" | "flat";
} | null;

export type MonthOverMonth = {
  hasPrevious: boolean;
  income: MetricDelta;
  expenses: MetricDelta;
  balance: MetricDelta;
  savingsRate: MetricDelta;
};

function metricDelta(
  current: number | null,
  previous: number | null,
  mode: { lowerIsBetter?: boolean; directionOnly?: boolean },
): MetricDelta {
  if (current === null || previous === null) return null;
  const direction = current === previous ? "flat" : current > previous ? "up" : "down";
  const favorable = mode.lowerIsBetter ? direction === "down" : direction === "up";
  if (mode.directionOnly) return { percent: null, favorable, direction };
  if (previous <= 0) return null; // a percentage needs a positive base
  return { percent: ((current - previous) / previous) * 100, favorable, direction };
}

/**
 * KPI deltas comparing the current month-to-date (day 1 → today) against the
 * SAME period of the previous month (day 1 → same day) — a fair like-for-like
 * that isn't skewed by the current month being partial. Derived from the already
 * loaded movements (both months are in memory), so no extra query.
 */
export function computeMonthOverMonth(movements: FinanceMovement[], reference: Date = new Date()): MonthOverMonth {
  const throughDay = Number(reference.toISOString().slice(8, 10));
  const sumPeriod = (prefix: string) => {
    let income = 0;
    let expenses = 0;
    for (const movement of movements) {
      const occurred = movement.occurredOn ?? movement.date;
      if (!occurred || occurred.slice(0, 7) !== prefix) continue;
      const day = Number(occurred.slice(8, 10));
      if (!(day >= 1 && day <= throughDay)) continue;
      if (movement.type === "Ingreso") income += Math.abs(movement.amount);
      else if (movement.type === "Gasto") expenses += Math.abs(movement.amount);
    }
    return { income, expenses };
  };

  const current = sumPeriod(currentMonthPrefix(reference));
  const previous = sumPeriod(previousMonthPrefix(reference));
  const hasPrevious = previous.income > 0 || previous.expenses > 0;
  if (!hasPrevious) {
    return { hasPrevious: false, income: null, expenses: null, balance: null, savingsRate: null };
  }

  const rate = (income: number, balance: number) => (income > 0 ? (balance / income) * 100 : null);
  const currentBalance = current.income - current.expenses;
  const previousBalance = previous.income - previous.expenses;
  return {
    hasPrevious: true,
    income: metricDelta(current.income, previous.income, { lowerIsBetter: false }),
    expenses: metricDelta(current.expenses, previous.expenses, { lowerIsBetter: true }),
    balance: metricDelta(currentBalance, previousBalance, { directionOnly: true }),
    savingsRate: metricDelta(rate(current.income, currentBalance), rate(previous.income, previousBalance), { directionOnly: true }),
  };
}
