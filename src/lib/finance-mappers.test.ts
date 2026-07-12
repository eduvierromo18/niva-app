import { describe, expect, it } from "vitest";
import { mapAccount, mapMovement, uiToDbType } from "@/lib/finance-mappers";

describe("Supabase finance mappers", () => {
  it("maps persisted accounts to the UI domain", () => {
    const mapped = mapAccount({
      id: "account-1", user_id: "user-1", name: "Nomina", alias: null, type: "checking", currency_code: "MXN",
      initial_balance: 1000, balance: 1250, bank_name: "bbva", bank_custom_name: null, color: null, icon: null,
      is_archived: false, created_at: "2026-07-12T00:00:00Z", updated_at: "2026-07-12T00:00:00Z",
    });
    expect(mapped.type).toBe("Banco");
    expect(mapped.balance).toBe(1250);
    expect(mapped.initialBalance).toBe(1000);
    expect(uiToDbType[mapped.type]).toBe("checking");
  });

  it("maps expenses with a negative display amount", () => {
    const accounts = [mapAccount({
      id: "account-1", user_id: "user-1", name: "Nomina", alias: null, type: "checking", currency_code: "MXN",
      initial_balance: 1000, balance: 1000, bank_name: null, bank_custom_name: null, color: null, icon: null,
      is_archived: false, created_at: null, updated_at: null,
    })];
    const movement = mapMovement({
      id: "movement-1", user_id: "user-1", type: "expense", account_id: "account-1", from_account_id: null,
      to_account_id: null, category_id: "category-1", amount: 250, occurred_on: "2026-07-12", description: "Comida",
      notes: null, merchant: null, is_recurring: false, created_at: "2026-07-12T00:00:00Z", updated_at: "2026-07-12T00:00:00Z",
    }, accounts, [{ id: "category-1", name: "Comida" }]);
    expect(movement.amount).toBe(-250);
    expect(movement.account).toBe("Nómina");
    expect(movement.category).toBe("Comida");
  });
});

