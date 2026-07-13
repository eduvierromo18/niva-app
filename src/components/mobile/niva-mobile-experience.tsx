"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type FormEvent, type ReactNode, useRef, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  ChevronRight,
  Eye,
  Flag,
  Home,
  Landmark,
  LogOut,
  MoreHorizontal,
  Moon,
  Pause,
  Pencil,
  PiggyBank,
  Play,
  Plus,
  ReceiptText,
  RefreshCw,
  Repeat2,
  Settings,
  Sun,
  Target,
  Trash2,
  WalletCards,
  X,
} from "lucide-react";
import { MovementDialog, type MovementFormValue } from "@/components/finance/movement-dialog";
import { AccountDialog, type AccountFormValue } from "@/components/finance/account-dialog";
import { QuickCreateDialog, type QuickCreateValue } from "@/components/finance/quick-create-dialog";
import { ScheduledTransactionDialog } from "@/components/finance/ScheduledTransactionDialog";
import { useAccounts } from "@/hooks/use-accounts";
import { useMovements } from "@/hooks/use-movements";
import { usePlanningData } from "@/hooks/use-planning-data";
import { getFeaturedGoalProgress } from "@/lib/dashboard";
import { categoryData, metrics } from "@/lib/finance-data";
import { getSpendableSummary } from "@/lib/dashboard";
import type { FinanceMovement, ScheduledTransaction } from "@/lib/finance-types";
import { cn, formatCurrency } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { signOut } from "@/app/(app)/actions";

type NivaMobileExperienceProps = {
  user: { id: string; name: string; email: string; currencyCode: string; locale: string };
};

const mobileRoutes = new Set(["/dashboard", "/movements", "/categories", "/accounts", "/goals", "/programados", "/budgets", "/liabilities", "/settings"]);

export function isNivaMobileRoute(pathname: string) {
  return mobileRoutes.has(pathname);
}

export function NivaMobileExperience({ user }: NivaMobileExperienceProps) {
  const firstName = user.name.trim().split(/\s+/)[0] || "Usuario";
  const pathname = usePathname();
  const [locked, setLocked] = useState(true);
  const [darkHome, setDarkHome] = useState(false);
  const [movementOpen, setMovementOpen] = useState(false);
  const [movementType, setMovementType] = useState("Gasto");
  const [editingMovement, setEditingMovement] = useState<FinanceMovement | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scheduledOpen, setScheduledOpen] = useState(false);
  const [editingScheduled, setEditingScheduled] = useState<ScheduledTransaction | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [editingAccountIndex, setEditingAccountIndex] = useState<number | null>(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ReturnType<typeof usePlanningData>["goals"][number] | null>(null);
  const movementsData = useMovements();
  const accountsData = useAccounts();
  const planningData = usePlanningData();

  async function saveMovement(value: MovementFormValue) {
    const saved = await movementsData.saveMovement(value, editingMovement?.id);
    if (saved) {
      await Promise.all([accountsData.reload(), planningData.reload()]);
      setEditingMovement(null);
    }
    return saved;
  }

  function openMovement(type: string, movement?: FinanceMovement) {
    setCreateOpen(false);
    setMovementType(type);
    setEditingMovement(movement ?? null);
    setMovementOpen(true);
  }

  function openScheduled(item?: ScheduledTransaction) {
    setCreateOpen(false);
    setEditingScheduled(item ?? null);
    setScheduledOpen(true);
  }

  async function saveAccount(value: AccountFormValue) {
    const saved = await accountsData.saveAccount(value, editingAccountIndex);
    if (saved) await movementsData.reload();
    return saved;
  }

  async function saveGoal(value: QuickCreateValue) {
    return planningData.saveGoal(value, editingGoal ?? undefined);
  }

  if (locked) return <MobileSessionLock onUnlock={() => setLocked(false)} />;

  return (
    <div className={cn("min-h-[100dvh] overflow-x-hidden pb-[calc(6.25rem+env(safe-area-inset-bottom))] niva-mobile-ios", pathname === "/dashboard" && darkHome ? "bg-[#0F1726] text-[#FCFCFD]" : "bg-[#F7F8FA] text-[var(--niva-color-foreground)]")}>
      {pathname === "/dashboard" ? <MobileHome firstName={firstName} dark={darkHome} onToggleAppearance={() => setDarkHome((current) => !current)} accounts={movementsData.accounts} movements={movementsData.movements} scheduled={planningData.scheduled} goals={planningData.goals} loading={movementsData.isLoading || planningData.isLoading} error={movementsData.error || planningData.error} onRetry={() => { void movementsData.reload(); void planningData.reload(); }} onAddExpense={() => openMovement("Gasto")} /> : null}
      {pathname === "/movements" ? <MobileActivity movements={movementsData.movements} loading={movementsData.isLoading} error={movementsData.error} onReload={movementsData.reload} onDelete={movementsData.deleteMovement} onCreate={() => openMovement("Gasto")} onEdit={(item) => openMovement(item.type, item)} /> : null}
      {pathname === "/categories" ? <MobileAnalytics movements={movementsData.movements} /> : null}
      {pathname === "/accounts" ? <MobileAccounts accounts={accountsData.accounts} distribution={accountsData.moneyDistribution} groups={accountsData.institutionGroups} total={accountsData.totals.totalMoney} reviewCount={accountsData.totals.lowBalanceCount} loading={accountsData.isLoading} error={accountsData.error} onReload={accountsData.reload} onCreate={() => { setEditingAccountIndex(null); setAccountOpen(true); }} onEdit={(index) => { setEditingAccountIndex(index); setAccountOpen(true); }} onArchive={accountsData.deleteAccount} /> : null}
      {pathname === "/goals" ? <MobileGoals goals={planningData.goals} loading={planningData.isLoading} onCreate={() => { setEditingGoal(null); setGoalOpen(true); }} onEdit={(goal) => { setEditingGoal(goal); setGoalOpen(true); }} onDelete={(id) => planningData.remove("savings_goals", id)} /> : null}
      {pathname === "/programados" ? <MobileScheduled items={planningData.scheduled} loading={planningData.isLoading} error={planningData.error} onReload={planningData.reload} onCreate={() => openScheduled()} onEdit={openScheduled} onToggle={planningData.toggleScheduled} onConfirm={async (id) => { const saved = await planningData.confirmScheduled(id); if (saved) await Promise.all([movementsData.reload(), accountsData.reload()]); return saved; }} onDelete={(id) => planningData.remove("scheduled_transactions", id)} /> : null}
      {pathname === "/budgets" ? <MobileBudgets items={planningData.budgets} categories={planningData.expenseCategories} loading={planningData.isLoading} onSave={planningData.saveBudget} onDelete={(id) => planningData.remove("monthly_budgets", id)} /> : null}
      {pathname === "/liabilities" ? <MobileLiabilities items={planningData.liabilities} loading={planningData.isLoading} onSave={planningData.saveLiability} onDelete={(id) => planningData.remove("liabilities", id)} /> : null}
      {pathname === "/settings" ? <MobileSettings user={user} /> : null}

      <MobileTabBar pathname={pathname} onCreate={() => setCreateOpen(true)} onMore={() => setMoreOpen(true)} />
      {moreOpen ? <MoreSheet onClose={() => setMoreOpen(false)} /> : null}
      {createOpen ? <CreateActionSheet onClose={() => setCreateOpen(false)} onMovement={openMovement} onScheduled={() => openScheduled()} onAccount={() => { setCreateOpen(false); setEditingAccountIndex(null); setAccountOpen(true); }} /> : null}
      <MovementDialog open={movementOpen} initialValue={editingMovement ?? undefined} defaultType={movementType} accounts={movementsData.accounts} categories={movementsData.categories} onClose={() => { setMovementOpen(false); setEditingMovement(null); }} onSave={saveMovement} />
      <ScheduledTransactionDialog open={scheduledOpen} initialValue={editingScheduled} accounts={planningData.accounts} onClose={() => { setScheduledOpen(false); setEditingScheduled(null); }} onSave={planningData.saveScheduled} />
      <AccountDialog open={accountOpen} initialValue={editingAccountIndex === null ? null : accountsData.accounts[editingAccountIndex]} onClose={() => { setAccountOpen(false); setEditingAccountIndex(null); }} onSave={saveAccount} />
      <QuickCreateDialog open={goalOpen} title={editingGoal ? "Editar objetivo" : "Nuevo objetivo"} description="Define una cantidad y una fecha para tu meta." amountLabel="Meta" currentLabel="Ahorrado" secondaryLabel="Fecha objetivo" secondaryPlaceholder="AAAA-MM-DD" initialValue={editingGoal ? { name: editingGoal.name, amount: editingGoal.target, current: editingGoal.current, secondary: editingGoal.date === "Sin fecha" ? "" : editingGoal.date } : null} onClose={() => { setGoalOpen(false); setEditingGoal(null); }} onSave={saveGoal} />
    </div>
  );
}
function MobileSessionLock({ onUnlock }: { onUnlock: () => void }) {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-[#0F1726] px-8 text-center text-[#FCFCFD]">
      <div>
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#1C2638] text-sm font-bold">N</div>
        <h1 className="mt-6 text-2xl font-medium">Niva</h1>
        <p className="mt-1 text-sm text-[#A8B1C2]">Tu dinero, con calma.</p>
        <button
          type="button"
          onClick={onUnlock}
          className="mt-11 inline-flex flex-col items-center gap-4 rounded-3xl px-5 py-4 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E8AD6]"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#3A465A] bg-[#1C2638]">
            <Eye className="h-7 w-7" />
          </span>
          <span className="text-sm">Toca para desbloquear</span>
          <span className="text-xs font-normal text-[#A8B1C2]">Bloqueo visual de sesión</span>
        </button>
      </div>
    </main>
  );
}

type MobileHomeProps = {
  firstName: string;
  dark: boolean;
  onToggleAppearance: () => void;
  accounts: ReturnType<typeof useMovements>["accounts"];
  movements: FinanceMovement[];
  scheduled: ReturnType<typeof usePlanningData>["scheduled"];
  goals: ReturnType<typeof usePlanningData>["goals"];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onAddExpense: () => void;
};

function MobileHome({
  firstName,
  dark,
  onToggleAppearance,
  accounts,
  movements,
  scheduled,
  goals,
  loading,
  error,
  onRetry,
  onAddExpense,
}: MobileHomeProps) {
  const total = accounts.reduce((sum, account) => sum + account.balance, 0);
  const { reserved, spendable: available, spendableRatio: margin } = getSpendableSummary(accounts);
  const nextScheduled = scheduled.filter((item) => item.status === "active").sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate))[0];
  const upcomingTotal = scheduled.filter((item) => item.status === "active" && item.type !== "income").reduce((sum, item) => sum + item.amount, 0);
  const goal = goals[0];
  const surface = dark ? "border-[#273248] bg-[#151F30]" : "border-[#E0E3E8] bg-white";
  const muted = dark ? "text-[#A8B1C2]" : "text-[#8B95A7]";

  return (
    <main className="mx-auto w-full max-w-md px-5 pb-3 pt-[calc(1.1rem+env(safe-area-inset-top))]">
      <header className="flex items-start justify-between">
        <div>
          <h1 className="text-[2rem] font-light tracking-[-0.04em]">Hola, {firstName}</h1>
          <p className={cn("mt-1 text-sm", muted)}>
            {new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long" }).format(new Date())}
          </p>
        </div>
        <button
          type="button"
          aria-label="Cambiar apariencia"
          onClick={onToggleAppearance}
          className={cn("flex h-10 w-10 items-center justify-center rounded-full border", surface)}
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
      </header>

      <button type="button" onClick={onAddExpense} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1E7A4E] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(30,122,78,0.2)]"><Plus className="h-4 w-4" />Añadir gasto</button>

      {loading ? <MobileSkeleton /> : null}
      {error ? <MobileError message="No pudimos sincronizar tu resumen." onRetry={onRetry} /> : null}
      {!loading && !error ? (
        <div className="mt-5 space-y-5">
          <section className="overflow-hidden rounded-3xl bg-[#0F1726] p-6 text-[#FCFCFD] shadow-[0_16px_34px_rgba(16,24,40,0.14)]">
            <div className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#A8B1C2]">
              <span>Resumen diario</span>
              <span className="rounded bg-[#153B31] px-2 py-1 text-[#82C7A8]">Hoy</span>
            </div>
            <p className="mt-4 text-base font-semibold leading-6">
              Hay <span className="text-[#82C7A8]">{formatCurrency(available)}</span> libres para decidir y {formatCurrency(reserved)} protegidos fuera del ruido diario.
            </p>
            <p className="mt-2 line-clamp-2 text-sm leading-5 text-[#A8B1C2]">
              En los próximos días aparecen {formatCurrency(upcomingTotal)} programados; tu reserva sigue separada.
            </p>
            <Link href="/programados" className="mt-4 inline-flex text-sm font-semibold text-[#82C7A8]">Leer más</Link>
          </section>

          <section className={cn("rounded-3xl border p-6 shadow-[var(--niva-shadow-sm)]", surface)}>
            <p className={cn("font-mono text-[10px] font-semibold uppercase tracking-[0.14em]", muted)}>Disponible</p>
            <p className="mt-2 text-[2.65rem] font-light leading-none tracking-[-0.04em] text-[#1E7A4E]">{formatCurrency(available)}</p>
            <p className={cn("mt-2 text-sm", muted)}>Listo para decidir hoy</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E9ECF0]">
              <div className="h-full rounded-full bg-[#1E7A4E]" style={{ width: `${Math.min(margin, 100)}%` }} />
            </div>
            <p className={cn("mt-2 font-mono text-[10px] tracking-[0.08em]", muted)}>{margin}% de margen sobre tu efectivo positivo</p>
            <div className={cn("mt-5 grid grid-cols-2 border-t pt-4", dark ? "border-[#273248]" : "border-[#E8EBEF]")}>
              <MobileStat label="Reservado" value={formatCurrency(reserved)} muted={muted} />
              <MobileStat label="Total" value={formatCurrency(total)} muted={muted} border />
            </div>
          </section>

          {nextScheduled ? (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <MobileEyebrow>Próximo compromiso</MobileEyebrow>
                <Link href="/programados" className="text-xs font-semibold text-[#1E7A4E]">Ver todos</Link>
              </div>
              <Link href="/programados" className={cn("flex items-center gap-3 rounded-2xl border p-4", surface)}>
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", dark ? "bg-[#1C2638]" : "bg-[#F5F6F8]")}>
                  <CalendarClock className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{nextScheduled.name}</span>
                  <span className={cn("mt-0.5 block text-xs", muted)}>{nextScheduled.nextDueDate}</span>
                </span>
                <span className="text-sm font-medium">−{formatCurrency(nextScheduled.amount)}</span>
                <ChevronRight className={cn("h-4 w-4", muted)} />
              </Link>
            </section>
          ) : null}

          <section>
            <div className="mb-2 flex items-center justify-between">
              <MobileEyebrow>Actividad reciente</MobileEyebrow>
              <Link href="/movements" className="text-xs font-semibold text-[#1E7A4E]">Ver toda</Link>
            </div>
            <div className={cn("divide-y overflow-hidden rounded-2xl border px-4", surface, dark ? "divide-[#273248]" : "divide-[#E8EBEF]")}>
              {movements.slice(0, 4).map((movement) => <MobileMovementRow key={movement.id ?? `${movement.date}-${movement.description}`} movement={movement} muted={muted} />)}
              {movements.length === 0 ? <MobileEmpty title="Sin movimientos este mes" /> : null}
            </div>
          </section>

          <Link href="/goals" className={cn("block rounded-2xl border p-5", surface)}>
            <div className="flex items-center justify-between">
              <MobileEyebrow>Meta principal</MobileEyebrow>
              <Flag className="h-4 w-4 text-[#1E7A4E]" />
            </div>
            {goal ? (
              <>
                <div className="mt-3 flex items-end justify-between gap-3">
                  <div>
                    <p className="font-semibold">{goal.name}</p>
                    <p className={cn("mt-1 text-xs", muted)}>{formatCurrency(goal.current)} de {formatCurrency(goal.target)}</p>
                  </div>
                  <p className="text-xl font-light">{getFeaturedGoalProgress(goal)}%</p>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E9ECF0]">
                  <div className="h-full bg-[#1E7A4E]" style={{ width: `${getFeaturedGoalProgress(goal)}%` }} />
                </div>
              </>
            ) : <MobileEmpty title="Crea tu primera meta" />}
          </Link>
        </div>
      ) : null}
    </main>
  );
}

function MobileStat({ label, value, muted, border = false }: { label: string; value: string; muted: string; border?: boolean }) {
  return (
    <div className={cn(border && "border-l pl-4", border && "border-[#E8EBEF]")}>
      <p className={cn("font-mono text-[9px] font-semibold uppercase tracking-[0.13em]", muted)}>{label}</p>
      <p className="mt-1 text-lg font-light">{value}</p>
    </div>
  );
}

function MobileActivity({
  movements, loading, error, onReload, onDelete, onCreate, onEdit,
}: {
  movements: FinanceMovement[]; loading: boolean; error: string | null;
  onReload: () => Promise<void>; onDelete: (id?: string) => Promise<boolean>;
  onCreate: () => void; onEdit: (movement: FinanceMovement) => void;
}) {
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<FinanceMovement | null>(null);
  const touchStart = useRef(0);
  const filtered = movements.filter((movement) => {
    if (filter === "Todos") return true;
    if (filter === "Gastos") return movement.type === "Gasto";
    if (filter === "Ingresos") return movement.type === "Ingreso";
    return movement.type === "Transferencia";
  });

  return (
    <MobilePage title="Actividad" subtitle="Desliza hacia abajo para actualizar" action={<button type="button" onClick={onCreate} className="flex h-10 items-center gap-2 rounded-full bg-[#1E7A4E] px-4 text-xs font-semibold text-white"><Plus className="h-4 w-4" />Gasto</button>} onTouchStart={(y) => { touchStart.current = y; }} onTouchEnd={(y) => { if (y - touchStart.current > 70) void onReload(); }}>
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-2">
        {["Todos", "Gastos", "Ingresos", "Transferencias"].map((item) => (
          <button key={item} type="button" onClick={() => setFilter(item)} className={cn("shrink-0 rounded-full border px-4 py-2 text-xs font-semibold", filter === item ? "border-[#1E7A4E] bg-[#EAF5EF] text-[#1E7A4E]" : "border-[#E0E3E8] bg-white text-[#6B7280]")}>{item}</button>
        ))}
      </div>
      {loading ? <MobileListSkeleton /> : null}
      {error ? <MobileError message="No pudimos sincronizar la actividad." onRetry={() => void onReload()} /> : null}
      {!loading && !error ? (
        <div className="mt-5 space-y-5">
          {filtered.map((movement) => (
            <div key={movement.id ?? `${movement.date}-${movement.description}`}>
              <MobileEyebrow>{movement.date}</MobileEyebrow>
              <div className="mt-2 flex items-stretch overflow-hidden rounded-2xl border border-[#E0E3E8] bg-white">
                <button type="button" className="min-w-0 flex-1 p-4 text-left" onClick={() => setSelected(movement)}>
                  <MobileMovementRow movement={movement} muted="text-[#8B95A7]" />
                </button>
                <button type="button" aria-label={`Eliminar ${movement.description}`} onClick={() => void onDelete(movement.id)} className="flex w-12 items-center justify-center border-l border-[#E8EBEF] text-[#A24A4A]">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 ? <MobileEmpty title="Sin movimientos este mes" /> : null}
        </div>
      ) : null}
      {selected ? <MovementDetailSheet movement={selected} onClose={() => setSelected(null)} onEdit={() => { onEdit(selected); setSelected(null); }} /> : null}
    </MobilePage>
  );
}

function MobileAnalytics({ movements }: { movements: FinanceMovement[] }) {
  const income = movements.filter((item) => item.type === "Ingreso").reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const expense = movements.filter((item) => item.type === "Gasto").reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const balance = income - expense;
  const savings = income > 0 ? (balance / income) * 100 : 0;
  const data = metrics.map((metric) => ({
    ...metric,
    value: metric.label === "Ingresos" ? income : metric.label === "Gastos" ? expense : metric.label === "Balance" ? balance : savings,
  }));
  const categoryTotals = new Map<string, number>();
  movements.filter((item) => item.type === "Gasto").forEach((item) => categoryTotals.set(item.category, (categoryTotals.get(item.category) ?? 0) + Math.abs(item.amount)));
  const categories = [...categoryTotals.entries()].sort((a, b) => b[1] - a[1]);
  const categorySum = categories.reduce((sum, [, value]) => sum + value, 0);

  return (
    <MobilePage title="Análisis" action={<select aria-label="Periodo" className="rounded-full border border-[#E0E3E8] bg-white px-4 py-2 text-xs font-semibold"><option>Este mes</option></select>}>
      <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
        {data.map((metric) => (
          <article key={metric.label} className="w-[46%] shrink-0 snap-start rounded-2xl border border-[#E0E3E8] bg-white p-4">
            <MobileEyebrow>{metric.label}</MobileEyebrow>
            <p className="mt-3 text-2xl font-light">{metric.percent ? `${metric.value.toFixed(1)}%` : formatCurrency(metric.value)}</p>
            <p className="mt-2 text-[11px] font-semibold text-[#1E7A4E]">{metric.delta}% vs mes anterior</p>
          </article>
        ))}
      </div>
      <section className="mt-5 rounded-2xl border border-[#E0E3E8] bg-white p-5">
        <MobileEyebrow>Ingresos vs. gastos · últimos 7 días</MobileEyebrow>
        <div className="mt-6 flex h-32 items-end justify-between gap-3 border-b border-[#E8EBEF] px-2">
          {[42, 68, 58, 72, 88, 63, 76].map((height, index) => <div key={index} className="w-6 rounded-t bg-[#1E7A4E]" style={{ height: `${height}%` }} />)}
        </div>
        <div className="mt-3 flex justify-between px-2 font-mono text-[9px] text-[#A0A8B7]">{["L", "M", "M", "J", "V", "S", "D"].map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
      </section>
      <section className="mt-5 rounded-2xl border border-[#E0E3E8] bg-white p-5">
        <div className="flex items-center justify-between"><h2 className="font-medium">Gasto por categoría</h2><span className="text-sm">{formatCurrency(categorySum)}</span></div>
        <div className="mt-4 space-y-4">
          {(categories.length ? categories : categoryData.map((item) => [item.name, 0] as const)).slice(0, 5).map(([name, value]) => {
            const percent = categorySum > 0 ? (value / categorySum) * 100 : 0;
            return <div key={name}><div className="flex justify-between text-sm"><span className="font-semibold">{name}</span><span className="text-[#8B95A7]">{formatCurrency(value)} · {percent.toFixed(1)}%</span></div><div className="mt-2 h-1 overflow-hidden rounded bg-[#E8EBEF]"><div className="h-full bg-[#1E7A4E]" style={{ width: `${percent}%` }} /></div></div>;
          })}
        </div>
      </section>
    </MobilePage>
  );
}

function MobileAccounts({ accounts, distribution, total, reviewCount, loading, error, onReload, onCreate, onEdit, onArchive }: {
  accounts: ReturnType<typeof useAccounts>["accounts"];
  distribution: ReturnType<typeof useAccounts>["moneyDistribution"];
  groups: ReturnType<typeof useAccounts>["institutionGroups"];
  total: number;
  reviewCount: number;
  loading: boolean;
  error: string | null;
  onReload: () => Promise<void>;
  onCreate: () => void;
  onEdit: (index: number) => void;
  onArchive: (index: number) => Promise<boolean>;
}) {
  const touchStart = useRef(0);
  return (
    <MobilePage title="Cuentas" subtitle="Tu dinero por cuenta" action={<button type="button" onClick={onCreate} className="flex h-10 items-center gap-2 rounded-full bg-[#1E7A4E] px-4 text-xs font-semibold text-white"><Plus className="h-4 w-4" />Cuenta</button>} onTouchStart={(y) => { touchStart.current = y; }} onTouchEnd={(y) => { if (y - touchStart.current > 70) void onReload(); }}>
      {loading ? <MobileSkeleton /> : null}
      {error ? <MobileError message="No pudimos sincronizar tus cuentas." onRetry={() => void onReload()} /> : null}
      {!loading && !error ? <div className="space-y-6">
        <section className="rounded-3xl border border-[#E0E3E8] bg-white p-6 shadow-[var(--niva-shadow-sm)]"><MobileEyebrow>Total</MobileEyebrow><p className="mt-3 text-[2.65rem] font-light tracking-[-0.04em]">{formatCurrency(total)}</p><div className="mt-4 flex justify-between border-t border-[#E8EBEF] pt-3 text-xs text-[#6B7280]"><span>{accounts.length} cuentas activas</span><span className="font-mono uppercase text-[#8A651C]">{reviewCount} por revisar</span></div></section>
        <section><MobileEyebrow>Distribución</MobileEyebrow><div className="mt-3 grid grid-cols-2 gap-3">{distribution.map((item) => <article key={item.label} className="rounded-2xl border border-[#E0E3E8] bg-white p-4"><p className="text-sm text-[#6B7280]">{item.label}</p><p className="mt-2 text-lg font-light">{formatCurrency(item.total)}</p></article>)}</div></section>
        <section><MobileEyebrow>Cuentas activas</MobileEyebrow><div className="mt-3 space-y-3">{accounts.map((account, index) => <article key={account.id ?? account.name} className="rounded-2xl border border-[#E0E3E8] bg-white p-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F5F6F8] text-sm font-bold">{account.name[0]}</span><div className="min-w-0 flex-1"><p className="truncate font-semibold">{account.name}</p><p className="mt-0.5 text-xs text-[#8B95A7]">{account.type}</p></div><p className="font-medium">{formatCurrency(account.balance)}</p></div><div className="mt-3 flex gap-2 border-t border-[#E8EBEF] pt-3"><button type="button" onClick={() => onEdit(index)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F5F6F8] py-2 text-xs font-semibold"><Pencil className="h-3.5 w-3.5" />Editar</button><button type="button" onClick={() => { if (window.confirm(`¿Archivar ${account.name}?`)) void onArchive(index); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FCF4F4] py-2 text-xs font-semibold text-[#A24A4A]"><Trash2 className="h-3.5 w-3.5" />Archivar</button></div></article>)}{!accounts.length ? <MobileEmpty title="Sin cuentas" /> : null}<Link href="/programados" className="flex items-center justify-between rounded-2xl border border-[#E0E3E8] bg-white p-4"><span className="flex items-center gap-3"><CalendarClock className="h-5 w-5 text-[#1E7A4E]" /><span className="font-semibold">Programados</span></span><ChevronRight className="h-4 w-4 text-[#8B95A7]" /></Link></div></section>
      </div> : null}
    </MobilePage>
  );
}

function MobileGoals({ goals, loading, onCreate, onEdit, onDelete }: { goals: ReturnType<typeof usePlanningData>["goals"]; loading: boolean; onCreate: () => void; onEdit: (goal: ReturnType<typeof usePlanningData>["goals"][number]) => void; onDelete: (id: string) => void }) {
  return <MobilePage title="Objetivos" subtitle="Tus metas, con fecha y cantidad" action={<button type="button" onClick={onCreate} className="flex h-10 items-center gap-2 rounded-full bg-[#1E7A4E] px-4 text-xs font-semibold text-white"><Plus className="h-4 w-4" />Meta</button>}>
    {loading ? <MobileListSkeleton /> : <div className="space-y-4">{goals.map((goal) => { const progress = getFeaturedGoalProgress(goal); return <article key={goal.id} className="rounded-3xl border border-[#E0E3E8] bg-white p-6"><div className="flex items-start justify-between"><div><MobileEyebrow>Meta</MobileEyebrow><h2 className="mt-2 text-xl font-medium">{goal.name}</h2></div><span className="text-2xl font-light text-[#1E7A4E]">{progress}%</span></div><p className="mt-5 text-sm text-[#6B7280]">{formatCurrency(goal.current)} de {formatCurrency(goal.target)}</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#E8EBEF]"><div className="h-full bg-[#1E7A4E]" style={{ width: `${progress}%` }} /></div><p className="mt-4 text-xs text-[#8B95A7]">{goal.date}</p><div className="mt-4 flex gap-2 border-t border-[#E8EBEF] pt-4"><button type="button" onClick={() => onEdit(goal)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F5F6F8] py-2 text-xs font-semibold"><Pencil className="h-3.5 w-3.5" />Editar</button><button type="button" onClick={() => { if (window.confirm(`¿Eliminar ${goal.name}?`)) onDelete(goal.id); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FCF4F4] py-2 text-xs font-semibold text-[#A24A4A]"><Trash2 className="h-3.5 w-3.5" />Eliminar</button></div></article>; })}{!goals.length ? <MobileEmpty title="Sin metas todavía" /> : null}</div>}
  </MobilePage>;
}

function MobileScheduled({ items, loading, error, onReload, onCreate, onEdit, onToggle, onConfirm, onDelete }: { items: ScheduledTransaction[]; loading: boolean; error: string; onReload: () => Promise<void>; onCreate: () => void; onEdit: (item: ScheduledTransaction) => void; onToggle: (item: ScheduledTransaction) => void; onConfirm: (id: string) => Promise<boolean>; onDelete: (id: string) => void }) {
  return <MobilePage title="Programados" subtitle="Pagos e ingresos recurrentes" action={<button type="button" onClick={onCreate} className="flex h-10 items-center gap-2 rounded-full bg-[#1E7A4E] px-4 text-xs font-semibold text-white"><Plus className="h-4 w-4" />Nuevo</button>}>
    {loading ? <MobileListSkeleton /> : null}{error ? <MobileError message="No pudimos sincronizar tus programados." onRetry={() => void onReload()} /> : null}
    {!loading && !error ? <div className="space-y-4">{items.map((item) => <article key={item.id} className="rounded-3xl border border-[#E0E3E8] bg-white p-5"><div className="flex items-start gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5EF] text-[#1E7A4E]"><CalendarClock className="h-5 w-5" /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{item.name}</h2><p className="mt-1 text-xs text-[#8B95A7]">{item.account} · {item.frequency}</p></div><p className="shrink-0 font-medium">{formatCurrency(item.amount)}</p></div><div className="mt-3 flex items-center justify-between"><span className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold", item.status === "active" ? "bg-[#EAF5EF] text-[#1E7A4E]" : "bg-[#F2F3F5] text-[#6B7280]")}>{item.status === "active" ? "Activo" : item.status === "paused" ? "Pausado" : "Finalizado"}</span><span className="text-xs text-[#6B7280]">Próximo: {item.nextDueDate}</span></div></div></div><div className="mt-4 grid grid-cols-4 gap-2 border-t border-[#E8EBEF] pt-4"><button type="button" aria-label="Editar" onClick={() => onEdit(item)} className="grid place-items-center rounded-xl bg-[#F5F6F8] py-2.5"><Pencil className="h-4 w-4" /></button><button type="button" aria-label={item.status === "paused" ? "Reactivar" : "Pausar"} onClick={() => onToggle(item)} className="grid place-items-center rounded-xl bg-[#F5F6F8] py-2.5">{item.status === "paused" ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</button><button type="button" aria-label="Confirmar pago" disabled={item.status !== "active"} onClick={() => void onConfirm(item.id)} className="grid place-items-center rounded-xl bg-[#EAF5EF] py-2.5 text-[#1E7A4E] disabled:opacity-40"><ReceiptText className="h-4 w-4" /></button><button type="button" aria-label="Eliminar" onClick={() => { if (window.confirm(`¿Eliminar ${item.name}?`)) onDelete(item.id); }} className="grid place-items-center rounded-xl bg-[#FCF4F4] py-2.5 text-[#A24A4A]"><Trash2 className="h-4 w-4" /></button></div></article>)}{!items.length ? <MobileEmpty title="No tienes pagos programados" /> : null}</div> : null}
  </MobilePage>;
}

function MobileBudgets({ items, categories, loading, onSave, onDelete }: { items: ReturnType<typeof usePlanningData>["budgets"]; categories: ReturnType<typeof usePlanningData>["expenseCategories"]; loading: boolean; onSave: ReturnType<typeof usePlanningData>["saveBudget"]; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false); const [editing, setEditing] = useState<ReturnType<typeof usePlanningData>["budgets"][number] | null>(null);
  return <><MobilePage title="Presupuestos" subtitle="Límites mensuales por categoría" action={<button type="button" onClick={() => { setEditing(null); setOpen(true); }} className="flex h-10 items-center gap-2 rounded-full bg-[#1E7A4E] px-4 text-xs font-semibold text-white"><Plus className="h-4 w-4" />Nuevo</button>}>{loading ? <MobileListSkeleton /> : <div className="space-y-4">{items.map((item) => <PlanningCard key={item.id} title={item.name} value={`${formatCurrency(item.spent)} de ${formatCurrency(item.limit)}`} progress={item.limit ? Math.min((item.spent / item.limit) * 100, 100) : 0} onEdit={() => { setEditing(item); setOpen(true); }} onDelete={() => onDelete(item.id)} />)}{!items.length ? <MobileEmpty title="Sin presupuestos" /> : null}</div>}</MobilePage><QuickCreateDialog open={open} title={editing ? "Editar presupuesto" : "Nuevo presupuesto"} description="Define el límite mensual para una categoría." amountLabel="Límite" secondaryLabel="Mes" secondaryPlaceholder="Mes actual" categoryOptions={categories} categoryLabel="Categoría" initialValue={editing ? { name: editing.name, amount: editing.limit, secondary: "", categoryId: editing.categoryId } : null} onClose={() => setOpen(false)} onSave={(value) => onSave(value, editing ?? undefined)} /></>;
}

function MobileLiabilities({ items, loading, onSave, onDelete }: { items: ReturnType<typeof usePlanningData>["liabilities"]; loading: boolean; onSave: ReturnType<typeof usePlanningData>["saveLiability"]; onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false); const [editing, setEditing] = useState<ReturnType<typeof usePlanningData>["liabilities"][number] | null>(null);
  return <><MobilePage title="Deudas" subtitle="Tarjetas y compromisos pendientes" action={<button type="button" onClick={() => { setEditing(null); setOpen(true); }} className="flex h-10 items-center gap-2 rounded-full bg-[#1E7A4E] px-4 text-xs font-semibold text-white"><Plus className="h-4 w-4" />Nueva</button>}>{loading ? <MobileListSkeleton /> : <div className="space-y-4">{items.map((item) => <PlanningCard key={item.id} title={item.name} value={formatCurrency(item.balance)} subtitle={`${item.closing} · ${item.due}`} progress={item.limit ? Math.min((item.balance / item.limit) * 100, 100) : 0} onEdit={() => { setEditing(item); setOpen(true); }} onDelete={() => onDelete(item.id)} />)}{!items.length ? <MobileEmpty title="Sin deudas activas" /> : null}</div>}</MobilePage><QuickCreateDialog open={open} title={editing ? "Editar deuda" : "Nueva deuda"} description="Registra el saldo y las fechas clave." amountLabel="Saldo" secondaryLabel="Día de corte" secondaryPlaceholder="Ej. Día 20" extraLabel="Día de pago" extraPlaceholder="Ej. Día 5" extraAmountLabel="Límite de crédito" initialValue={editing ? { name: editing.name, amount: editing.balance, secondary: editing.closing, extra: editing.due, extraAmount: editing.limit } : null} onClose={() => setOpen(false)} onSave={(value) => onSave(value, editing ?? undefined)} /></>;
}

function PlanningCard({ title, value, subtitle, progress, onEdit, onDelete }: { title: string; value: string; subtitle?: string; progress: number; onEdit: () => void; onDelete: () => void }) {
  return <article className="rounded-3xl border border-[#E0E3E8] bg-white p-5"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-xl font-light">{value}</p>{subtitle ? <p className="mt-1 text-xs text-[#8B95A7]">{subtitle}</p> : null}<div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[#E8EBEF]"><div className="h-full bg-[#1E7A4E]" style={{ width: `${progress}%` }} /></div><div className="mt-4 flex gap-2"><button type="button" onClick={onEdit} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#F5F6F8] py-2 text-xs font-semibold"><Pencil className="h-3.5 w-3.5" />Editar</button><button type="button" onClick={() => { if (window.confirm(`¿Eliminar ${title}?`)) onDelete(); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FCF4F4] py-2 text-xs font-semibold text-[#A24A4A]"><Trash2 className="h-3.5 w-3.5" />Eliminar</button></div></article>;
}

function MobileSettings({ user }: NivaMobileExperienceProps) {
  const [name, setName] = useState(user.name); const [currency, setCurrency] = useState(user.currencyCode); const [message, setMessage] = useState(""); const [saving, setSaving] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (!name.trim()) return; setSaving(true); setMessage(""); const supabase = createClient(); const { error } = await supabase.from("profiles").update({ full_name: name.trim(), currency_code: currency, locale: user.locale }).eq("id", user.id); if (!error) { await supabase.auth.updateUser({ data: { full_name: name.trim() } }); setMessage("Preferencias guardadas."); } else setMessage("No pudimos guardar tus preferencias."); setSaving(false); }
  return <MobilePage title="Configuración" subtitle="Perfil, moneda y seguridad"><form onSubmit={save} className="space-y-4 rounded-3xl border border-[#E0E3E8] bg-white p-5"><label className="grid gap-2 text-sm font-semibold">Nombre<input value={name} onChange={(event) => setName(event.target.value)} className="h-12 rounded-xl border border-[#D5D9E0] px-4 font-normal" /></label><label className="grid gap-2 text-sm font-semibold">Correo<input value={user.email} readOnly className="h-12 rounded-xl border border-[#D5D9E0] bg-[#F5F6F8] px-4 font-normal text-[#6B7280]" /></label><label className="grid gap-2 text-sm font-semibold">Moneda<select value={currency} onChange={(event) => setCurrency(event.target.value)} className="h-12 rounded-xl border border-[#D5D9E0] px-4 font-normal"><option value="MXN">MXN · Peso mexicano</option><option value="USD">USD · Dólar estadounidense</option><option value="EUR">EUR · Euro</option></select></label>{message ? <p role="status" className="rounded-xl bg-[#EAF5EF] p-3 text-sm text-[#1E7A4E]">{message}</p> : null}<button type="submit" disabled={saving} className="w-full rounded-xl bg-[#1E7A4E] py-3 text-sm font-semibold text-white">{saving ? "Guardando…" : "Guardar cambios"}</button></form><form action={signOut} className="mt-4"><button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#E6CFCF] bg-white py-3 text-sm font-semibold text-[#A24A4A]"><LogOut className="h-4 w-4" />Cerrar sesión</button></form></MobilePage>;
}

function MoreSheet({ onClose }: { onClose: () => void }) {
  const links = [{ label: "Programados", href: "/programados", icon: CalendarClock }, { label: "Objetivos", href: "/goals", icon: Target }, { label: "Presupuestos", href: "/budgets", icon: PiggyBank }, { label: "Deudas", href: "/liabilities", icon: Landmark }, { label: "Configuración", href: "/settings", icon: Settings }];
  return <div className="fixed inset-0 z-[80] flex items-end bg-black/35" role="dialog" aria-modal="true" aria-label="Más opciones"><button type="button" aria-label="Cerrar" className="absolute inset-0" onClick={onClose} /><section className="relative w-full rounded-t-[2rem] bg-white px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4"><div className="mx-auto mb-5 h-1 w-10 rounded bg-[#D5D9E0]" /><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Más opciones</h2><button type="button" onClick={onClose} aria-label="Cerrar"><X className="h-5 w-5" /></button></div><div className="mt-5 space-y-2">{links.map(({ label, href, icon: Icon }) => <Link key={href} href={href} onClick={onClose} className="flex items-center gap-3 rounded-2xl border border-[#E0E3E8] p-4"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF5EF] text-[#1E7A4E]"><Icon className="h-5 w-5" /></span><span className="flex-1 font-semibold">{label}</span><ChevronRight className="h-4 w-4 text-[#8B95A7]" /></Link>)}</div></section></div>;
}
function CreateActionSheet({ onClose, onMovement, onScheduled, onAccount }: { onClose: () => void; onMovement: (type: string) => void; onScheduled: () => void; onAccount: () => void }) {
  const actions = [{ label: "Añadir gasto", icon: ArrowUpRight, action: () => onMovement("Gasto") }, { label: "Añadir ingreso", icon: ArrowDownLeft, action: () => onMovement("Ingreso") }, { label: "Transferencia", icon: Repeat2, action: () => onMovement("Transferencia") }, { label: "Crear programado", icon: CalendarClock, action: onScheduled }, { label: "Añadir cuenta", icon: WalletCards, action: onAccount }];
  return <div className="fixed inset-0 z-[80] flex items-end bg-black/35" role="dialog" aria-modal="true" aria-label="Crear"><button type="button" aria-label="Cerrar" className="absolute inset-0" onClick={onClose} /><section className="relative w-full rounded-t-[2rem] bg-white px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4"><div className="mx-auto mb-5 h-1 w-10 rounded bg-[#D5D9E0]" /><div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Nuevo registro</h2><button type="button" onClick={onClose} aria-label="Cerrar"><X className="h-5 w-5" /></button></div><div className="mt-5 grid grid-cols-2 gap-3">{actions.map(({ label, icon: Icon, action }) => <button key={label} type="button" onClick={action} className="flex min-h-24 flex-col items-start justify-between rounded-2xl border border-[#E0E3E8] bg-[#F8F9FA] p-4 text-left text-sm font-semibold"><Icon className="h-5 w-5 text-[#1E7A4E]" />{label}</button>)}</div></section></div>;
}
function MobilePage({
  title,
  subtitle,
  action,
  children,
  onTouchStart,
  onTouchEnd,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  onTouchStart?: (y: number) => void;
  onTouchEnd?: (y: number) => void;
}) {
  return (
    <main
      className="mx-auto min-h-[100dvh] w-full max-w-md px-5 pb-3 pt-[calc(1.1rem+env(safe-area-inset-top))]"
      onTouchStart={(event) => onTouchStart?.(event.touches[0]?.clientY ?? 0)}
      onTouchEnd={(event) => onTouchEnd?.(event.changedTouches[0]?.clientY ?? 0)}
    >
      <header className="mb-5 flex items-start justify-between gap-4">
        <div><h1 className="text-[2rem] font-light tracking-[-0.04em]">{title}</h1>{subtitle ? <p className="mt-1 text-sm text-[#8B95A7]">{subtitle}</p> : null}</div>
        {action}
      </header>
      {children}
    </main>
  );
}

function MobileMovementRow({ movement, muted }: { movement: FinanceMovement; muted: string }) {
  const positive = movement.type === "Ingreso";
  return (
    <div className="flex min-w-0 items-center gap-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F5F6F8] font-mono text-xs text-[#6B7280]">{movement.description[0]?.toUpperCase()}</span>
      <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{movement.description}</span><span className={cn("mt-0.5 block truncate text-[11px]", muted)}>{movement.account} · {movement.category}</span></span>
      <span className={cn("shrink-0 text-sm font-medium", positive && "text-[#1E7A4E]")}>{positive ? "+" : movement.type === "Gasto" ? "−" : ""}{formatCurrency(Math.abs(movement.amount))}</span>
    </div>
  );
}

function MovementDetailSheet({ movement, onClose, onEdit }: { movement: FinanceMovement; onClose: () => void; onEdit: () => void }) {
  return (
    <div className="fixed inset-0 z-[70] flex items-end bg-black/30" role="dialog" aria-modal="true" aria-label="Detalle del movimiento">
      <button type="button" aria-label="Cerrar detalle" className="absolute inset-0" onClick={onClose} />
      <section className="relative w-full rounded-t-[2rem] bg-white p-6 pb-[calc(2rem+env(safe-area-inset-bottom))]">
        <div className="mx-auto mb-5 h-1 w-10 rounded bg-[#D5D9E0]" />
        <button type="button" aria-label="Cerrar" onClick={onClose} className="absolute right-5 top-5"><X className="h-5 w-5" /></button>
        <MobileEyebrow>Detalle</MobileEyebrow>
        <h2 className="mt-3 text-2xl font-medium">{movement.description}</h2>
        <p className="mt-2 text-sm text-[#6B7280]">{movement.account} · {movement.category}</p>
        <p className="mt-7 text-3xl font-light">{formatCurrency(movement.amount)}</p>
        <p className="mt-2 text-sm text-[#8B95A7]">{movement.date}</p>
        <button type="button" onClick={onEdit} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F1726] px-5 py-3 text-sm font-semibold text-white"><Pencil className="h-4 w-4" />Editar movimiento</button>
      </section>
    </div>
  );
}

function MobileTabBar({ pathname, onCreate, onMore }: { pathname: string; onCreate: () => void; onMore: () => void }) {
  const items = [
    { label: "Inicio", href: "/dashboard", icon: Home },
    { label: "Actividad", href: "/movements", icon: ReceiptText },
    { label: "Análisis", href: "/categories", icon: BarChart3 },
    { label: "Cuentas", href: "/accounts", icon: WalletCards },
  ];
  return (
    <nav aria-label="Navegación principal móvil" className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E0E3E8] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl">
      <button type="button" onClick={onMore} aria-label="Más opciones" className="absolute right-3 -top-12 flex h-10 w-10 items-center justify-center rounded-full border border-[#E0E3E8] bg-white text-[#6B7280] shadow-sm"><MoreHorizontal className="h-5 w-5" /></button>
      <div className="mx-auto grid h-[4.75rem] max-w-md grid-cols-5 items-center px-3">
        {items.slice(0, 2).map((item) => <MobileTab key={item.href} {...item} active={pathname === item.href} />)}
        <button type="button" aria-label="Nuevo registro" onClick={onCreate} className="mx-auto -mt-7 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#F7F8FA] bg-[#1E7A4E] text-white shadow-[0_10px_24px_rgba(30,122,78,0.3)]"><Plus className="h-6 w-6" /></button>
        {items.slice(2).map((item) => <MobileTab key={item.href} {...item} active={pathname === item.href} />)}
      </div>
    </nav>
  );
}

function MobileTab({ label, href, icon: Icon, active }: { label: string; href: string; icon: typeof Home; active: boolean }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex h-full flex-col items-center justify-center gap-1 text-[10px] font-medium", active ? "text-[#1E7A4E]" : "text-[#8B95A7]")}><Icon className="h-5 w-5" /><span>{label}</span></Link>;
}

function MobileEyebrow({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9AA4B5]">{children}</p>;
}

function MobileEmpty({ title }: { title: string }) {
  return <div className="grid min-h-28 place-items-center rounded-2xl border border-dashed border-[#D5D9E0] p-5 text-center text-sm text-[#8B95A7]">{title}</div>;
}

function MobileError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div role="alert" className="mt-5 rounded-2xl border border-[#E6CFCF] bg-[#FCF4F4] p-5"><p className="text-sm font-semibold text-[#8C3E3E]">{message}</p><button type="button" onClick={onRetry} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-[#8C3E3E]"><RefreshCw className="h-3.5 w-3.5" />Intentar de nuevo</button></div>;
}

function MobileSkeleton() {
  return <div className="mt-5 space-y-4" aria-label="Cargando"><div className="h-40 animate-pulse rounded-3xl bg-[#E8EBEF]" /><div className="h-56 animate-pulse rounded-3xl bg-[#E8EBEF]" /><div className="h-20 animate-pulse rounded-2xl bg-[#E8EBEF]" /></div>;
}

function MobileListSkeleton() {
  return <div className="mt-5 space-y-4" aria-label="Cargando">{[1, 2, 3, 4].map((item) => <div key={item} className="h-20 animate-pulse rounded-2xl bg-[#E8EBEF]" />)}</div>;
}
