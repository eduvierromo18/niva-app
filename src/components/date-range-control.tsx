"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { NivaIconButton } from "@/design-system";

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
    <div className="flex items-center justify-center gap-2">
      <NivaIconButton
        icon={<ChevronLeft className="h-4 w-4" />}
        label="Periodo anterior"
        variant="ghost"
        size="sm"
        disabled={periodIndex === 0}
        onClick={previousPeriod}
      />
      <select
        className="h-10 min-w-40 rounded-[var(--niva-radius-md)] border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] px-4 text-sm font-medium text-[var(--niva-color-foreground)] shadow-[var(--niva-shadow-xs)] outline-none focus:border-[var(--niva-color-accent)] focus:ring-2 focus:ring-[var(--niva-color-accent-surface)] sm:min-w-52"
        value={period}
        onChange={(event) => setPeriodIndex(periods.indexOf(event.target.value))}
        aria-label="Seleccionar periodo"
      >
        {periods.map((item) => (
          <option key={item}>{item}</option>
        ))}
      </select>
      <NivaIconButton
        icon={<ChevronRight className="h-4 w-4" />}
        label="Periodo siguiente"
        variant="ghost"
        size="sm"
        disabled={periodIndex === periods.length - 1}
        onClick={nextPeriod}
      />
    </div>
  );
}
