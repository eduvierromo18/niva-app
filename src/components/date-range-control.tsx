"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const periods = ["Este mes", "Mes anterior", "Ultimos 3 meses", "Este ano", "Personalizado"];

export function DateRangeControl() {
  const [periodIndex, setPeriodIndex] = useState(0);
  const period = periods[periodIndex];

  function previousPeriod() {
    setPeriodIndex((current) => Math.max(0, current - 1));
  }

  function nextPeriod() {
    setPeriodIndex((current) => Math.min(periods.length - 1, current + 1));
  }

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4">
      <button
        className="rounded-full p-2 text-slate-700 hover:bg-white disabled:opacity-40"
        aria-label="Periodo anterior"
        disabled={periodIndex === 0}
        onClick={previousPeriod}
        type="button"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <select
        className="h-10 min-w-36 rounded-lg border border-slate-300 bg-white px-4 text-sm font-medium shadow-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 sm:h-11 sm:min-w-60 sm:px-8"
        value={period}
        onChange={(event) => setPeriodIndex(periods.indexOf(event.target.value))}
        aria-label="Seleccionar periodo"
      >
        {periods.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <button
        className="rounded-full p-2 text-slate-700 hover:bg-white disabled:opacity-40"
        aria-label="Periodo siguiente"
        disabled={periodIndex === periods.length - 1}
        onClick={nextPeriod}
        type="button"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
