"use client";

import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, Pencil, Plus, ReceiptText, Trash2 } from "lucide-react";
import { MovementDialog, type MovementFormValue } from "@/components/finance/movement-dialog";
import { useMovements } from "@/hooks/use-movements";
import { cn, formatCurrency } from "@/lib/utils";
import { NivaAlert, NivaButton, NivaEmptyState, NivaIconButton, NivaInput, NivaLayoutSurface, NivaSearch, NivaSection, NivaSelect } from "@/design-system";

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
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const parsedIso = new Date(`${normalized}T00:00:00`);
    return Number.isNaN(parsedIso.getTime()) ? null : parsedIso;
  }

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

function toneTextClass(tone: ReturnType<typeof amountTone>) {
  if (tone === "positive") return "text-[var(--niva-color-success)]";
  if (tone === "negative") return "text-[var(--niva-color-danger)]";
  return "text-[var(--niva-color-info)]";
}

function toneSurfaceClass(tone: ReturnType<typeof amountTone>) {
  if (tone === "positive") return "bg-[var(--niva-color-success-surface)] text-[var(--niva-color-success)]";
  if (tone === "negative") return "bg-[var(--niva-color-danger-surface)] text-[var(--niva-color-danger)]";
  return "bg-[var(--niva-color-info-surface)] text-[var(--niva-color-info)]";
}

function signedAmount(movement: TimelineMovement) {
  const formatted = formatCurrency(Math.abs(movement.amount));
  if (movement.type === "Ingreso") return `+${formatted}`;
  if (movement.type === "Gasto") return `-${formatted}`;
  return formatted;
}

export function MovementsScreen() {
  const [open, setOpen] = useState(false);
  const { accounts, categories, movements, isLoading, error, saveMovement, deleteMovement } = useMovements();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Todos");
  const [accountFilter, setAccountFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const filteredMovements = useMemo(() => {
    return movements.filter((movement) => {
      const query = search.trim().toLowerCase();
      const matchesType = movementMatchesFilter(movement.type, typeFilter);
      const movementDate = movement.occurredOn ?? movement.date;
      const matchesAccount = !accountFilter || movement.accountId === accountFilter || movement.destinationAccountId === accountFilter;
      const matchesCategory = !categoryFilter || movement.categoryId === categoryFilter;
      const matchesDate = (!dateFrom || movementDate >= dateFrom) && (!dateTo || movementDate <= dateTo);
      const matchesSearch =
        !query ||
        [movement.description, movement.account, movement.destinationAccount, movement.category, movement.merchant]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query));
      return matchesType && matchesSearch && matchesAccount && matchesCategory && matchesDate;
    });
  }, [accountFilter, categoryFilter, dateFrom, dateTo, movements, search, typeFilter]);

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

  async function addMovement(movement: MovementFormValue) {
    const editingId = editingIndex !== null ? movements[editingIndex]?.id : undefined;
    const saved = await saveMovement(movement, editingId);
    if (saved) setEditingIndex(null);
    return saved;
  }

  function originalIndex(movement: TimelineMovement) {
    return movements.findIndex((item) => item === movement);
  }

  return (
    <div className="space-y-7 pb-20 md:pb-0">
      <header className="flex flex-col gap-5 border-b border-[var(--niva-color-border)] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-[var(--niva-color-muted)]">Financial timeline</p>
          <h1 className="mt-2 text-4xl font-bold tracking-normal text-[var(--niva-color-foreground)] sm:text-5xl">Activity</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--niva-color-muted)]">A chronological story of income, expenses, and transfers.</p>
        </div>
        <NivaButton type="button" iconLeft={<Plus className="h-4 w-4" />} onClick={openNewMovement} className="w-full sm:w-auto">
          Nuevo registro
        </NivaButton>
      </header>

      <NivaLayoutSurface variant="subtle" className="flex flex-col gap-3 p-2 sm:flex-row sm:items-center sm:justify-between">
        <NivaSearch
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search activity..."
          className="h-10 border-transparent bg-[var(--niva-color-surface)] shadow-none"
        />
        <div className="flex min-w-0 max-w-full gap-1 overflow-x-auto rounded-[var(--niva-radius-md)] bg-[var(--niva-color-surface)] p-1">
          {filters.map((filter) => (
            <NivaButton
              key={filter}
              type="button"
              variant="ghost"
              size="sm"
              aria-pressed={typeFilter === filter}
              onClick={() => setTypeFilter(filter)}
              className={cn(
                "h-9 shrink-0 px-3",
                typeFilter === filter && "bg-[var(--niva-color-inverse-surface)] text-[var(--niva-color-inverse-foreground)] hover:bg-[var(--niva-color-inverse-surface)] hover:text-[var(--niva-color-inverse-foreground)]",
              )}
            >
              {filter}
            </NivaButton>
          ))}
        </div>
      </NivaLayoutSurface>

      <div className="grid gap-3 md:grid-cols-4">
        <NivaSelect label="Cuenta" value={accountFilter} onChange={(event) => setAccountFilter(event.target.value)} options={[{ label: "Todas las cuentas", value: "" }, ...accounts.filter((item) => item.id).map((item) => ({ label: item.name, value: item.id! }))]} />
        <NivaSelect label="Categoria" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} options={[{ label: "Todas las categorias", value: "" }, ...categories.map((item) => ({ label: item.name, value: item.id }))]} />
        <NivaInput label="Desde" type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} />
        <NivaInput label="Hasta" type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} />
      </div>
      {error ? <NivaAlert tone="danger" title={error} /> : null}

      <NivaSection aria-label="Activity timeline">
        {filteredMovements.length === 0 ? (
          <NivaEmptyState
            title={isLoading ? "Cargando actividad" : "Aun no aparece actividad"}
            description={isLoading ? "Estamos consultando tus registros." : "Crea un registro o ajusta los filtros para ver tus movimientos."}
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
                    <h2 className="text-sm font-bold uppercase tracking-normal text-[var(--niva-color-foreground)]">{group.label}</h2>
                    <p className="mt-1 text-xs font-semibold text-[var(--niva-color-placeholder)]">{movementCounter(rows.length)}</p>
                  </div>

                  <ol className="relative space-y-1 pl-7 before:absolute before:bottom-6 before:left-[7px] before:top-4 before:w-px before:bg-[var(--niva-color-border)]">
                    {rows.map((movement) => {
                      const index = originalIndex(movement);
                      const tone = amountTone(movement);
                      return (
                        <li key={`${movement.date}-${movement.description}-${index}`} className="relative pb-7 last:pb-0">
                          <span
                            className={cn(
                              "absolute -left-7 top-2 flex h-4 w-4 items-center justify-center rounded-[var(--niva-radius-full)] bg-[var(--niva-color-surface)] ring-4 ring-[var(--niva-color-background)]",
                              toneTextClass(tone),
                            )}
                            aria-hidden={true}
                          >
                            <span className="h-2.5 w-2.5 rounded-[var(--niva-radius-full)] bg-current" />
                          </span>

                          <article className="group grid gap-3 rounded-[var(--niva-radius-xl)] px-0 py-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                            <div className="min-w-0">
                              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                                <span className={cn("inline-flex h-7 w-7 items-center justify-center rounded-[var(--niva-radius-full)]", toneSurfaceClass(tone))}>
                                  {iconForType(movement.type)}
                                </span>
                                <h3 className="min-w-0 text-lg font-bold leading-7 text-[var(--niva-color-foreground)]">{titleForMovement(movement)}</h3>
                                <span className="text-xs font-semibold uppercase tracking-normal text-[var(--niva-color-placeholder)]">{relativeTime(movement.date)}</span>
                              </div>

                              <p className="mt-2 text-sm leading-6 text-[var(--niva-color-muted)]">{detailForMovement(movement)}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[var(--niva-color-muted)]">
                                <span>{movement.account}</span>
                                {movement.destinationAccount ? <span>to {movement.destinationAccount}</span> : null}
                                <span className="text-[var(--niva-color-placeholder)]">/</span>
                                <span>{movement.category}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                              <p className={cn("text-right text-xl font-bold tabular-nums tracking-normal", tone === "neutral" ? "text-[var(--niva-color-foreground)]" : toneTextClass(tone))}>
                                {signedAmount(movement)}
                              </p>
                              <div className="flex items-center gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                                <NivaIconButton
                                  icon={<Pencil className="h-4 w-4" />}
                                  label="Editar registro"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingIndex(index);
                                    setOpen(true);
                                  }}
                                />
                                <NivaIconButton
                                  icon={<Trash2 className="h-4 w-4" />}
                                  label="Eliminar registro"
                                  variant="ghost"
                                  onClick={() => void deleteMovement(movement.id)}
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
      </NivaSection>

      <MovementDialog
        open={open}
        initialValue={editingIndex !== null ? movements[editingIndex] : null}
        accounts={accounts}
        categories={categories}
        onClose={() => {
          setOpen(false);
          setEditingIndex(null);
        }}
        onSave={addMovement}
      />
    </div>
  );
}
