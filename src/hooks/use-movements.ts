"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { mapAccount, mapMovement } from "@/lib/finance-mappers";
import type { FinanceAccount, FinanceMovement } from "@/lib/finance-types";
import type { MovementFormValue } from "@/components/finance/movement-dialog";
import type { Tables, TablesInsert } from "@/types/database";

export type FinanceCategory = Pick<Tables<"categories">, "id" | "name" | "type" | "color">;

const defaultCategories = [
  { name: "Nómina", type: "income" as const, color: "#16a34a", sort_order: 10 },
  { name: "Otros ingresos", type: "income" as const, color: "#0d9488", sort_order: 20 },
  { name: "Comida", type: "expense" as const, color: "#16a34a", sort_order: 10 },
  { name: "Vivienda", type: "expense" as const, color: "#2563eb", sort_order: 20 },
  { name: "Transporte", type: "expense" as const, color: "#ef4444", sort_order: 30 },
  { name: "Servicios", type: "expense" as const, color: "#8b5cf6", sort_order: 40 },
  { name: "Compras", type: "expense" as const, color: "#f59e0b", sort_order: 50 },
  { name: "Entretenimiento", type: "expense" as const, color: "#db2777", sort_order: 60 },
  { name: "Salud", type: "expense" as const, color: "#0891b2", sort_order: 70 },
];

function normalizeDate(value: string) {
  if (!value || value.toLowerCase() === "hoy") return new Date().toISOString().slice(0, 10);
  return value;
}

export function useMovements() {
  const [accounts, setAccounts] = useState<FinanceAccount[]>([]);
  const [categories, setCategories] = useState<FinanceCategory[]>([]);
  const [movements, setMovements] = useState<FinanceMovement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      setError("Tu sesión ya no es válida.");
      setIsLoading(false);
      return;
    }

    let categoryResult = await supabase.from("categories").select("id,name,type,color").eq("is_archived", false).order("sort_order");
    if (!categoryResult.error && (categoryResult.data?.length ?? 0) === 0) {
      const seeded = await supabase.from("categories").insert(defaultCategories.map((item) => ({ ...item, user_id: user.id })));
      if (!seeded.error) categoryResult = await supabase.from("categories").select("id,name,type,color").eq("is_archived", false).order("sort_order");
    }

    const [accountResult, movementResult] = await Promise.all([
      supabase.from("account_balances").select("*").eq("is_archived", false).order("created_at"),
      supabase.from("movements").select("*").order("occurred_on", { ascending: false }).order("created_at", { ascending: false }),
    ]);

    const queryError = categoryResult.error ?? accountResult.error ?? movementResult.error;
    if (queryError) setError(queryError.message);
    else {
      const nextAccounts = (accountResult.data ?? []).map(mapAccount);
      const nextCategories = categoryResult.data ?? [];
      setAccounts(nextAccounts);
      setCategories(nextCategories);
      setMovements((movementResult.data ?? []).map((item) => mapMovement(item, nextAccounts, nextCategories)));
      setError(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const saveMovement = useCallback(async (value: MovementFormValue, editingId?: string) => {
    const supabase = createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) { setError("Tu sesión ya no es válida."); return false; }
    const type: TablesInsert<"movements">["type"] = value.type === "Ingreso" ? "income" : value.type === "Gasto" ? "expense" : "transfer";
    const account = accounts.find((item) => item.id === value.accountId || item.name === value.account);
    const destination = accounts.find((item) => item.id === value.destinationAccountId || item.name === value.destinationAccount);
    const category = categories.find((item) => item.id === value.categoryId || (item.name === value.category && item.type === type));
    if (!account?.id) { setError("Selecciona una cuenta valida."); return false; }
    if (type === "transfer" && !destination?.id) { setError("Selecciona una cuenta destino valida."); return false; }

    if (value.msiInstallments && !editingId) {
      const { error: rpcError } = await supabase.rpc("create_msi_expense", {
        p_account_id: account.id,
        p_category_id: category?.id ?? null,
        p_amount: Math.abs(value.amount),
        p_occurred_on: normalizeDate(value.date),
        p_description: value.description,
        p_installments: value.msiInstallments,
        p_notes: null,
      });
      if (rpcError) { setError("No se pudo registrar el MSI: verifica el monto y el plazo elegido."); return false; }
      await load();
      return true;
    }

    const payload: TablesInsert<"movements"> = {
      user_id: user.id,
      type,
      amount: Math.abs(value.amount),
      occurred_on: normalizeDate(value.date),
      description: value.description,
      merchant: value.merchant ?? null,
      account_id: type === "transfer" ? null : account.id,
      from_account_id: type === "transfer" ? account.id : null,
      to_account_id: type === "transfer" ? destination?.id ?? null : null,
      category_id: type === "transfer" ? null : category?.id ?? null,
    };
    const mutation = editingId
      ? supabase.from("movements").update(payload).eq("id", editingId)
      : supabase.from("movements").insert(payload);
    const { error: mutationError } = await mutation;
    if (mutationError) { setError(mutationError.message); return false; }
    await load();
    return true;
  }, [accounts, categories, load]);

  const deleteMovement = useCallback(async (id?: string) => {
    if (!id) return false;
    const supabase = createClient();
    const { error: mutationError } = await supabase.from("movements").delete().eq("id", id);
    if (mutationError) { setError(mutationError.message); return false; }
    setMovements((current) => current.filter((item) => item.id !== id));
    return true;
  }, []);

  return { accounts, categories, movements, isLoading, error, reload: load, saveMovement, deleteMovement };
}


