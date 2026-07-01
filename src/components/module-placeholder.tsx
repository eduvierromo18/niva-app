import { Plus } from "lucide-react";
import { PageHeader } from "@/components/page-header";

export function ModulePlaceholder({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <button className="inline-flex items-center gap-2 rounded-md bg-emerald-400 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-300">
            <Plus className="h-4 w-4" />
            Nuevo
          </button>
        }
      />
      <section className="rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <div className="grid gap-px overflow-hidden rounded-lg bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="bg-white p-5">
              <p className="font-semibold text-slate-950">{item}</p>
              <p className="mt-1 text-sm text-slate-500">Listo para conectar con Supabase.</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
