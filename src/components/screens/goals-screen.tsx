"use client";

import { useState } from "react";
import { Edit3, Target, Trash2 } from "lucide-react";
import { usePlanningData } from "@/hooks/use-planning-data";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { QuickCreateDialog, type QuickCreateValue } from "@/components/finance/quick-create-dialog";
import { GoalProgress } from "@/components/finance/goal-progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NivaEmptyState } from "@/design-system";

export function GoalsScreen() {
  const [open, setOpen] = useState(false);
  const { goals, error, isLoading, saveGoal, remove } = usePlanningData();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function openNewGoal() {
    setEditingIndex(null);
    setOpen(true);
  }

  async function addGoal(value: QuickCreateValue) {
    const saved = await saveGoal(value, editingIndex !== null ? goals[editingIndex] : undefined);
    if (saved) setEditingIndex(null);
    return saved;
  }

  return (
    <PageScaffold
      title="Metas de ahorro"
      description="Planea objetivos, fechas limite y progreso acumulado."
      action={<Button onClick={openNewGoal}>Nueva meta</Button>}
    >
      {error ? <div className="mb-4 rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-4 text-sm text-[var(--niva-color-danger)]">{error}</div> : null}
      {isLoading ? <p className="text-sm text-[var(--niva-color-muted)]">Cargando metas...</p> : null}
      {!isLoading && goals.length === 0 ? (
        <NivaEmptyState
          title="Aún no tienes metas"
          description="Define un objetivo de ahorro y avanza a tu ritmo, sin presión."
          actionLabel="Crear primera meta"
          icon={<Target className="h-8 w-8" />}
          onAction={openNewGoal}
        />
      ) : (
      <div className="grid gap-4 xl:grid-cols-3">
        {goals.map((goal, index) => {
          return (
            <Card key={goal.id}>
              <CardContent>
                <p className="text-sm font-semibold text-[var(--niva-color-muted)]">Objetivo: {goal.date}</p>
                <h3 className="mt-2 text-lg font-bold">{goal.name}</h3>
                <GoalProgress current={goal.current} target={goal.target} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => { setEditingIndex(index); setOpen(true); }}>
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </Button>
                  <Button type="button" variant="ghost" className="h-9 px-3 text-[var(--niva-color-danger)]" onClick={() => void remove("savings_goals", goal.id)}>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}
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
