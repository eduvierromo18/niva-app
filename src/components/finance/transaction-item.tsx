import { ArrowDownLeft, ArrowRightLeft, ArrowUpRight, MoreHorizontal } from "lucide-react";
import type { FinanceMovement } from "@/lib/finance-types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function movementIcon(type: string) {
  if (type === "Ingreso") return ArrowUpRight;
  if (type === "Transferencia") return ArrowRightLeft;
  return ArrowDownLeft;
}

export function TransactionItem({
  movement,
  onEdit,
  onDelete,
}: {
  movement: FinanceMovement;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const Icon = movementIcon(movement.type);
  const positive = movement.amount > 0;

  return (
    <article className="flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-slate-50 dark:hover:bg-zinc-900">
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", positive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-300")}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-sm font-bold text-slate-950 dark:text-zinc-50">{movement.description}</h3>
          <span className="hidden text-xs text-slate-400 sm:inline">•</span>
          <span className="hidden text-xs font-medium text-slate-500 sm:inline">{movement.category}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-zinc-400">
          {movement.type === "Transferencia" && movement.destinationAccount
            ? `${movement.account} -> ${movement.destinationAccount}`
            : `${movement.merchant ?? movement.account} · ${movement.account}`}
        </p>
      </div>
      <div className="text-right">
        <p className={cn("text-sm font-bold", positive ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
          {formatCurrency(movement.amount)}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">{movement.date}</p>
      </div>
      {onEdit || onDelete ? (
        <div className="flex items-center gap-1">
          {onEdit ? <Button type="button" variant="ghost" className="h-9 px-2" onClick={onEdit}>Editar</Button> : null}
          {onDelete ? <Button type="button" variant="ghost" className="h-9 px-2 text-rose-600" onClick={onDelete}>Eliminar</Button> : null}
        </div>
      ) : (
        <MoreHorizontal className="hidden h-4 w-4 text-slate-400 sm:block" />
      )}
    </article>
  );
}
