import { describe, expect, it } from "vitest";
import { WalletCards } from "lucide-react";
import { getFeaturedGoalProgress, getSpendableSummary } from "@/lib/dashboard";
import type { FinanceAccount } from "@/lib/finance-types";

describe("getFeaturedGoalProgress", () => {
  it("returns a safe value before a goal has loaded", () => {
    expect(getFeaturedGoalProgress()).toBe(0);
  });

  it("calculates and bounds a valid goal percentage", () => {
    expect(getFeaturedGoalProgress({ current: 250, target: 1000 })).toBe(25);
    expect(getFeaturedGoalProgress({ current: 1200, target: 1000 })).toBe(100);
    expect(getFeaturedGoalProgress({ current: -10, target: 1000 })).toBe(0);
  });
});

function account(overrides: Partial<FinanceAccount>): FinanceAccount {
  return { id: "a", name: "Cuenta", type: "Banco", balance: 0, color: "", icon: WalletCards, ...overrides };
}

describe("getSpendableSummary", () => {
  it("subtracts reserved (reserva/ahorro) from positive cash", () => {
    const summary = getSpendableSummary([
      account({ id: "checking", balance: 12000 }),
      account({ id: "savings", name: "Ahorro", type: "Ahorro", balance: 5000 }),
      account({ id: "reserve", name: "Fondo", alias: "Reserva", balance: 3000 }),
      account({ id: "card", type: "Tarjeta", balance: -2000 }),
    ]);
    expect(summary.reserved).toBe(8000); // ahorro + reserva
    expect(summary.availableCash).toBe(20000); // all non-card positive balances
    expect(summary.spendable).toBe(12000); // 20000 - 8000
    expect(summary.spendableRatio).toBe(60); // 12000 / 20000
  });

  it("ignores negative and credit-card balances in available cash", () => {
    const summary = getSpendableSummary([
      account({ id: "overdrawn", balance: -1000 }),
      account({ id: "card", type: "Tarjeta", balance: 4000 }),
    ]);
    expect(summary.availableCash).toBe(0);
    expect(summary.spendable).toBe(0);
    expect(summary.spendableRatio).toBe(0);
  });

  it("returns zeroes with no accounts", () => {
    expect(getSpendableSummary([])).toEqual({ reserved: 0, availableCash: 0, spendable: 0, spendableRatio: 0 });
  });
});
