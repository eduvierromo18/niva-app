"use client";

import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { usePlanningData } from "@/hooks/use-planning-data";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { QuickCreateDialog, type QuickCreateValue } from "@/components/finance/quick-create-dialog";
import { BudgetProgress } from "@/components/finance/budget-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BudgetsScreen() {
  const [open, setOpen] = useState(false);
  const { budgets, error, isLoading, saveBudget, remove } = usePlanningData();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function openNewBudget() {
    setEditingIndex(null);
    setOpen(true);
  }

  async function addBudget(value: QuickCreateValue) {
    const saved = await saveBudget(value, editingIndex !== null ? budgets[editingIndex] : undefined);
    if (saved) setEditingIndex(null);
    return saved;
  }

  return (
    <PageScaffold
      title="Presupuestos mensuales"
      description="Controla limites por categoria y gasto real del mes."
      action={<Button onClick={openNewBudget}>Nuevo presupuesto</Button>}
    >
      {error ? <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{error}</div> : null}
      {isLoading ? <p className="text-sm text-slate-500">Cargando presupuestos...</p> : null}
      <div className="grid gap-4 xl:grid-cols-2">
        {budgets.map((budget, index) => {
          return (
            <Card key={budget.id}>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <budget.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <BudgetProgress
                      name={budget.name}
                      spent={budget.spent}
                      limit={budget.limit}
                      className="space-y-0"
                      headerClassName="gap-0 text-base"
                      nameClassName="font-bold text-inherit dark:text-inherit"
                      percentClassName="text-sm font-semibold text-slate-500 dark:text-slate-500"
                      progressClassName="mt-3"
                      summaryClassName="mt-3 text-sm text-slate-500 dark:text-slate-500"
                      labelElement="h3"
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => { setEditingIndex(index); setOpen(true); }}>
                        <Edit3 className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button type="button" variant="ghost" className="h-9 px-3 text-rose-600" onClick={() => void remove("monthly_budgets", budget.id)}>
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <QuickCreateDialog
        open={open}
        title="Nuevo presupuesto"
        description="Define un limite mensual para una categoria."
        amountLabel="Limite mensual"
        currentLabel="Gastado inicial"
        secondaryLabel="Mes"
        secondaryPlaceholder="Ej. Junio 2026"
        initialValue={editingIndex !== null ? {
          name: budgets[editingIndex].name,
          amount: budgets[editingIndex].limit,
          current: budgets[editingIndex].spent,
          secondary: "",
        } : null}
        onClose={() => {
          setOpen(false);
          setEditingIndex(null);
        }}
        onSave={addBudget}
      />
    </PageScaffold>
  );
}


