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
        ? supabase.from("accounts").update(payload).eq("id", current.id).select("id").single()
        : supabase.from("accounts").insert(payload).select("id").single();
      const { data: savedAccount, error: mutationError } = await mutation;
      if (mutationError) throw mutationError;

      const wasCard = current?.type === "Tarjeta";
      const isCard = account.type === "Tarjeta";
      if (isCard) {
        const { error: liabilityError } = await supabase.from("liabilities").upsert(
          {
            user_id: user.id,
            account_id: savedAccount.id,
            type: "credit_card",
            status: "active",
            name: account.name,
            statement_closing_day: account.statement_closing_day ?? null,
            payment_due_day: account.payment_due_day ?? null,
            credit_limit: account.credit_limit ?? null,
          },
          { onConflict: "account_id" },
        );
        if (liabilityError) throw liabilityError;
      } else if (wasCard) {
        const { error: closeError } = await supabase.from("liabilities").update({ status: "closed" }).eq("account_id", savedAccount.id);
        if (closeError) throw closeError;
      }

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
      if (account.type === "Tarjeta") {
        const { error: closeError } = await supabase.from("liabilities").update({ status: "closed" }).eq("account_id", account.id);
        if (closeError) throw closeError;
      }
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
