"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CreditCard } from "lucide-react";
import { usePlanningData, type LiabilityItem } from "@/hooks/use-planning-data";
import { useLiabilityStatement } from "@/hooks/use-liability-statement";
import { getStatementPeriodForLiability } from "@/lib/liabilities";
import { cn, formatCurrency } from "@/lib/utils";
import { PageScaffold } from "@/components/finance/page-scaffold";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { NivaButton, NivaEmptyState } from "@/design-system";
import { PayLiabilityDialog } from "@/components/finance/pay-liability-dialog";
import type { FinanceMovement } from "@/lib/finance-types";

function formatStatementDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("es-MX", { day: "numeric", month: "short", timeZone: "UTC" });
}

function StatementMovementRow({ movement }: { movement: FinanceMovement }) {
  const positive = movement.type === "Ingreso";
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm">
      <div className="min-w-0">
        <p className="truncate font-semibold text-[var(--niva-color-body)]">{movement.description}</p>
        <p className="text-xs text-[var(--niva-color-muted)]">{formatStatementDate(movement.occurredOn ?? movement.date)} · {movement.category}</p>
      </div>
      <p className={cn("shrink-0 font-semibold tabular-nums", positive && "text-[var(--niva-color-success)]")}>
        {positive ? "+" : movement.type === "Gasto" ? "−" : ""}{formatCurrency(Math.abs(movement.amount))}
      </p>
    </div>
  );
}

export function LiabilitiesScreen() {
  const { liabilities, accounts, payLiability, error, isLoading } = usePlanningData();
  const [payingLiability, setPayingLiability] = useState<LiabilityItem | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const statement = useLiabilityStatement();

  function toggleStatement(item: LiabilityItem) {
    if (expandedId === item.id) { setExpandedId(null); return; }
    setExpandedId(item.id);
    if (item.accountId) {
      const { period } = getStatementPeriodForLiability(item.closingDay);
      void statement.load(item.accountId, period, accounts);
    }
  }

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
                    {item.accountId ? (
                      <div className="mt-4 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => toggleStatement(item)}
                          className="flex items-center gap-1 text-sm font-semibold text-[var(--niva-color-info)] hover:text-[var(--niva-color-accent-hover)]"
                        >
                          Ver movimientos
                          <ChevronDown className={cn("h-4 w-4 transition-transform", expandedId === item.id && "rotate-180")} />
                        </button>
                        <NivaButton type="button" size="sm" onClick={() => setPayingLiability(item)}>Pagar</NivaButton>
                      </div>
                    ) : null}
                    {item.accountId && expandedId === item.id ? (
                      <div className="mt-4 border-t border-[var(--niva-color-border)] pt-4">
                        {(() => {
                          const { isFallback } = getStatementPeriodForLiability(item.closingDay);
                          return isFallback ? (
                            <p className="mb-3 text-xs text-[var(--niva-color-muted)]">
                              Agrega el día de corte en Cuentas para agrupar por periodo de facturación. Por ahora se muestra el mes en curso.
                            </p>
                          ) : null;
                        })()}
                        {statement.isLoading ? <p className="text-sm text-[var(--niva-color-muted)]">Cargando movimientos...</p> : null}
                        {statement.error ? <p className="text-sm text-[var(--niva-color-danger)]">{statement.error}</p> : null}
                        {!statement.isLoading && !statement.error && statement.items.length === 0 ? (
                          <p className="text-sm text-[var(--niva-color-muted)]">Sin movimientos en este periodo.</p>
                        ) : null}
                        {!statement.isLoading ? (
                          <div className="divide-y divide-[var(--niva-color-border)]">
                            {statement.items.map((movement) => (
                              <StatementMovementRow key={movement.id} movement={movement} />
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      )}
      <PayLiabilityDialog
        open={payingLiability !== null}
        liability={payingLiability}
        accounts={accounts}
        onClose={() => setPayingLiability(null)}
        onSave={async (value) => {
          if (!payingLiability) return false;
          const saved = await payLiability(payingLiability, value);
          if (saved) setPayingLiability(null);
          return saved;
        }}
      />
    </PageScaffold>
  );
}
