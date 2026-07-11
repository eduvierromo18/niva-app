"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import {
  NivaAlert,
  NivaBadge,
  NivaButton,
  NivaCard,
  NivaIconButton,
  NivaInput,
  NivaModal,
  NivaSelect,
  NivaSkeleton,
  NivaSwitch,
  NivaTabs,
  NivaTextarea,
} from "@/design-system";

const accountOptions = [
  { label: "Cuenta principal", value: "main" },
  { label: "Ahorro", value: "savings" },
  { label: "Credito", value: "credit" },
] as const;

export function NivaComponentLibraryExample() {
  const [enabled, setEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className="grid gap-6">
      <NivaCard className="grid gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <NivaButton iconLeft={<Plus className="h-4 w-4" />}>Nuevo movimiento</NivaButton>
          <NivaButton variant="secondary">Filtrar</NivaButton>
          <NivaButton variant="ghost">Cancelar</NivaButton>
          <NivaButton variant="danger">Eliminar</NivaButton>
          <NivaIconButton icon={<Search className="h-4 w-4" />} label="Buscar" />
        </div>
        <div className="flex flex-wrap gap-2">
          <NivaBadge tone="success">Pagado</NivaBadge>
          <NivaBadge tone="warning">Pendiente</NivaBadge>
          <NivaBadge tone="danger">Vencido</NivaBadge>
        </div>
      </NivaCard>

      <NivaCard className="grid gap-4">
        <NivaInput id="example-name" label="Nombre" placeholder="Renta mensual" />
        <NivaSelect id="example-account" label="Cuenta" options={[...accountOptions]} placeholder="Selecciona una cuenta" />
        <NivaTextarea id="example-notes" label="Notas" placeholder="Agrega contexto opcional" />
        <NivaSwitch checked={enabled} onCheckedChange={setEnabled} label="Recordatorio" description="Avisar antes del vencimiento" />
      </NivaCard>

      <NivaTabs
        label="Ejemplo de secciones"
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          { id: "overview", label: "Resumen", panel: <NivaAlert title="Estado estable">Todos los componentes usan tokens compartidos.</NivaAlert> },
          { id: "loading", label: "Carga", panel: <NivaSkeleton className="h-24 w-full" /> },
        ]}
      />

      <NivaButton variant="secondary" onClick={() => setModalOpen(true)}>
        Abrir modal
      </NivaButton>
      <NivaModal open={modalOpen} title="Confirmar cambio" description="Este patron conserva foco, Escape y retorno al disparador." onClose={() => setModalOpen(false)}>
        <p className="text-sm text-[var(--niva-color-muted)]">Contenido reutilizable compuesto con los mismos componentes del sistema.</p>
      </NivaModal>
    </section>
  );
}
