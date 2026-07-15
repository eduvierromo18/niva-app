"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapAccount, uiToDbType } from "@/lib/finance-mappers";
import { getAccountTotals, getInstitutionGroups, getMoneyDistribution } from "@/lib/accounts";
import type { AccountFormValue, FinanceAccount } from "@/lib/finance-types";

export function useAccounts() {
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const totals = useMemo(() => getAccountTotals(accounts), [accounts]);
  const moneyDistribution = useMemo(() => getMoneyDistribution(accounts), [accounts]);
  const institutionGroups = useMemo(() => getInstitutionGroups(accounts), [accounts]);
  const clearError = useCallback(() => setError(null), []);

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error: queryError } = await supabase
      .from("account_balances")
      .select("*")
      .eq("is_archived", false)
      .order("created_at");
    if (queryError) setError(queryError.message);
    else setAccounts((data ?? []).map(mapAccount));
    setIsLoading(false);
  }, []);

  useEffect(() => { void loadAccounts(); }, [loadAccounts]);

  const saveAccount = useCallback(async (account: AccountFormValue, editingIndex: number | null) => {
    try {
      const supabase = createClient();
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Tu sesión ya no es válida.");
      const current = editingIndex === null ? null : accounts[editingIndex];
      const payload = {
        user_id: user.id,
        name: account.name,
        alias: account.alias ?? null,
        type: uiToDbType[account.type],
        initial_balance: account.balance,
        bank_name: account.bank_name ?? null,
        bank_custom_name: account.bank_custom_name ?? null,
        statement_closing_day: account.statement_closing_day ?? null,
        payment_due_day: account.payment_due_day ?? null,
        credit_limit: account.credit_limit ?? null,
        color: "bg-[var(--niva-color-foreground)]",
      };
      const mutation = current?.id
        ? supabase.from("accounts").update(payload).eq("id", current.id)
        : supabase.from("accounts").insert(payload);
      const { error: mutationError } = await mutation;
      if (mutationError) throw mutationError;
      await loadAccounts();
      setError(null);
      return true;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No pudimos guardar la cuenta.");
      return false;
    }
  }, [accounts, loadAccounts]);

  const archiveAccount = useCallback(async (index: number) => {
    try {
      const account = accounts[index];
      if (!account?.id) throw new Error("No encontramos la cuenta.");
      const supabase = createClient();
      const { error: mutationError } = await supabase.from("accounts").update({ is_archived: true }).eq("id", account.id);
      if (mutationError) throw mutationError;
      setAccounts((current) => current.filter((item) => item.id !== account.id));
      setError(null);
      return true;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No pudimos archivar la cuenta.");
      return false;
    }
  }, [accounts]);

  return { accounts, isLoading, error, clearError, reload: loadAccounts, saveAccount, deleteAccount: archiveAccount, totals, moneyDistribution, institutionGroups };
}
