"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, ReceiptText } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { QuickCreateValue } from "@/components/finance/quick-create-dialog";
import type { FinanceAccount, ScheduledTransaction } from "@/lib/finance-types";
import { mapAccount } from "@/lib/finance-mappers";

export type BudgetItem = { id: string; categoryId: string; name: string; spent: number; limit: number; icon: typeof ReceiptText };
export type GoalItem = { id: string; name: string; current: number; target: number; date: string };
export type LiabilityItem = { id: string; name: string; balance: number; limit: number; closing: string; due: string; icon: typeof CreditCard };

function dayFromText(value?: string) {
  const match = value?.match(/\d{1,2}/);
  const day = match ? Number(match[0]) : null;
  return day && day >= 1 && day <= 31 ? day : null;
}

function dateOrNull(value?: string) {
  if (!value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export function usePlanningData() {
  const [budgets, setBudgets] = useState<BudgetItem[]>([]);
  const [goals, setGoals] = useState<GoalItem[]>([]);
  const [liabilities, setLiabilities] = useState<LiabilityItem[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledTransaction[]>([]);
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const month = new Date().toISOString().slice(0, 7) + "-01";
    const [budgetResult, spendingResult, goalResult, liabilityResult, scheduledResult, accountResult, categoryResult] = await Promise.all([
      supabase.from("monthly_budgets").select("id,category_id,amount,month").eq("month", month),
      supabase.from("category_spending_summary").select("category_id,amount").eq("month", month),
      supabase.from("savings_goals").select("*").neq("status", "cancelled").order("created_at"),
      supabase.from("liabilities").select("*").eq("status", "active").order("created_at"),
      supabase.from("scheduled_transactions").select("*").order("next_due_date"),
      supabase.from("account_balances").select("*").eq("is_archived", false).order("created_at"),
      supabase.from("categories").select("id,name,type").eq("is_archived", false),
    ]);
    const queryError = budgetResult.error ?? spendingResult.error ?? goalResult.error ?? liabilityResult.error ?? scheduledResult.error ?? accountResult.error ?? categoryResult.error;
    if (queryError) setError(queryError.message);
    else {
      const categories = categoryResult.data ?? [];
      const spending = new Map((spendingResult.data ?? []).map((item) => [item.category_id, Number(item.amount ?? 0)]));
      setBudgets((budgetResult.data ?? []).map((item) => ({
        id: item.id,
        categoryId: item.category_id,
        name: categories.find((category) => category.id === item.category_id)?.name ?? "Categoría",
        spent: spending.get(item.category_id) ?? 0,
        limit: Number(item.amount),
        icon: ReceiptText,
      })));
      setGoals((goalResult.data ?? []).map((item) => ({ id: item.id, name: item.name, current: Number(item.current_amount), target: Number(item.target_amount), date: item.target_date ?? "Sin fecha" })));
      setLiabilities((liabilityResult.data ?? []).map((item) => ({
        id: item.id, name: item.name, balance: Number(item.principal_amount), limit: Number(item.credit_limit ?? item.principal_amount),
        closing: item.statement_closing_day ? `Día ${item.statement_closing_day}` : "Sin corte", due: item.payment_due_day ? `Día ${item.payment_due_day}` : "Sin fecha", icon: CreditCard,
      })));
      const mappedAccounts = (accountResult.data ?? []).map(mapAccount);
      setAccounts(mappedAccounts);
      setScheduled((scheduledResult.data ?? []).map((item) => ({
        id: item.id, name: item.name, type: item.type as ScheduledTransaction["type"], amount: Number(item.amount),
        account: mappedAccounts.find((account) => account.id === item.account_id)?.name ?? "Cuenta",
        destinationAccount: mappedAccounts.find((account) => account.id === item.destination_account_id)?.name,
        category: categories.find((category) => category.id === item.category_id)?.name,
        frequency: item.frequency as ScheduledTransaction["frequency"], startDate: item.start_date, nextDueDate: item.next_due_date,
        endDate: item.end_date ?? undefined, status: item.status as ScheduledTransaction["status"], notes: item.notes ?? undefined, autoCreate: item.auto_create,
      })));
      setError("");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const saveBudget = useCallback(async (value: QuickCreateValue, editing?: BudgetItem) => {
    const supabase = createClient();
    const auth = await supabase.auth.getUser();
    if (!auth.data.user) return false;
    const categories = await supabase.from("categories").select("id,name").eq("type", "expense").eq("is_archived", false);
    const category = categories.data?.find((item) => item.name.toLowerCase() === value.name.toLowerCase()) ?? categories.data?.[0];
    if (!category) { setError("Crea una categoria de gasto antes del presupuesto."); return false; }
    const month = new Date().toISOString().slice(0, 7) + "-01";
    const result = editing
      ? await supabase.from("monthly_budgets").update({ category_id: category.id, amount: value.amount, month }).eq("id", editing.id)
      : await supabase.from("monthly_budgets").upsert({ user_id: auth.data.user.id, category_id: category.id, amount: value.amount, month }, { onConflict: "user_id,category_id,month" });
    if (result.error) { setError(result.error.message); return false; }
    await load(); return true;
  }, [load]);

  const saveGoal = useCallback(async (value: QuickCreateValue, editing?: GoalItem) => {
    const supabase = createClient();
    const auth = await supabase.auth.getUser();
    if (!auth.data.user) return false;
    const payload = { user_id: auth.data.user.id, name: value.name, target_amount: value.amount, current_amount: value.current ?? 0, target_date: dateOrNull(value.secondary) };
    const result = editing ? await supabase.from("savings_goals").update(payload).eq("id", editing.id) : await supabase.from("savings_goals").insert(payload);
    if (result.error) { setError(result.error.message); return false; }
    await load(); return true;
  }, [load]);

  const saveLiability = useCallback(async (value: QuickCreateValue, editing?: LiabilityItem) => {
    const supabase = createClient();
    const auth = await supabase.auth.getUser();
    if (!auth.data.user) return false;
    const payload = { user_id: auth.data.user.id, name: value.name, type: "credit_card" as const, principal_amount: value.amount, credit_limit: value.extraAmount || null, statement_closing_day: dayFromText(value.secondary), payment_due_day: dayFromText(value.extra) };
    const result = editing ? await supabase.from("liabilities").update(payload).eq("id", editing.id) : await supabase.from("liabilities").insert(payload);
    if (result.error) { setError(result.error.message); return false; }
    await load(); return true;
  }, [load]);

  const remove = useCallback(async (table: "monthly_budgets" | "savings_goals" | "liabilities" | "scheduled_transactions", id: string) => {
    const result = await createClient().from(table).delete().eq("id", id);
    if (result.error) setError(result.error.message); else await load();
  }, [load]);

  const saveScheduled = useCallback(async (value: ScheduledTransaction) => {
    const supabase = createClient();
    const auth = await supabase.auth.getUser();
    if (!auth.data.user) return false;
    const account = accounts.find((item) => item.name === value.account);
    const destination = accounts.find((item) => item.name === value.destinationAccount);
    const categories = await supabase.from("categories").select("id,name").eq("is_archived", false);
    const category = categories.data?.find((item) => item.name === value.category);
    const payload = {
      user_id: auth.data.user.id, name: value.name, type: value.type, amount: value.amount, account_id: account?.id ?? null,
      destination_account_id: destination?.id ?? null, category_id: category?.id ?? null, frequency: value.frequency,
      start_date: value.startDate, next_due_date: value.nextDueDate, end_date: value.endDate ?? null, status: value.status,
      notes: value.notes ?? null, auto_create: value.autoCreate,
    };
    const existing = scheduled.some((item) => item.id === value.id);
    const result = existing ? await supabase.from("scheduled_transactions").update(payload).eq("id", value.id) : await supabase.from("scheduled_transactions").insert(payload);
    if (result.error) { setError(result.error.message); return false; }
    await load(); return true;
  }, [accounts, load, scheduled]);

  const toggleScheduled = useCallback(async (item: ScheduledTransaction) => {
    const status = item.status === "paused" ? "active" : "paused";
    const result = await createClient().from("scheduled_transactions").update({ status }).eq("id", item.id);
    if (result.error) setError(result.error.message); else await load();
  }, [load]);

  const confirmScheduled = useCallback(async (id: string) => {
    const result = await createClient().rpc("confirm_scheduled_transaction", { p_scheduled_id: id });
    if (result.error) { setError(result.error.message); return false; }
    await load(); return true;
  }, [load]);

  return { budgets, goals, liabilities, scheduled, accounts, error, isLoading, saveBudget, saveGoal, saveLiability, saveScheduled, toggleScheduled, confirmScheduled, remove, reload: load };
}

