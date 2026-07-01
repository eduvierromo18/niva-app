"use client";

import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { goals as initialGoals } from "@/lib/finance-data";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { QuickCreateDialog, type QuickCreateValue } from "@/components/finance/quick-create-dialog";
import { GoalProgress } from "@/components/finance/goal-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function GoalsScreen() {
  const [open, setOpen] = useState(false);
  const [goals, setGoals] = useState(initialGoals);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function openNewGoal() {
    setEditingIndex(null);
    setOpen(true);
  }

  function addGoal(value: QuickCreateValue) {
    setGoals((current) => {
      const nextGoal = { name: value.name, current: value.current ?? 0, target: value.amount, date: value.secondary || "Sin fecha" };
      if (editingIndex !== null) {
        return current.map((item, index) => (index === editingIndex ? nextGoal : item));
      }
      return [...current, nextGoal];
    });
    setEditingIndex(null);
  }

  return (
    <PageScaffold
      title="Metas de ahorro"
      description="Planea objetivos, fechas limite y progreso acumulado."
      action={<Button onClick={openNewGoal}>Nueva meta</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-3">
        {goals.map((goal, index) => {
          return (
            <Card key={goal.name}>
              <CardContent>
                <p className="text-sm font-semibold text-slate-500">Objetivo: {goal.date}</p>
                <h3 className="mt-2 text-lg font-bold">{goal.name}</h3>
                <GoalProgress current={goal.current} target={goal.target} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => { setEditingIndex(index); setOpen(true); }}>
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button type="button" variant="ghost" className="h-9 px-3 text-rose-600" onClick={() => setGoals((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <QuickCreateDialog
        open={open}
        title="Nueva meta"
        description="Crea un objetivo de ahorro con monto y fecha."
        amountLabel="Monto objetivo"
        currentLabel="Ahorrado inicial"
        secondaryLabel="Fecha objetivo"
        secondaryPlaceholder="Ej. Dic 2026"
        initialValue={editingIndex !== null ? {
          name: goals[editingIndex].name,
          amount: goals[editingIndex].target,
          current: goals[editingIndex].current,
          secondary: goals[editingIndex].date,
        } : null}
        onClose={() => {
          setOpen(false);
          setEditingIndex(null);
        }}
        onSave={addGoal}
      />
    </PageScaffold>
  );
}
