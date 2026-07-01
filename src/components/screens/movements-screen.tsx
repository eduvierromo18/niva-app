"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Pencil, Plus, ReceiptText, Trash2 } from "lucide-react";
import { MovementDialog, type MovementFormValue } from "@/components/finance/movement-dialog";
import { movements as initialMovements } from "@/lib/finance-data";
import { cn, formatCurrency } from "@/lib/utils";
import {
  AuroraBadge,
  AuroraButton,
  AuroraCard,
  AuroraEmptyState,
  AuroraIconButton,
  AuroraSearch,
  AuroraSection,
  AuroraSurface,
  AuroraTimelineCard,
} from "@/components/aurora";

const filters = ["Todos", "Gastos", "Ingresos", "Transferencias"];
const groupOrder = ["Hoy", "Ayer", "Esta semana", "Este mes"];

function movementMatchesFilter(type: string, filter: string) {
  if (filter === "Todos") return true;
  if (filter === "Gastos") return type === "Gasto";
  if (filter === "Ingresos") return type === "Ingreso";
  return type === "Transferencia";
}

function iconForType(type: string) {
  if (type === "Ingreso") return <ArrowUpRight className="h-5 w-5" />;
  if (type === "Transferencia") return <ArrowRightLeft className="h-5 w-5" />;
  return <ArrowDownLeft className="h-5 w-5" />;
}

function badgeTone(type: string) {
  if (type === "Ingreso") return "success" as const;
  if (type === "Transferencia") return "info" as const;
  return "neutral" as const;
}

function groupForDate(date: string) {
  if (date === "Hoy") return "Hoy";
  if (date === "Ayer") return "Ayer";

  const dayMatch = date.match(/^(\d{1,2})\s+Jun$/);
  if (dayMatch && Number(dayMatch[1]) >= 29) return "Esta semana";
  return "Este mes";
}

function formatDescription(movement: MovementFormValue) {
  if (movement.type === "Transferencia" && movement.destinationAccount) {
    return `${movement.account} a ${movement.destinationAccount}`;
  }
  return `${movement.account} - ${movement.category}`;
}

function amountTone(movement: MovementFormValue) {
  if (movement.type === "Ingreso") return "positive" as const;
  if (movement.type === "Gasto") return "negative" as const;
  return "neutral" as const;
}

export function MovementsScreen() {
  const [open, setOpen] = useState(false);
  const [movements, setMovements] = useState(initialMovements);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const query = search.trim().toLowerCase();
      const matchesType = movementMatchesFilter(movement.type, typeFilter);
      const matchesSearch =
        !query ||
        [movement.description, movement.account, movement.destinationAccount, movement.category, movement.merchant]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesType && matchesSearch;
    });
  }, [movements, search, typeFilter]);

  const groupedMovements = useMemo(() => {
    return filteredMovements.reduce<Record<string, typeof filteredMovements>>((groups, movement) => {
      const group = groupForDate(movement.date);
      groups[group] = [...(groups[group] ?? []), movement];
      return groups;
    }, {});
  }, [filteredMovements]);

  function openNewMovement() {
    setEditingIndex(null);
    setOpen(true);
  }

  function addMovement(movement: MovementFormValue) {
    setMovements((current) => {
      if (editingIndex !== null) {
        return current.map((item, index) => (index === editingIndex ? movement : item));
      }
      return [movement, ...current];
    });
    setEditingIndex(null);
  }

  function originalIndex(movement: MovementFormValue) {
    return movements.findIndex((item) => item === movement);
  }

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      <AuroraCard className="rounded-[20px] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <AuroraBadge tone="info">Actividad</AuroraBadge>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#111827]">Actividad</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-[#6B7280]">Registra y consulta tu actividad diaria.</p>
          </div>
          <AuroraButton type="button" icon={<Plus className="h-4 w-4" />} onClick={openNewMovement} className="w-full sm:w-auto">
            Nuevo registro
          </AuroraButton>
        </div>
      </AuroraCard>

      <AuroraSurface elevated className="overflow-hidden p-4 sm:p-5">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <AuroraSearch value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar registros..." className="bg-[#F9FAFB] shadow-none" />
          <div className="flex min-w-0 max-w-full flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setTypeFilter(filter)}
                className={cn(
                  "h-10 shrink-0 rounded-lg px-4 text-sm font-bold transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2",
                  typeFilter === filter ? "bg-[#2563EB] text-white shadow-[0_4px_12px_rgba(37,99,235,0.26)]" : "bg-white text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </AuroraSurface>

      <AuroraSection title="Actividad reciente">
        {filteredMovements.length === 0 ? (
          <AuroraEmptyState
            title="No hay registros"
            description="Crea un nuevo registro o ajusta los filtros para consultar tu actividad."
            actionLabel="Nuevo registro"
            icon={<ReceiptText className="h-8 w-8" />}
            onAction={openNewMovement}
          />
        ) : (
          <div className="space-y-8">
            {groupOrder.map((group) => {
              const rows = groupedMovements[group] ?? [];
              if (rows.length === 0) return null;

              return (
                <section key={group} className="grid gap-4 lg:grid-cols-[132px_minmax(0,1fr)]">
                  <div className="pt-3">
                    <p className="text-sm font-bold text-[#111827]">{group}</p>
                    <p className="mt-1 text-xs font-semibold text-[#9CA3AF]">{rows.length} {rows.length === 1 ? "registro" : "registros"}</p>
                  </div>
                  <div className="space-y-3">
                    {rows.map((movement) => {
                      const index = originalIndex(movement);
                      return (
                        <AuroraTimelineCard
                          key={`${movement.date}-${movement.description}-${index}`}
                          date={movement.date}
                          title={movement.description}
                          description={formatDescription(movement)}
                          meta={movement.type === "Transferencia" ? "Transferencia entre cuentas" : movement.category}
                          amount={formatCurrency(movement.amount)}
                          amountTone={amountTone(movement)}
                          icon={iconForType(movement.type)}
                          badge={<AuroraBadge tone={badgeTone(movement.type)}>{movement.type}</AuroraBadge>}
                          action={
                            <div className="hidden items-center gap-1 sm:flex">
                              <AuroraIconButton
                                icon={<Pencil className="h-4 w-4" />}
                                label="Editar registro"
                                variant="ghost"
                                onClick={() => {
                                  setEditingIndex(index);
                                  setOpen(true);
                                }}
                              />
                              <AuroraIconButton
                                icon={<Trash2 className="h-4 w-4" />}
                                label="Eliminar registro"
                                variant="ghost"
                                onClick={() => setMovements((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                              />
                            </div>
                          }
                        />
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </AuroraSection>

      <AuroraButton type="button" icon={<Plus className="h-4 w-4" />} onClick={openNewMovement} className="fixed bottom-16 left-4 right-4 z-40 rounded-full px-5 shadow-[0_12px_24px_rgba(37,99,235,0.28)] md:hidden">
        Nuevo registro
      </AuroraButton>

      <MovementDialog
        open={open}
        initialValue={editingIndex !== null ? movements[editingIndex] : null}
        onClose={() => {
          setOpen(false);
          setEditingIndex(null);
        }}
        onSave={addMovement}
      />
    </div>
  );
}
