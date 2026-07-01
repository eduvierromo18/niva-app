import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function MovementsTable({
  rows,
  onEdit,
  onDelete,
}: {
  rows: Array<{ date: string; description: string; account: string; category: string; type: string; amount: number }>;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="grid gap-3 p-3 md:hidden">
        {rows.map((row, index) => (
          <article key={`${row.date}-${row.description}-${index}`} className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500">{row.date} · {row.type}</p>
                <h3 className="mt-1 font-bold text-slate-950 dark:text-zinc-50">{row.description}</h3>
                <p className="mt-1 text-sm text-slate-500">{row.account}</p>
              </div>
              <p className={row.amount < 0 ? "text-right font-bold text-rose-600" : "text-right font-bold text-emerald-700"}>
                {formatCurrency(row.amount)}
              </p>
            </div>
            <div className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-zinc-950 dark:text-zinc-300">
              {row.category}
            </div>
            {hasActions ? (
              <div className="mt-4 flex gap-2">
                {onEdit ? (
                  <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => onEdit(index)}>
                    <Edit3 className="h-4 w-4" />
                    Editar
                  </Button>
                ) : null}
                {onDelete ? (
                  <Button type="button" variant="ghost" className="h-9 px-3 text-rose-600" onClick={() => onDelete(index)}>
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                ) : null}
              </div>
            ) : null}
          </article>
        ))}
      </div>
      <table className="hidden w-full min-w-[760px] border-collapse text-sm md:table">
        <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500 dark:bg-zinc-900 dark:text-zinc-400">
          <tr>
            <th className="px-5 py-3">Fecha</th>
            <th className="px-5 py-3">Descripcion</th>
            <th className="px-5 py-3">Cuenta</th>
            <th className="px-5 py-3">Categoria</th>
            <th className="px-5 py-3">Tipo</th>
            <th className="px-5 py-3 text-right">Importe</th>
            {hasActions ? <th className="px-5 py-3 text-right">Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.date}-${row.description}-${index}`} className="border-t border-slate-100 dark:border-zinc-800">
              <td className="px-5 py-4 text-slate-500">{row.date}</td>
              <td className="px-5 py-4 font-semibold text-slate-950 dark:text-zinc-50">{row.description}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-zinc-300">{row.account}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-zinc-300">{row.category}</td>
              <td className="px-5 py-4 text-slate-600 dark:text-zinc-300">{row.type}</td>
              <td className={row.amount < 0 ? "px-5 py-4 text-right font-bold text-rose-600" : "px-5 py-4 text-right font-bold text-emerald-700"}>
                {formatCurrency(row.amount)}
              </td>
              {hasActions ? (
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {onEdit ? (
                      <Button type="button" variant="secondary" className="h-9 px-3" onClick={() => onEdit(index)}>
                        <Edit3 className="h-4 w-4" />
                        Editar
                      </Button>
                    ) : null}
                    {onDelete ? (
                      <Button type="button" variant="ghost" className="h-9 px-3 text-rose-600" onClick={() => onDelete(index)}>
                        <Trash2 className="h-4 w-4" />
                        Eliminar
                      </Button>
                    ) : null}
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
