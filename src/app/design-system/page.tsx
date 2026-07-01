import {
  ArrowRight,
  Bell,
  CalendarDays,
  CreditCard,
  Edit3,
  Home,
  MoreHorizontal,
  Plus,
  Settings,
  TrendingUp,
  User,
  WalletCards,
} from "lucide-react";
import {
  AuroraAccountCard,
  AuroraAlert,
  AuroraBadge,
  AuroraBottomSheet,
  AuroraBreadcrumb,
  AuroraButton,
  AuroraCard,
  AuroraContainer,
  AuroraDatePicker,
  AuroraEmptyState,
  AuroraGoalCard,
  AuroraHero,
  AuroraIconButton,
  AuroraInput,
  AuroraInsightCard,
  AuroraLoading,
  AuroraModal,
  AuroraPagination,
  AuroraPills,
  AuroraSearch,
  AuroraSection,
  AuroraSelect,
  AuroraSidebar,
  AuroraSkeleton,
  AuroraStatCard,
  AuroraSurface,
  AuroraSwitch,
  AuroraTabs,
  AuroraTimelineCard,
  AuroraTopbar,
  auroraTokens,
} from "@/components/aurora";

const colorTokens = [
  ["Primary", auroraTokens.colors.primary, "bg-[#2563EB]"],
  ["Success", auroraTokens.colors.success, "bg-[#10B981]"],
  ["Warning", auroraTokens.colors.warning, "bg-[#F59E0B]"],
  ["Danger", auroraTokens.colors.danger, "bg-[#EF4444]"],
  ["Neutral 700", auroraTokens.colors.neutral700, "bg-[#374151]"],
  ["Neutral 500", auroraTokens.colors.neutral500, "bg-[#6B7280]"],
  ["Neutral 300", auroraTokens.colors.neutral300, "bg-[#D1D5DB]"],
  ["Neutral 100", auroraTokens.colors.neutral100, "bg-[#F3F4F6]"],
  ["White", auroraTokens.colors.white, "bg-white"],
];

const sidebarItems = [
  { href: "/design-system", label: "Resumen", icon: <Home className="h-4 w-4" />, active: true },
  { href: "/design-system", label: "Actividad", icon: <WalletCards className="h-4 w-4" /> },
  { href: "/design-system", label: "Analitica", icon: <TrendingUp className="h-4 w-4" /> },
  { href: "/design-system", label: "Metas", icon: <CreditCard className="h-4 w-4" /> },
];

function CatalogBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <AuroraSurface className="p-5">
      <h2 className="text-base font-bold uppercase tracking-tight text-[#111827]">{title}</h2>
      <div className="mt-5">{children}</div>
    </AuroraSurface>
  );
}

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] py-6 text-[#111827]">
      <AuroraContainer className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-6">
          <div className="rounded-[24px] border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_24px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#42D3FF] via-[#2563EB] to-[#7C3AED] text-2xl font-bold text-white">A</div>
              <div>
                <h1 className="text-[32px] font-bold leading-tight text-[#111827]">Aurora</h1>
                <p className="text-lg text-[#6B7280]">Design System v1.0</p>
              </div>
            </div>
            <p className="mt-8 text-sm leading-6 text-[#374151]">Sistema de diseno para Finanzas Personales. Moderno, limpio y enfocado en claridad.</p>
            <p className="mt-4 text-sm font-bold text-[#2563EB]">Claridad. Control. Confianza.</p>
          </div>

          <CatalogBlock title="1. Design Tokens">
            <div>
              <h3 className="text-sm font-bold text-[#111827]">Colores</h3>
              <div className="mt-4 grid grid-cols-3 gap-4">
                {colorTokens.map(([label, value, colorClass]) => (
                  <div key={label}>
                    <div className={`${colorClass} h-10 rounded-lg border border-[#E5E7EB] shadow-[0_4px_12px_rgba(0,0,0,0.06)]`} />
                    <p className="mt-2 text-[11px] font-bold text-[#111827]">{label}</p>
                    <p className="text-[10px] font-medium text-[#6B7280]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[#E5E7EB] pt-6">
              <h3 className="text-sm font-bold text-[#111827]">Tipografia</h3>
              <div className="mt-4 flex items-end gap-8">
                <p className="text-6xl font-bold text-[#111827]">Aa</p>
                <div className="space-y-1 text-xs text-[#374151]">
                  <p><strong>H1</strong> 32px / Bold</p>
                  <p><strong>H2</strong> 24px / Semi Bold</p>
                  <p><strong>H3</strong> 20px / Semi Bold</p>
                  <p><strong>Body 1</strong> 16px / Regular</p>
                  <p><strong>Body 2</strong> 14px / Regular</p>
                  <p><strong>Caption</strong> 12px / Medium</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-[#E5E7EB] pt-6">
              <h3 className="text-sm font-bold text-[#111827]">Espaciado, radios y sombras</h3>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[4, 8, 12, 16, 24, 32, 48, 64].map((value) => (
                  <div key={value} className="text-center">
                    <div className="mx-auto h-4 rounded bg-[#D1D5DB]" />
                    <p className="mt-2 text-[11px] font-medium text-[#374151]">{value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                {["4px", "8px", "12px", "20px", "24px", "32px"].map((value) => (
                  <div key={value} className="text-center">
                    <div className="mx-auto h-8 w-8 rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.10)]" />
                    <p className="mt-2 text-[11px] font-medium text-[#374151]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </CatalogBlock>
        </aside>

        <div className="space-y-2">
          <div className="grid gap-2 lg:grid-cols-[1fr_1.25fr]">
            <CatalogBlock title="2. Surfaces & Layout">
              <div className="grid gap-4 sm:grid-cols-3">
                <AuroraSurface className="p-5">
                  <h3 className="text-sm font-bold">Surface</h3>
                  <p className="mt-8 text-sm leading-6 text-[#374151]">Contenedor base para secciones y componentes.</p>
                </AuroraSurface>
                <AuroraCard title="Card">
                  <p className="text-sm leading-6 text-[#374151]">Contenedor elevado para agrupar informacion.</p>
                </AuroraCard>
                <AuroraSection title="Section">
                  <AuroraSurface className="p-4">
                    <p className="text-sm leading-6 text-[#374151]">Agrupa contenido con espaciado vertical.</p>
                  </AuroraSurface>
                </AuroraSection>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-[1.3fr_0.7fr]">
                <AuroraSurface className="p-5">
                  <h3 className="text-sm font-bold">Page Container</h3>
                  <div className="mt-4 rounded-xl bg-[#F3F4F6] p-4">
                    <div className="h-28 rounded-lg bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)]" />
                  </div>
                  <p className="mt-4 text-sm text-[#374151]">Ancho maximo 1200px con padding responsivo.</p>
                </AuroraSurface>
                <AuroraSurface className="p-5">
                  <h3 className="text-sm font-bold">Divider</h3>
                  <div className="my-8 h-px bg-[#E5E7EB]" />
                  <p className="text-sm leading-6 text-[#374151]">Separador sutil de secciones.</p>
                </AuroraSurface>
              </div>
            </CatalogBlock>

            <CatalogBlock title="3. Hero Components">
              <div className="grid gap-4 lg:grid-cols-[1fr_250px]">
                <AuroraHero greeting="Buenos dias, Eduardo" label="Tu dinero" value="$84,250" delta="+ 6.3% respecto al mes pasado" />
                <div className="space-y-3">
                  <AuroraHero className="p-4" variant="light" greeting="Tu dinero" label="" value="$84,250" delta="+ 6.3%" action={<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#2563EB]"><TrendingUp className="h-5 w-5" /></div>} />
                  <AuroraHero className="p-4" variant="dark" greeting="Tu dinero" label="" value="$84,250" delta="+ 6.3%" action={<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/15 text-white"><TrendingUp className="h-5 w-5" /></div>} />
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-[0.8fr_1.2fr]">
                <AuroraStatCard label="Ingresos" value="$18,450" delta="+8.4% vs mes pasado" trend="up" icon={<CreditCard className="h-4 w-4" />} />
                <div className="grid grid-cols-3 rounded-xl border border-[#E5E7EB] bg-white shadow-[0_4px_12px_rgba(0,0,0,0.06)]">
                  <div className="p-4 text-center"><p className="font-bold text-[#10B981]">+6.3%</p><p className="text-xs text-[#6B7280]">Aumento positivo</p></div>
                  <div className="border-x border-[#E5E7EB] p-4 text-center"><p className="font-bold text-[#EF4444]">-2.1%</p><p className="text-xs text-[#6B7280]">Disminucion</p></div>
                  <div className="p-4 text-center"><p className="font-bold text-[#6B7280]">0.0%</p><p className="text-xs text-[#6B7280]">Sin cambios</p></div>
                </div>
              </div>
            </CatalogBlock>
          </div>

          <div className="grid gap-2 lg:grid-cols-[1.7fr_0.8fr]">
            <CatalogBlock title="4. Data Components">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <AuroraStatCard label="Ingresos" value="$18,450" delta="+8.4% vs mes pasado" trend="up" icon={<CreditCard className="h-4 w-4" />} />
                <AuroraAccountCard institution="BBVA" account="**** 1234" balance="$12,650" meta="Cuenta de cheques" />
                <AuroraTimelineCard date="15 May" title="Amazon Mexico" description="Compras" amount="-$1,250" icon={<CreditCard className="h-4 w-4" />} />
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <AuroraBadge tone="info">Nuevo</AuroraBadge>
                    <AuroraBadge tone="warning">En progreso</AuroraBadge>
                    <AuroraBadge tone="success">Completado</AuroraBadge>
                    <AuroraBadge tone="danger">Cancelado</AuroraBadge>
                    <AuroraBadge>Neutral</AuroraBadge>
                  </div>
                </div>
              </div>
            </CatalogBlock>

            <CatalogBlock title="6. Form Components">
              <div className="space-y-5">
                <AuroraSearch placeholder="Buscar registros..." />
                <AuroraSelect label="Select" options={[{ label: "Selecciona una opcion", value: "" }, { label: "Cuenta BBVA", value: "bbva" }]} />
                <div className="grid grid-cols-2 gap-4">
                  <AuroraDatePicker label="Date Picker" defaultValue="2024-05-15" />
                  <div>
                    <p className="mb-3 text-sm font-semibold text-[#374151]">Toggle</p>
                    <AuroraSwitch checked label="Activo" />
                  </div>
                </div>
              </div>
            </CatalogBlock>
          </div>

          <div className="grid gap-2 lg:grid-cols-[1.5fr_0.9fr]">
            <CatalogBlock title="5. Actions">
              <div className="grid gap-6 lg:grid-cols-3">
                <div>
                  <h3 className="text-sm font-bold">Button Variants</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <AuroraButton>Primario</AuroraButton>
                    <AuroraButton variant="secondary">Secundario</AuroraButton>
                    <AuroraButton variant="ghost">Ghost</AuroraButton>
                    <AuroraButton variant="danger">Peligro</AuroraButton>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold">Icon Button</h3>
                  <div className="mt-4 flex gap-3">
                    <AuroraIconButton icon={<Plus className="h-4 w-4" />} label="Agregar" />
                    <AuroraIconButton icon={<Edit3 className="h-4 w-4" />} label="Editar" />
                    <AuroraIconButton icon={<MoreHorizontal className="h-4 w-4" />} label="Mas" />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold">Button Sizes</h3>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <AuroraButton size="lg">Grande</AuroraButton>
                    <AuroraButton size="md" variant="secondary">Mediano</AuroraButton>
                    <AuroraButton size="sm" variant="secondary">Pequeno</AuroraButton>
                  </div>
                </div>
              </div>
            </CatalogBlock>

            <CatalogBlock title="8. Overlays">
              <div className="grid gap-4 md:grid-cols-2">
                <AuroraModal title="Nuevo registro" preview>
                  <AuroraInput label="Descripcion" placeholder="Ej. Supermercado" />
                  <AuroraInput label="Monto" placeholder="$ 0.00" />
                </AuroraModal>
                <AuroraBottomSheet title="Nueva cuenta" action={<button className="text-sm font-bold text-[#2563EB]">Cancelar</button>}>
                  <div className="space-y-3 text-sm text-[#374151]">
                    <p className="flex items-center gap-2"><CreditCard className="h-4 w-4" /> Cuenta bancaria</p>
                    <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> Tarjeta de credito</p>
                    <p className="flex items-center gap-2"><WalletCards className="h-4 w-4" /> Efectivo</p>
                  </div>
                </AuroraBottomSheet>
              </div>
            </CatalogBlock>
          </div>

          <div className="grid gap-2 lg:grid-cols-[1.4fr_1fr]">
            <CatalogBlock title="7. Feedback & States">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-3">
                  <AuroraAlert tone="success" title="Exito" description="Tu registro fue guardado correctamente." />
                  <AuroraAlert tone="warning" title="Advertencia" description="Revisa la informacion antes de continuar." />
                  <AuroraAlert tone="danger" title="Error" description="No pudimos procesar tu solicitud." />
                  <AuroraAlert tone="info" title="Informacion" description="Aqui tienes informacion importante." />
                </div>
                <AuroraEmptyState title="Aun no hay registros" description="Comienza agregando tu primer registro." actionLabel="Crear registro" />
                <div className="space-y-4">
                  <AuroraSkeleton rows={5} />
                  <AuroraLoading />
                </div>
              </div>
            </CatalogBlock>

            <CatalogBlock title="Layout Components">
              <div className="grid gap-4 md:grid-cols-[220px_1fr]">
                <AuroraSidebar items={sidebarItems} className="min-h-[360px]" />
                <div className="space-y-4">
                  <AuroraTopbar title="Dashboard" subtitle="Vista principal" actions={<AuroraButton size="sm" icon={<ArrowRight className="h-4 w-4" />}>Nuevo</AuroraButton>} />
                  <AuroraGoalCard title="Fondo de emergencia" current="$33,150" target="$80,000" progress={42} />
                  <AuroraInsightCard title="Balance saludable" description="Tu balance mensual positivo cubre una parte relevante de gastos fijos." />
                </div>
              </div>
            </CatalogBlock>
          </div>

          <CatalogBlock title="9. Navigation Elements">
            <div className="grid gap-6 lg:grid-cols-4">
              <AuroraTabs tabs={["Resumen", "Actividad", "Analitica", "Metas", "Mas"]} active="Resumen" />
              <AuroraPills items={["Todos", "Ingresos", "Gastos", "Transferencias"]} active="Todos" />
              <AuroraBreadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Cuentas", href: "/accounts" }, { label: "Tarjeta BBVA" }]} />
              <AuroraPagination page={1} total={10} />
            </div>
          </CatalogBlock>

          <CatalogBlock title="10. Icon Style">
            <div className="flex flex-wrap items-center gap-5 text-[#6B7280]">
              {[Home, WalletCards, TrendingUp, ArrowRight, CreditCard, Bell, Settings, User].map((Icon, index) => (
                <Icon key={index} className="h-5 w-5 stroke-2" />
              ))}
              <span className="text-xs font-medium">Linea: 2px | Estilo: Redondeado | Consistencia: 24x24px</span>
            </div>
          </CatalogBlock>
        </div>
      </AuroraContainer>
    </main>
  );
}
