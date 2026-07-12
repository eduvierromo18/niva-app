import { Edit3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export function MovementsTable({
  rows,
  onEdit,
  onDelete,
}: {
  rows: Array<{ id?: string; date: string; description: string; account: string; category: string; type: string; amount: number }>;
  onEdit?: (index: number) => void;
  onDelete?: (index: number) => void;
}) {
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="overflow-hidden rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] shadow-[var(--niva-shadow-sm)]">
      <div className="grid gap-3 p-3 md:hidden">
        {rows.map((row, index) => (
          <article key={`${row.date}-${row.description}-${index}`} className="rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)] bg-[var(--niva-color-muted-surface)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-[var(--niva-color-muted)]">{row.date} · {row.type}</p>
                <h3 className="mt-1 font-bold text-[var(--niva-color-foreground)]">{row.description}</h3>
                <p className="mt-1 text-sm text-[var(--niva-color-muted)]">{row.account}</p>
              </div>
              <p className={row.amount < 0 ? "text-right font-bold text-[var(--niva-color-danger)]" : "text-right font-bold text-[var(--niva-color-accent)]"}>
                {formatCurrency(row.amount)}
              </p>
            </div>
            <div className="mt-3 inline-flex rounded-full bg-[var(--niva-color-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--niva-color-muted)]">
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
                  <Button type="button" variant="ghost" className="h-9 px-3 text-[var(--niva-color-danger)]" onClick={() => onDelete(index)}>
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
        <thead className="bg-[var(--niva-color-muted-surface)] text-left text-xs uppercase tracking-wide text-[var(--niva-color-muted)]">
          <tr>
            <th className="px-5 py-3">Fecha</th>
            <th className="px-5 py-3">Descripción</th>
            <th className="px-5 py-3">Cuenta</th>
            <th className="px-5 py-3">Categoría</th>
            <th className="px-5 py-3">Tipo</th>
            <th className="px-5 py-3 text-right">Importe</th>
            {hasActions ? <th className="px-5 py-3 text-right">Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={`${row.date}-${row.description}-${index}`} className="border-t border-[var(--niva-color-border)]">
              <td className="px-5 py-4 text-[var(--niva-color-muted)]">{row.date}</td>
              <td className="px-5 py-4 font-semibold text-[var(--niva-color-foreground)]">{row.description}</td>
              <td className="px-5 py-4 text-[var(--niva-color-muted)]">{row.account}</td>
              <td className="px-5 py-4 text-[var(--niva-color-muted)]">{row.category}</td>
              <td className="px-5 py-4 text-[var(--niva-color-muted)]">{row.type}</td>
              <td className={row.amount < 0 ? "px-5 py-4 text-right font-bold text-[var(--niva-color-danger)]" : "px-5 py-4 text-right font-bold text-[var(--niva-color-accent)]"}>
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
                      <Button type="button" variant="ghost" className="h-9 px-3 text-[var(--niva-color-danger)]" onClick={() => onDelete(index)}>
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
