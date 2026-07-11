import { ChartPie, Gauge, ReceiptText, WalletCards } from "lucide-react";
import { NivaAppShell, NivaContentGrid, NivaLayoutSurface, NivaSection } from "@/design-system";

const exampleNavigation = [
  { title: "Inicio", href: "/dashboard", icon: Gauge, group: "primary" },
  { title: "Actividad", href: "/movements", icon: ReceiptText, group: "primary" },
  { title: "Cuentas", href: "/accounts", icon: WalletCards, group: "primary" },
  { title: "Analisis", href: "/categories", icon: ChartPie, group: "workspace" },
] as const;

export function NivaAppShellExample() {
  return (
    <NivaAppShell
      navigation={[...exampleNavigation]}
      brand={{ name: "Niva", description: "Finanzas personales" }}
      user={{ name: "Luis Eduvier Romo", initials: "LR" }}
      sidebarFooter={<NivaLayoutSurface variant="subtle" className="p-4 text-sm text-[var(--niva-color-muted)]">Estado financiero actualizado.</NivaLayoutSurface>}
    >
      <NivaSection title="Resumen" description="Ejemplo de composicion de layout sin crear una pagina de producto.">
        <NivaContentGrid columns={3}>
          <NivaLayoutSurface variant="card" className="h-24 p-4" />
          <NivaLayoutSurface variant="card" className="h-24 p-4" />
          <NivaLayoutSurface variant="card" className="h-24 p-4" />
        </NivaContentGrid>
      </NivaSection>
    </NivaAppShell>
  );
}
