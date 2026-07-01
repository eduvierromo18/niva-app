import {
  ArrowDownUp,
  CircleSlash,
  CreditCard,
  Euro,
  Filter,
  Grid2X2,
  Search,
  Settings2,
  Tag,
  WalletCards,
} from "lucide-react";

const filters = [
  { label: "Cuentas", value: "Todas las cuentas", icon: WalletCards },
  { label: "Categorias", value: "Todas las categorias", icon: Grid2X2 },
  { label: "Etiquetas", value: "All", icon: Tag },
  { label: "Monedas", value: "Todas las monedas", icon: Euro },
  { label: "Tipos de registro", value: "Todos los tipos de registro", icon: ArrowDownUp },
  { label: "Transferencias", value: "Incluir transferencias", icon: ArrowDownUp },
  { label: "Estados de registro", value: "Todos los estados de registro", icon: CircleSlash },
  { label: "Tipos de pago", value: "Todos los tipos de pago", icon: CreditCard },
];

export function FiltersSidebar({ title }: { title: string }) {
  return (
    <aside className="h-[calc(100vh-98px)] w-full overflow-y-auto rounded-md bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:w-[380px] lg:shrink-0">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h1 className="text-3xl font-bold text-slate-950">{title}</h1>
        <button className="rounded-lg bg-slate-100 p-2 text-slate-700 hover:bg-slate-200" aria-label="Ajustes de filtros">
          <Settings2 className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-base font-bold text-slate-950">Mi filtro</p>
        <button className="flex h-11 w-full items-center gap-3 rounded-lg border border-slate-300 px-4 text-left text-slate-400">
          <Filter className="h-4 w-4" />
          Seleccionar filtro
        </button>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4">
        <label className="text-base font-bold text-slate-950">Buscar</label>
        <div className="mt-2 flex h-11 items-center gap-3 rounded-lg border border-slate-300 px-4 text-slate-400">
          <Search className="h-4 w-4" />
          <span>Buscar</span>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <p className="mb-2 text-base font-bold text-slate-950">Ordenar por</p>
          <button className="flex h-11 w-full items-center gap-3 rounded-lg border border-slate-300 px-4 text-left text-slate-700">
            <ArrowDownUp className="h-4 w-4 text-slate-400" />
            Tiempo (mas recientes primero)
          </button>
        </div>
        {filters.map((filter) => (
          <div key={filter.label}>
            <p className="mb-2 text-base font-bold text-slate-950">{filter.label}</p>
            <button className="flex h-11 w-full items-center gap-3 rounded-lg border border-slate-300 px-4 text-left text-slate-400">
              <filter.icon className="h-4 w-4" />
              {filter.value}
            </button>
          </div>
        ))}
        <div className="rounded-lg border border-slate-200 p-3">
          <div className="flex justify-between">
            <p className="font-bold">Rango de cantidad</p>
            <span className="text-sm text-slate-500">MXN</span>
          </div>
          <p className="text-sm text-slate-500">Cantidad absoluta en moneda de referencia</p>
          <div className="mt-4 h-2 rounded-full bg-slate-200" />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="h-10 rounded-lg bg-slate-100" />
            <div className="h-10 rounded-lg bg-slate-100" />
          </div>
        </div>
      </div>
      <button className="mt-5 h-11 w-full rounded-lg bg-slate-100 text-sm font-bold text-slate-400">
        Restablecer filtro
      </button>
    </aside>
  );
}

