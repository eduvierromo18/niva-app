import { describe, expect, it } from "vitest";
import { WalletCards } from "lucide-react";
import { getAccountTotals, getAccountStatus, isSavingsAccount } from "@/lib/accounts";
import type { FinanceAccount } from "@/lib/finance-types";

function account(overrides: Partial<FinanceAccount>): FinanceAccount {
  return { id: "a", name: "Cuenta", type: "Banco", balance: 0, color: "", icon: WalletCards, ...overrides };
}

describe("account calculations", () => {
  it("separates available, reserved and credit balances", () => {
    const totals = getAccountTotals([
      account({ id: "checking", balance: 12000 }),
      account({ id: "savings", name: "Ahorro", type: "Ahorro", balance: 5000 }),
      account({ id: "card", type: "Tarjeta", balance: -2000 }),
    ]);
    expect(totals.totalMoney).toBe(15000);
    expect(totals.availableMoney).toBe(17000);
    expect(totals.reservedMoney).toBe(5000);
    expect(totals.creditImpact).toBe(-2000);
  });

  it("recognizes savings language and low-balance review state", () => {
    expect(isSavingsAccount(account({ alias: "Reserva" }))).toBe(true);
    expect(getAccountStatus(account({ balance: 500 }))).toEqual({ label: "Por revisar", tone: "review" });
  });
});

