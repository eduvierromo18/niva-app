"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { usePlanningData } from "@/hooks/use-planning-data";
import { formatCurrency } from "@/lib/utils";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NivaEmptyState } from "@/design-system";

export function LiabilitiesScreen() {
  const { liabilities, error, isLoading } = usePlanningData();

  return (
    <PageScaffold
      title="Deudas / tarjetas"
      description="Controla tarjetas, prestamos, fechas de corte y pago. Las tarjetas se administran desde Cuentas."
      action={
        <Link href="/accounts" className="text-sm font-semibold text-[var(--niva-color-info)] hover:text-[var(--niva-color-accent-hover)]">
          Ir a Cuentas
        </Link>
      }
    >
      {error ? <div className="mb-4 rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-4 text-sm text-[var(--niva-color-danger)]">{error}</div> : null}
      {isLoading ? <p className="text-sm text-[var(--niva-color-muted)]">Cargando deudas...</p> : null}
      {!isLoading && liabilities.length === 0 ? (
        <NivaEmptyState
          title="Sin deudas registradas"
          description="Agrega una cuenta tipo Tarjeta para verla aquí con su saldo y fechas de corte y pago."
          icon={<CreditCard className="h-8 w-8" />}
        />
      ) : (
      <div className="grid gap-4 xl:grid-cols-2">
        {liabilities.map((item) => {
          const percent = item.limit > 0 ? (item.balance / item.limit) * 100 : 0;
          return (
            <Card key={item.id}>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[var(--niva-radius-lg)] bg-[var(--niva-color-muted-surface)] text-[var(--niva-color-info)]">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">{item.name}</h3>
                    <p className="mt-2 text-2xl font-bold">{formatCurrency(item.balance)}</p>
                    <Progress value={percent} className="mt-4" />
                    <div className="mt-4 grid gap-2 text-sm text-[var(--niva-color-muted)] sm:grid-cols-2">
                      <p>Corte: <span className="font-semibold text-[var(--niva-color-body)]">{item.closing}</span></p>
                      <p>Pago: <span className="font-semibold text-[var(--niva-color-body)]">{item.due}</span></p>
                      <p>Uso: <span className="font-semibold text-[var(--niva-color-body)]">{percent.toFixed(1)}%</span></p>
                      <p>Limite: <span className="font-semibold text-[var(--niva-color-body)]">{formatCurrency(item.limit)}</span></p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}
    </PageScaffold>
  );
}
