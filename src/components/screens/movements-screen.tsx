"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Pencil, Plus, ReceiptText, Trash2 } from "lucide-react";
import { MovementDialog, type MovementFormValue } from "@/components/finance/movement-dialog";
import { movements as initialMovements } from "@/lib/finance-data";
import { cn, formatCurrency } from "@/lib/utils";
import { AuroraButton, AuroraEmptyState, AuroraIconButton, AuroraSearch } from "@/components/aurora";

const filters = ["Todos", "Gastos", "Ingresos", "Transferencias"];
const timelineGroups = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "this-week", label: "This Week" },
  { key: "earlier", label: "Earlier" },
] as const;

type TimelineGroupKey = (typeof timelineGroups)[number]["key"];
type TimelineMovement = MovementFormValue & { merchant?: string };

const monthIndex: Record<string, number> = {
  ene: 0,
  feb: 1,
  mar: 2,
  abr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dic: 11,
};

function movementMatchesFilter(type: string, filter: string) {
  if (filter === "Todos") return true;
  if (filter === "Gastos") return type === "Gasto";
  if (filter === "Ingresos") return type === "Ingreso";
  return type === "Transferencia";
}

function iconForType(type: string) {
  if (type === "Ingreso") return <ArrowUpRight className="h-4 w-4" />;
  if (type === "Transferencia") return <ArrowRightLeft className="h-4 w-4" />;
  return <ArrowDownLeft className="h-4 w-4" />;
}

function normalizeToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function parseMovementDate(date: string) {
  const normalized = date.trim().toLowerCase();
  const today = normalizeToday();

  if (normalized === "hoy" || normalized === "today") return today;
  if (normalized === "ayer" || normalized === "yesterday") {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  }

  const dayMonthMatch = normalized.match(/^(\d{1,2})\s+([a-záéíóúñ]{3})/i);
  if (!dayMonthMatch) return null;

  const monthKey = dayMonthMatch[2].normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const month = monthIndex[monthKey];
  if (month === undefined) return null;

  const parsed = new Date(today.getFullYear(), month, Number(dayMonthMatch[1]));
  parsed.setHours(0, 0, 0, 0);
  return parsed;
}

function groupForDate(date: string): TimelineGroupKey {
  const movementDate = parseMovementDate(date);
  if (!movementDate) return "earlier";

  const today = normalizeToday();
  const diffDays = Math.round((today.getTime() - movementDate.getTime()) / 86400000);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays <= 6) return "this-week";
  return "earlier";
}

function relativeTime(date: string) {
  const movementDate = parseMovementDate(date);
  if (!movementDate) return date;

  const today = normalizeToday();
  const diffDays = Math.round((today.getTime() - movementDate.getTime()) / 86400000);
  if (diffDays <= 0) return "today";
  if (diffDays === 1) return "yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 14) return "last week";
  return date;
}

function movementCounter(count: number) {
  return `${count} ${count === 1 ? "event" : "events"}`;
}

function titleForMovement(movement: TimelineMovement) {
  return movement.merchant || movement.description;
}

function detailForMovement(movement: TimelineMovement) {
  if (movement.merchant && movement.merchant !== movement.description) return movement.description;
  if (movement.type === "Transferencia" && movement.destinationAccount) return `${movement.account} to ${movement.destinationAccount}`;
  return movement.category;
}

function amountTone(movement: TimelineMovement) {
  if (movement.type === "Ingreso") return "positive" as const;
  if (movement.type === "Gasto") return "negative" as const;
  return "neutral" as const;
}

function signedAmount(movement: TimelineMovement) {
  const formatted = formatCurrency(Math.abs(movement.amount));
  if (movement.type === "Ingreso") return `+${formatted}`;
  if (movement.type === "Gasto") return `-${formatted}`;
  return formatted;
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
    return filteredMovements.reduce<Record<TimelineGroupKey, typeof filteredMovements>>(
      (groups, movement) => {
        const group = groupForDate(movement.date);
        groups[group] = [...groups[group], movement];
        return groups;
      },
      { today: [], yesterday: [], "this-week": [], earlier: [] },
    );
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

  function originalIndex(movement: TimelineMovement) {
    return movements.findIndex((item) => item === movement);
  }

  return (
    <div className="space-y-7 pb-20 md:pb-0">
      <header className="flex flex-col gap-5 border-b border-[#E5E7EB]/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7280]">Financial timeline</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#111827] sm:text-5xl">Activity</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6B7280]">A chronological story of income, expenses, and transfers.</p>
        </div>
        <AuroraButton type="button" icon={<Plus className="h-4 w-4" />} onClick={openNewMovement} className="w-full sm:w-auto">
          Nuevo registro
        </AuroraButton>
      </header>

      <div className="flex flex-col gap-3 rounded-xl bg-[#F9FAFB] p-2 sm:flex-row sm:items-center sm:justify-between">
        <AuroraSearch
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search activity..."
          className="h-10 border-transparent bg-white shadow-none"
        />
        <div className="flex min-w-0 max-w-full gap-1 overflow-x-auto rounded-lg bg-white p-1">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setTypeFilter(filter)}
              className={cn(
                "h-9 shrink-0 rounded-md px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]",
                typeFilter === filter ? "bg-[#111827] text-white" : "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827]",
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <section aria-label="Activity timeline">
        {filteredMovements.length === 0 ? (
          <AuroraEmptyState
            title="Aun no aparece actividad"
            description="Crea un registro o ajusta los filtros para ver tus movimientos."
            actionLabel="Nuevo registro"
            icon={<ReceiptText className="h-8 w-8" />}
            onAction={openNewMovement}
          />
        ) : (
          <div className="space-y-10">
            {timelineGroups.map((group) => {
              const rows = groupedMovements[group.key];
              if (rows.length === 0) return null;

              return (
                <section key={group.key} className="grid gap-5 lg:grid-cols-[9rem_minmax(0,1fr)]">
                  <div className="lg:sticky lg:top-6 lg:self-start">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-[#111827]">{group.label}</h2>
                    <p className="mt-1 text-xs font-semibold text-[#9CA3AF]">{movementCounter(rows.length)}</p>
                  </div>

                  <ol className="relative space-y-1 pl-7 before:absolute before:bottom-6 before:left-[7px] before:top-4 before:w-px before:bg-[#E5E7EB]">
                    {rows.map((movement) => {
                      const index = originalIndex(movement);
                      const tone = amountTone(movement);
                      return (
                        <li key={`${movement.date}-${movement.description}-${index}`} className="relative pb-7 last:pb-0">
                          <span
                            className={cn(
                              "absolute -left-7 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-[#F8FAFC]",
                              tone === "positive" && "text-[#047857]",
                              tone === "negative" && "text-[#DC2626]",
                              tone === "neutral" && "text-[#2563EB]",
                            )}
                            aria-hidden="true"
                          >
                            <span className="h-2.5 w-2.5 rounded-full bg-current" />
                          </span>

                          <article className="group grid gap-3 rounded-xl px-0 py-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                            <div className="min-w-0">
                              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                                <span
                                  className={cn(
                                    "inline-flex h-7 w-7 items-center justify-center rounded-full",
                                    tone === "positive" && "bg-[#ECFDF5] text-[#047857]",
                                    tone === "negative" && "bg-[#FEF2F2] text-[#DC2626]",
                                    tone === "neutral" && "bg-[#EFF6FF] text-[#2563EB]",
                                  )}
                                >
                                  {iconForType(movement.type)}
                                </span>
                                <h3 className="min-w-0 text-lg font-bold leading-7 text-[#111827]">{titleForMovement(movement)}</h3>
                                <span className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">{relativeTime(movement.date)}</span>
                              </div>

                              <p className="mt-2 text-sm leading-6 text-[#4B5563]">{detailForMovement(movement)}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#6B7280]">
                                <span>{movement.account}</span>
                                {movement.destinationAccount ? <span>to {movement.destinationAccount}</span> : null}
                                <span className="text-[#D1D5DB]">/</span>
                                <span>{movement.category}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                              <p
                                className={cn(
                                  "text-right text-xl font-bold tabular-nums tracking-normal",
                                  tone === "positive" && "text-[#047857]",
                                  tone === "negative" && "text-[#DC2626]",
                                  tone === "neutral" && "text-[#111827]",
                                )}
                              >
                                {signedAmount(movement)}
                              </p>
                              <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
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
                            </div>
                          </article>
                        </li>
                      );
                    })}
                  </ol>
                </section>
              );
            })}
          </div>
        )}
      </section>

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
