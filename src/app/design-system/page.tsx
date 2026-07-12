import { NivaBrandLockup, NivaMark, NivaWordmark } from "@/components/brand/niva-brand";
import {
  NivaAlert,
  NivaBadge,
  NivaButton,
  NivaCard,
  NivaContentGrid,
  NivaInput,
  NivaLayoutSurface,
  NivaPageContainer,
  NivaProgress,
  NivaSection,
} from "@/design-system";

const colorTokens = [
  { name: "Canvas", token: "--niva-color-background", value: "#FAFBFC" },
  { name: "Superficie", token: "--niva-color-surface", value: "#FFFFFF" },
  { name: "Tinta", token: "--niva-color-foreground", value: "#111827" },
  { name: "Texto", token: "--niva-color-body", value: "#1F2937" },
  { name: "Silenciado", token: "--niva-color-muted", value: "#6B7280" },
  { name: "Borde", token: "--niva-color-border", value: "#E5E7EB" },
  { name: "Evergreen", token: "--niva-color-accent", value: "#1E7A4E" },
  { name: "Lavado", token: "--niva-color-accent-surface", value: "#DCEFE4" },
] as const;

const radiusTokens = [
  { name: "8", value: "var(--niva-radius-md)" },
  { name: "12", value: "var(--niva-radius-lg)" },
  { name: "18", value: "var(--niva-radius-xl)" },
  { name: "22", value: "var(--niva-radius-2xl)" },
  { name: "26", value: "var(--niva-radius-3xl)" },
] as const;

export default function DesignSystemPage() {
  return (
    <main className="min-h-screen bg-[var(--niva-color-background)] py-10 text-[var(--niva-color-body)] sm:py-14">
      <NivaPageContainer className="space-y-16">
        <header className="border-b border-[var(--niva-color-border)] pb-10">
          <NivaBrandLockup />
          <p className="mt-10 font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-accent)]">
            Design System v4
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.035em] text-[var(--niva-color-foreground)] sm:text-5xl">
            Claridad financiera, sin ruido.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--niva-color-muted)]">
            Catálogo activo de fundamentos y componentes de Niva. Design Manual v4 gobierna el producto; Meridian gobierna únicamente la marca.
          </p>
        </header>

        <NivaSection>
          <p className="font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-muted)]">01 · Marca</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--niva-color-foreground)]">Meridian por superficie</h2>
          <NivaContentGrid columns={2} className="mt-6">
            <NivaLayoutSurface className="p-7">
              <p className="text-xs font-semibold text-[var(--niva-color-muted)]">Fondo claro</p>
              <div className="mt-8 flex items-center gap-4">
                <NivaMark className="h-14 w-14" />
                <NivaWordmark className="text-4xl" />
              </div>
            </NivaLayoutSurface>
            <div className="rounded-[var(--niva-radius-xl)] bg-[var(--niva-color-inverse-surface)] p-7 text-[var(--niva-color-inverse-foreground)]">
              <p className="text-xs font-semibold text-[var(--niva-color-inverse-muted)]">Fondo oscuro</p>
              <div className="mt-8 flex items-center gap-4">
                <NivaMark tone="dark" className="h-14 w-14" />
                <NivaWordmark inverse className="text-4xl" />
              </div>
            </div>
          </NivaContentGrid>
        </NivaSection>

        <NivaSection>
          <p className="font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-muted)]">02 · Color</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[var(--niva-color-foreground)]">Producto frío y sereno</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {colorTokens.map((color) => (
              <NivaCard key={color.token} className="p-4">
                <div className="h-20 rounded-[var(--niva-radius-lg)] border border-[var(--niva-color-border)]" style={{ background: color.value }} />
                <p className="mt-4 text-sm font-semibold text-[var(--niva-color-foreground)]">{color.name}</p>
                <p className="mt-1 font-[family-name:var(--font-niva-mono)] text-[11px] text-[var(--niva-color-muted)]">{color.value}</p>
              </NivaCard>
            ))}
          </div>
        </NivaSection>

        <NivaSection>
          <p className="font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-muted)]">03 · Tipografía</p>
          <NivaContentGrid columns={3} className="mt-6">
            <NivaLayoutSurface className="p-6">
              <p className="text-xs font-semibold text-[var(--niva-color-muted)]">Inter · producto</p>
              <p className="mt-5 text-3xl font-semibold text-[var(--niva-color-foreground)]">Dinero claro</p>
              <p className="mt-3 text-sm leading-6 text-[var(--niva-color-muted)]">Lectura cotidiana y controles.</p>
            </NivaLayoutSurface>
            <NivaLayoutSurface className="p-6">
              <p className="text-xs font-semibold text-[var(--niva-color-muted)]">Manrope · display</p>
              <p className="mt-5 font-[family-name:var(--font-niva-display)] text-3xl font-bold tracking-[-0.035em] text-[var(--niva-color-foreground)]">84,250</p>
              <p className="mt-3 text-sm leading-6 text-[var(--niva-color-muted)]">Títulos y cifras principales.</p>
            </NivaLayoutSurface>
            <NivaLayoutSurface className="p-6">
              <p className="text-xs font-semibold text-[var(--niva-color-muted)]">IBM Plex Mono · etiqueta</p>
              <p className="mt-5 font-[family-name:var(--font-niva-mono)] text-xs font-medium uppercase tracking-[0.14em] text-[var(--niva-color-accent)]">Disponible hoy</p>
              <p className="mt-3 text-sm leading-6 text-[var(--niva-color-muted)]">Eyebrows, fechas e identificadores.</p>
            </NivaLayoutSurface>
          </NivaContentGrid>
        </NivaSection>

        <NivaSection>
          <p className="font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-muted)]">04 · Forma</p>
          <div className="mt-6 flex flex-wrap gap-4">
            {radiusTokens.map((radius) => (
              <div key={radius.name} className="grid place-items-center gap-3">
                <div className="h-20 w-24 border border-[var(--niva-color-border)] bg-[var(--niva-color-surface)] shadow-[var(--niva-shadow-sm)]" style={{ borderRadius: radius.value }} />
                <span className="font-[family-name:var(--font-niva-mono)] text-[11px] text-[var(--niva-color-muted)]">{radius.name}px</span>
              </div>
            ))}
          </div>
        </NivaSection>

        <NivaSection>
          <p className="font-[family-name:var(--font-niva-mono)] text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--niva-color-muted)]">05 · Componentes</p>
          <NivaLayoutSurface className="mt-6 p-6 sm:p-8">
            <div className="flex flex-wrap gap-3">
              <NivaButton>Acción principal</NivaButton>
              <NivaButton variant="secondary">Secundaria</NivaButton>
              <NivaButton variant="ghost">Discreta</NivaButton>
              <NivaButton variant="danger">Revisar</NivaButton>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <NivaBadge tone="accent">Activo</NivaBadge>
              <NivaBadge tone="success">Al día</NivaBadge>
              <NivaBadge tone="warning">Atención</NivaBadge>
              <NivaBadge tone="info">Información</NivaBadge>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <NivaInput id="sample-name" label="Nombre" placeholder="Ej. Fondo de emergencia" />
              <NivaInput id="sample-amount" label="Cantidad" placeholder="$0.00" inputMode="decimal" />
            </div>
            <NivaProgress className="mt-8" value={64} label="Progreso de ejemplo" />
            <NivaAlert className="mt-8" title="Lectura tranquila" tone="info">
              El significado se comunica con texto, jerarquía y signo; el color acompaña.
            </NivaAlert>
          </NivaLayoutSurface>
        </NivaSection>
      </NivaPageContainer>
    </main>
  );
}
