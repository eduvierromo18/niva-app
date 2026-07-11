"use client";

import { useCallback, useMemo, useState } from "react";
import {
  createFinanceAccount,
  deleteAccountAtIndex,
  getAccountTotals,
  getInstitutionGroups,
  getMoneyDistribution,
  updateAccountAtIndex,
} from "@/lib/accounts";
import type { AccountFormValue, FinanceAccount } from "@/lib/finance-types";

export function useAccounts(initialAccounts: FinanceAccount[]) {
  const [accounts, setAccounts] = useState<FinanceAccount[]>(initialAccounts);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const totals = useMemo(() => getAccountTotals(accounts), [accounts]);
  const moneyDistribution = useMemo(() => getMoneyDistribution(accounts), [accounts]);
  const institutionGroups = useMemo(() => getInstitutionGroups(accounts), [accounts]);
  const clearError = useCallback(() => setError(null), []);

  const saveAccount = useCallback((account: AccountFormValue, editingIndex: number | null) => {
    try {
      setAccounts((current) => {
        if (editingIndex !== null) return updateAccountAtIndex(current, editingIndex, account);
        return [...current, createFinanceAccount(account)];
      });
      setError(null);
      return true;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No pudimos guardar la cuenta.");
      return false;
    }
  }, []);

  const deleteAccount = useCallback((index: number) => {
    try {
      setAccounts((current) => deleteAccountAtIndex(current, index));
      setError(null);
      return true;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "No pudimos eliminar la cuenta.");
      return false;
    }
  }, []);

  return {
    accounts,
    isLoading,
    error,
    clearError,
    saveAccount,
    deleteAccount,
    totals,
    moneyDistribution,
    institutionGroups,
  };
}
