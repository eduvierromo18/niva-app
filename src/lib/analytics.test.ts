import { describe, expect, it } from "vitest";
import { computeMonthlyKpis, currentMonthStart } from "@/lib/analytics";

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
