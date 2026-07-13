"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { computeMonthlyKpis, currentMonthStart, type MonthlyKpis } from "@/lib/analytics";

/**
 * Current-month KPIs (Ingresos, Gastos, Balance, Ahorro) from the real
 * monthly_financial_summary view. Single source shared by the desktop analytics
 * page and the mobile analytics screen. RLS (security_invoker) scopes the view
 * to the signed-in user, so no explicit user filter is needed.
 */
export function useAnalytics() {
  const [kpis, setKpis] = useState<MonthlyKpis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error: queryError } = await supabase
      .from("monthly_financial_summary")
      .select("income,expenses")
      .eq("month", currentMonthStart())
      .maybeSingle();
    if (queryError) {
      setError(queryError.message);
      setIsLoading(false);
      return;
    }
    setKpis(computeMonthlyKpis({ income: Number(data?.income ?? 0), expenses: Number(data?.expenses ?? 0) }));
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { kpis, isLoading, error, reload: load };
}
