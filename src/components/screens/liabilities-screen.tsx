"use client";

import { useState } from "react";
import { Edit3, Trash2 } from "lucide-react";
import { liabilities as initialLiabilities } from "@/lib/finance-data";
import { formatCurrency } from "@/lib/utils";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { QuickCreateDialog, type QuickCreateValue } from "@/components/finance/quick-create-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function LiabilitiesScreen() {
  const [open, setOpen] = useState(false);
  const [liabilities, setLiabilities] = useState(initialLiabilities);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function openNewLiability() {
    setEditingIndex(null);
    setOpen(true);
  }

  function addLiability(value: QuickCreateValue) {
    setLiabilities((current) => {
      const nextLiability = {
        name: value.name,
        balance: value.amount,
        limit: value.extraAmount || value.amount,
        closing: value.secondary || "Pendiente",
        due: value.extra || "Pendiente",
        icon: initialLiabilities[0].icon,
      };

      if (editingIndex !== null) {
        return current.map((item, index) => (index === editingIndex ? { ...item, ...nextLiability } : item));
      }
      return [...current, nextLiability];
    });
    setEditingIndex(null);
  }

  return (
    <PageScaffold
      title="Deudas / tarjetas"
      description="Controla tarjetas, prestamos, fechas de corte y pago."
      action={<Button onClick={openNewLiability}>Nueva deuda</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-2">
        {liabilities.map((item, index) => {
          const percent = item.limit > 0 ? (item.balance / item.limit) * 100 : 0;
          return (
            <Card key={item.name}>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="mt-2 text-2xl font-bold">{formatCurrency(item.balance)}</p>
                    <Progress value={percent} className="mt-4" />
                    <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                      <p>Corte: <span className="font-semibold text-slate-800 dark:text-zinc-200">{item.closing}</span></p>
                      <p>Pago: <span className="font-semibold text-slate-800 dark:text-zinc-200">{item.due}</span></p>
                      <p>Uso: <span className="font-semibold text-slate-800 dark:text-zinc-200">{percent.toFixed(1)}%</span></p>
                      <p>Limite: <span className="font-semibold text-slate-800 dark:text-zinc-200">{formatCurrency(item.limit)}</span></p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => { setEditingIndex(index); setOpen(true); }}>
                        <Edit3 className="h-4 w-4" />
                        Editar
                      </Button>
                      <Button type="button" variant="ghost" className="h-9 px-3 text-rose-600" onClick={() => setLiabilities((current) => current.filter((_, itemIndex) => itemIndex !== index))}>
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
        title="Nueva deuda o tarjeta"
        description="Registra una deuda manual con saldo y fecha de corte."
        amountLabel="Saldo actual"
        secondaryLabel="Fecha de corte"
        secondaryPlaceholder="Ej. 18 de cada mes"
        extraLabel="Fecha limite de pago"
        extraPlaceholder="Ej. 04 de cada mes"
        extraAmountLabel="Limite o monto original"
        initialValue={editingIndex !== null ? {
          name: liabilities[editingIndex].name,
          amount: liabilities[editingIndex].balance,
          secondary: liabilities[editingIndex].closing,
          extra: liabilities[editingIndex].due,
          extraAmount: liabilities[editingIndex].limit,
        } : null}
        onClose={() => {
          setOpen(false);
          setEditingIndex(null);
        }}
        onSave={addLiability}
      />
    </PageScaffold>
  );
}
