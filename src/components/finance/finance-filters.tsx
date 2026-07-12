"use client";

import { useState } from "react";
import {
  ArrowDownUp,
  CalendarDays,
  CircleDollarSign,
  Filter,
  Grid2X2,
  Search,
  Tag,
  WalletCards,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { inputClass } from "@/components/ui/dialog";

const filterItems = [
  { key: "account", label: "Cuentas", icon: WalletCards, options: ["Todas las cuentas", "Efectivo", "Cuenta nomina", "Ahorro"] },
  { key: "category", label: "Categorías", icon: Grid2X2, options: ["Todas las categorías", "Comida", "Vivienda", "Transporte", "Ingresos"] },
  { key: "tag", label: "Etiquetas", icon: Tag, options: ["Todas las etiquetas", "Recurrente", "Importante", "Revisar"] },
  { key: "currency", label: "Moneda", icon: CircleDollarSign, options: ["MXN - Peso mexicano", "USD - Dolar", "EUR - Euro"] },
  { key: "type", label: "Tipo de registro", icon: ArrowDownUp, options: ["Todos los tipos", "Ingreso", "Gasto", "Transferencia"] },
  { key: "period", label: "Periodo", icon: CalendarDays, options: ["Este mes", "Mes anterior", "Últimos 3 meses", "Este año"] },
];

export function FinanceFilters({ title }: { title: string }) {
  const initialFilters = Object.fromEntries(filterItems.map((item) => [item.key, item.options[0]]));
  const [filters, setFilters] = useState<Record<string, string>>(initialFilters);
  const [search, setSearch] = useState("");
  const [minAmount, setMinAmount] = useState("0.00");
  const [maxAmount, setMaxAmount] = useState("10000.00");
  const [savedFilter, setSavedFilter] = useState("Sin filtro guardado");

  function updateFilter(key: string, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
    setSearch("");
    setMinAmount("0.00");
    setMaxAmount("10000.00");
    setSavedFilter("Sin filtro guardado");
  }

  return (
    <Card className="h-fit lg:sticky lg:top-24 lg:w-72 lg:shrink-0 xl:w-80">
      <div className="p-5">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--niva-color-foreground)]">{title}</h2>
          <Button type="button" variant="secondary" className="h-9 w-9 px-0" onClick={resetFilters} aria-label="Restablecer filtros">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <details className="lg:open" open>
          <summary className="mb-3 cursor-pointer rounded-[var(--niva-radius-md)] bg-[var(--niva-color-muted-surface)] px-3 py-2 text-sm font-bold text-[var(--niva-color-body)] lg:hidden">
            Mostrar filtros
          </summary>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-sm font-bold">Mi filtro</p>
            <div className="relative">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--niva-color-placeholder)]" />
              <select
                className={`${inputClass} w-full pl-9 text-[var(--niva-color-muted)]`}
                value={savedFilter}
                onChange={(event) => setSavedFilter(event.target.value)}
              >
                <option>Sin filtro guardado</option>
                <option>Gastos del mes</option>
                <option>Solo ingresos</option>
                <option>Registros por revisar</option>
              </select>
            </div>
          </div>
          <div>
            <p className="mb-2 text-sm font-bold">Buscar</p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--niva-color-placeholder)]" />
              <input
                className={`${inputClass} w-full pl-9`}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar"
              />
            </div>
          </div>
          {filterItems.map((item) => (
            <div key={item.label}>
              <p className="mb-2 text-sm font-bold">{item.label}</p>
              <div className="relative">
                <item.icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--niva-color-placeholder)]" />
                <select
                  className={`${inputClass} w-full pl-9 text-[var(--niva-color-muted)]`}
                  value={filters[item.key]}
                  onChange={(event) => updateFilter(item.key, event.target.value)}
                >
                  {item.options.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold">Rango de cantidad</p>
              <span className="text-xs text-[var(--niva-color-muted)]">MXN</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} type="number" value={minAmount} onChange={(event) => setMinAmount(event.target.value)} aria-label="Cantidad minima" />
              <input className={inputClass} type="number" value={maxAmount} onChange={(event) => setMaxAmount(event.target.value)} aria-label="Cantidad maxima" />
            </div>
          </div>
          <Button variant="secondary" className="w-full" onClick={resetFilters} type="button">Restablecer filtro</Button>
        </div>
        </details>
      </div>
    </Card>
  );
}
