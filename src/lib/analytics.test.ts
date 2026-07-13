import { describe, expect, it } from "vitest";
import { computeCategoryBreakdown, computeMonthlyKpis, currentMonthStart, UNCATEGORIZED_KEY } from "@/lib/analytics";
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
