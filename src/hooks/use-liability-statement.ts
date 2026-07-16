"use client";

import { useCallback, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapMovement } from "@/lib/finance-mappers";
import type { StatementPeriod } from "@/lib/liabilities";
import type { FinanceAccount, FinanceMovement } from "@/lib/finance-types";

/**
 * On-demand statement detail for one liability's linked card: fetches only the
 * movements touching that account within the given period, instead of loading
 * the user's full movement history (which useMovements() would) just to filter
 * a handful of rows client-side.
 */
export function useLiabilityStatement() {
  const [items, setItems] = useState<FinanceMovement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (accountId: string, period: StatementPeriod, accounts: FinanceAccount[]) => {
    setIsLoading(true);
    setError("");
    const supabase = createClient();
    const [movementResult, categoryResult] = await Promise.all([
      supabase
        .from("movements")
        .select("*")
        .or(`account_id.eq.${accountId},from_account_id.eq.${accountId},to_account_id.eq.${accountId}`)
        .gte("occurred_on", period.start)
        .lte("occurred_on", period.end)
        .order("occurred_on", { ascending: false }),
      supabase.from("categories").select("id,name"),
    ]);
    const queryError = movementResult.error ?? categoryResult.error;
    if (queryError) {
      setError(queryError.message);
      setIsLoading(false);
      return;
    }
    setItems((movementResult.data ?? []).map((row) => mapMovement(row, accounts, categoryResult.data ?? [])));
    setIsLoading(false);
  }, []);

  return { items, isLoading, error, load };
}
