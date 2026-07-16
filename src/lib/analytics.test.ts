import { describe, expect, it } from "vitest";
import {
  computeCategoryBreakdown,
  computeDailyFlow,
  computeMonthlyKpis,
  computeMonthOverMonth,
  computeNetWorthTrend,
  currentMonthStart,
  UNCATEGORIZED_KEY,
  type NetWorthAccountSnapshot,
} from "@/lib/analytics";
import type { FinanceMovement } from "@/lib/finance-types";

describe("currentMonthStart", () => {
  it("returns the first day of the reference month", () => {
    expect(currentMonthStart(new Date("2026-07-13T10:00:00Z"))).toBe("2026-07-01");
    expect(currentMonthStart(new Date("2026-01-31T23:00:00Z"))).toBe("2026-01-01");
  });
});

describe("computeMonthlyKpis", () => {
  it("derives balance and savings rate from income and expenses", () => {
    const kpis = computeMonthlyKpis({ income: 45230, expenses: 28450 });
    expect(kpis.income).toBe(45230);
    expect(kpis.expenses).toBe(28450);
    expect(kpis.balance).toBe(16780);
    expect(kpis.savingsRate).toBeCloseTo(37.1, 1);
  });

  it("returns a null savings rate when there is no income", () => {
    const kpis = computeMonthlyKpis({ income: 0, expenses: 500 });
    expect(kpis.balance).toBe(-500);
    expect(kpis.savingsRate).toBeNull();
  });

  it("allows a negative balance and savings rate when overspending", () => {
    const kpis = computeMonthlyKpis({ income: 1000, expenses: 1500 });
    expect(kpis.balance).toBe(-500);
    expect(kpis.savingsRate).toBe(-50);
  });

  it("coerces non-finite inputs to zero", () => {
    const kpis = computeMonthlyKpis({ income: Number.NaN, expenses: Number.NaN });
    expect(kpis).toEqual({ income: 0, expenses: 0, balance: 0, savingsRate: null });
  });
});

describe("computeCategoryBreakdown", () => {
  const categories = [
    { id: "food", name: "Comida", color: "#16a34a" },
    { id: "home", name: "Vivienda", color: "#2563eb" },
  ];
  function mv(overrides: Partial<FinanceMovement>): FinanceMovement {
    return { date: "2026-07-10", occurredOn: "2026-07-10", description: "x", account: "A", category: "Comida", type: "Gasto", amount: -100, ...overrides };
  }

  it("groups expenses by category, sums abs amounts and counts, sorted desc", () => {
    const result = computeCategoryBreakdown(
      [
        mv({ categoryId: "food", amount: -100 }),
        mv({ categoryId: "food", amount: -50 }),
        mv({ categoryId: "home", amount: -300 }),
      ],
      categories,
      "2026-07",
    );
    expect(result.map((item) => [item.key, item.amount, item.count])).toEqual([
      ["home", 300, 1],
      ["food", 150, 2],
    ]);
    expect(result[0]).toMatchObject({ name: "Vivienda", color: "#2563eb" });
  });

  it("folds movements without an active category into a Sin categoría bucket", () => {
    const result = computeCategoryBreakdown(
      [
        mv({ categoryId: undefined, category: "Sin categoría", amount: -80 }),
        mv({ categoryId: "archived-id", amount: -20 }), // id not in categories list
      ],
      categories,
      "2026-07",
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ key: UNCATEGORIZED_KEY, name: "Sin categoría", amount: 100, count: 2 });
  });

  it("only counts expenses within the target month", () => {
    const result = computeCategoryBreakdown(
      [
        mv({ categoryId: "food", occurredOn: "2026-07-01", amount: -100 }),
        mv({ categoryId: "food", occurredOn: "2026-06-30", amount: -999 }),
      ],
      categories,
      "2026-07",
    );
    expect(result).toEqual([{ key: "food", name: "Comida", color: "#16a34a", amount: 100, count: 1 }]);
  });

  it("ignores income and transfers", () => {
    const result = computeCategoryBreakdown(
      [
        mv({ type: "Ingreso", amount: 5000 }),
        mv({ type: "Transferencia", amount: 1000 }),
      ],
      categories,
      "2026-07",
    );
    expect(result).toEqual([]);
  });
});

describe("computeDailyFlow", () => {
  function mv(overrides: Partial<FinanceMovement>): FinanceMovement {
    return { date: "2026-07-02", occurredOn: "2026-07-02", description: "x", account: "A", category: "Comida", type: "Gasto", amount: -100, ...overrides };
  }
  const reference = new Date("2026-07-03T12:00:00Z"); // through day 3

  it("covers day 1 through today with zero-filled empty days", () => {
    const series = computeDailyFlow([mv({ occurredOn: "2026-07-02", type: "Gasto", amount: -100 })], reference);
    expect(series.map((point) => point.day)).toEqual([1, 2, 3]);
    expect(series[0]).toEqual({ day: 1, income: 0, expenses: 0 });
    expect(series[1]).toEqual({ day: 2, income: 0, expenses: 100 });
    expect(series[2]).toEqual({ day: 3, income: 0, expenses: 0 });
  });

  it("sums multiple movements on the same day and separates income from expenses", () => {
    const series = computeDailyFlow([
      mv({ occurredOn: "2026-07-01", type: "Gasto", amount: -40 }),
      mv({ occurredOn: "2026-07-01", type: "Gasto", amount: -60 }),
      mv({ occurredOn: "2026-07-01", type: "Ingreso", amount: 500 }),
    ], reference);
    expect(series[0]).toEqual({ day: 1, income: 500, expenses: 100 });
  });

  it("excludes transfers, other months, and days beyond today", () => {
    const series = computeDailyFlow([
      mv({ occurredOn: "2026-07-02", type: "Transferencia", amount: 1000 }),
      mv({ occurredOn: "2026-06-30", type: "Gasto", amount: -999 }),
      mv({ occurredOn: "2026-07-10", type: "Gasto", amount: -5 }),
    ], reference);
    expect(series.reduce((sum, point) => sum + point.income + point.expenses, 0)).toBe(0);
  });

  it("handles a month that just started (single day)", () => {
    const series = computeDailyFlow([mv({ occurredOn: "2026-07-01", amount: -100 })], new Date("2026-07-01T08:00:00Z"));
    expect(series).toEqual([{ day: 1, income: 0, expenses: 100 }]);
  });
});

describe("computeMonthOverMonth", () => {
  const reference = new Date("2026-07-15T12:00:00Z"); // through day 15
  function mv(overrides: Partial<FinanceMovement>): FinanceMovement {
    return { date: "2026-07-10", occurredOn: "2026-07-10", description: "x", account: "A", category: "Comida", type: "Gasto", amount: -100, ...overrides };
  }

  it("reports 'no previous' when the prior same-period had no activity", () => {
    const result = computeMonthOverMonth([mv({ occurredOn: "2026-07-05", type: "Ingreso", amount: 1000 })], reference);
    expect(result).toEqual({ hasPrevious: false, income: null, expenses: null, balance: null, savingsRate: null });
  });

  it("computes an income % delta (more income is favorable)", () => {
    const result = computeMonthOverMonth([
      mv({ occurredOn: "2026-06-10", type: "Ingreso", amount: 1000 }),
      mv({ occurredOn: "2026-07-10", type: "Ingreso", amount: 1200 }),
    ], reference);
    expect(result.income).toEqual({ percent: 20, favorable: true, direction: "up" });
  });

  it("inverts favorability for expenses: spending less is favorable", () => {
    const result = computeMonthOverMonth([
      mv({ occurredOn: "2026-06-10", type: "Gasto", amount: -1000 }),
      mv({ occurredOn: "2026-07-10", type: "Gasto", amount: -800 }),
    ], reference);
    // spending dropped 20% → direction down but favorable (green)
    expect(result.expenses).toEqual({ percent: -20, favorable: true, direction: "down" });
  });

  it("only compares the same day window (day 1..today) of each month", () => {
    const result = computeMonthOverMonth([
      mv({ occurredOn: "2026-06-10", type: "Gasto", amount: -500 }),
      mv({ occurredOn: "2026-06-25", type: "Gasto", amount: -9999 }), // day 25 > through day 15, excluded
      mv({ occurredOn: "2026-07-10", type: "Gasto", amount: -500 }),
    ], reference);
    expect(result.expenses).toEqual({ percent: 0, favorable: false, direction: "flat" });
  });

  it("gives balance a direction-only delta (no percent) and honors 'more is better'", () => {
    const result = computeMonthOverMonth([
      mv({ occurredOn: "2026-06-10", type: "Ingreso", amount: 1000 }),
      mv({ occurredOn: "2026-06-11", type: "Gasto", amount: -900 }), // prev balance 100
      mv({ occurredOn: "2026-07-10", type: "Ingreso", amount: 1000 }),
      mv({ occurredOn: "2026-07-11", type: "Gasto", amount: -400 }), // current balance 600
    ], reference);
    expect(result.balance).toEqual({ percent: null, favorable: true, direction: "up" });
    expect(result.savingsRate).toEqual({ percent: null, favorable: true, direction: "up" });
  });
});

describe("computeNetWorthTrend", () => {
  const reference = new Date("2026-07-15T12:00:00Z"); // through July 15

  function acc(overrides: Partial<NetWorthAccountSnapshot> & { id: string }): NetWorthAccountSnapshot {
    return { initialBalance: 0, createdAt: "2026-01-01", ...overrides };
  }
  function mv(overrides: Partial<FinanceMovement>): FinanceMovement {
    return { date: "2026-07-10", occurredOn: "2026-07-10", description: "x", account: "A", category: "Comida", type: "Gasto", amount: -100, accountId: "acc-1", ...overrides };
  }

  it("reconstructs the balance at each month cutoff from initial balance + ledger", () => {
    const accounts = [acc({ id: "acc-1", initialBalance: 1000, createdAt: "2026-01-01" })];
    const movements = [
      mv({ occurredOn: "2026-05-10", type: "Ingreso", amount: 500 }),
      mv({ occurredOn: "2026-06-10", type: "Gasto", amount: -200 }),
      mv({ occurredOn: "2026-07-10", type: "Ingreso", amount: 300 }),
    ];
    const trend = computeNetWorthTrend(accounts, movements, 3, reference);
    expect(trend.map((point) => point.month)).toEqual(["2026-05", "2026-06", "2026-07"]);
    expect(trend[0].netWorth).toBe(1500); // 1000 + 500
    expect(trend[1].netWorth).toBe(1300); // 1500 - 200
    expect(trend[2].netWorth).toBe(1600); // 1300 + 300, current month through today
  });

  it("excludes movements dated after each cutoff", () => {
    const accounts = [acc({ id: "acc-1", initialBalance: 0, createdAt: "2026-01-01" })];
    const movements = [
      mv({ occurredOn: "2026-06-15", type: "Ingreso", amount: 1000 }), // within June cutoff (06-30)
      mv({ occurredOn: "2026-07-20", type: "Ingreso", amount: 5000 }), // after both cutoffs (06-30 and 07-15)
    ];
    const trend = computeNetWorthTrend(accounts, movements, 2, reference);
    expect(trend.map((point) => point.month)).toEqual(["2026-06", "2026-07"]);
    expect(trend[0].netWorth).toBe(1000);
    expect(trend[1].netWorth).toBe(1000); // unchanged: the 07-20 movement is after the 07-15 cutoff
  });

  it("excludes an account from cutoffs before it was created", () => {
    const accounts = [
      acc({ id: "old", initialBalance: 1000, createdAt: "2026-01-01" }),
      acc({ id: "new", initialBalance: 500, createdAt: "2026-06-20" }),
    ];
    const trend = computeNetWorthTrend(accounts, [], 3, reference);
    expect(trend.map((point) => point.month)).toEqual(["2026-05", "2026-06", "2026-07"]);
    expect(trend[0].netWorth).toBe(1000); // May: "new" doesn't exist yet
    expect(trend[1].netWorth).toBe(1500); // June: created 06-20, cutoff is 06-30
    expect(trend[2].netWorth).toBe(1500);
  });

  it("nets a transfer between two accounts to zero in the total", () => {
    const accounts = [
      acc({ id: "checking", initialBalance: 1000, createdAt: "2026-01-01" }),
      acc({ id: "savings", initialBalance: 0, createdAt: "2026-01-01" }),
    ];
    const movements = [
      mv({ occurredOn: "2026-07-05", type: "Transferencia", amount: 300, accountId: "checking", destinationAccountId: "savings" }),
    ];
    const trend = computeNetWorthTrend(accounts, movements, 1, reference);
    expect(trend[0].netWorth).toBe(1000);
  });
});
