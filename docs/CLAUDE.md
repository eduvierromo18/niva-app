# Niva — contexto del proyecto para Claude Code

> Este archivo se carga automáticamente por Claude Code al trabajar en este
> repo. Última actualización: basado en handoff técnico verificado en código
> el 2026-07-13. Mantenlo al día — es más barato editar esto que repetir
> contexto en cada sesión.

## Qué es Niva

App de finanzas personales. Repo: `niva-app` (Next.js App Router). Tono de
marca: calma y claridad, no ansiedad financiera. Frase ancla: **"Tu dinero,
con calma."**

El modelo mental central del producto es **Disponible vs. Reservado** (no un
balance crudo). Toda función nueva debería respetar esta separación en vez de
mezclar cifras.

**Documentación de producto ya existente en el repo**: la carpeta `docs/`
contiene handbook, gobernanza, UX y releases. Léela directamente antes de
asumir contexto de producto — no dupliques ese contenido aquí.

## Stack

- Next.js `^15.5.19` (App Router), React `^19.2.7`, TypeScript
- Tailwind CSS 4 (`@import "tailwindcss"` + `@theme inline` en `globals.css`;
  no hay `tailwind.config.*`)
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`) como fuente de datos real
- `recharts` para gráficas, `lucide-react` para iconos, `vitest` para tests
- Paquetes: npm (`package-lock.json`)

**Scripts**: `npm run dev` · `npm run build` · `npm run start` ·
`npm run lint` · `npm test` (vitest) · `npm run typecheck`

**Variables de entorno** (`.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

**Supabase**: proyecto vinculado `aowzjfixyelpjudkfwnw` (`finanzas-personales`).
Schema y migraciones en `supabase/schema.sql` y `supabase/migrations/*`.

**CI**: `.github/workflows/ci.yml` corre lint + typecheck + test + build en
push/PR a `main` con Node 22. No hay `vercel.json` ni `.vercel/project.json`
versionado — el deploy depende de configuración externa de Vercel/GitHub.

## Estructura de carpetas

- `src/app` — rutas App Router. `(auth)` para login/signup, `(app)` para
  pantallas privadas, `design-system/page.tsx` como catálogo visual.
- `src/components/screens` — pantallas desktop, una por módulo
  (`*-screen.tsx`).
- `src/components/mobile/niva-mobile-experience.tsx` — **toda** la experiencia
  mobile vive en este único archivo grande (candidato a refactor: dividir por
  pantalla).
- `src/components/ui` — primitivos genéricos (`Button`, `Card`, `Dialog`,
  `Badge`, `Progress`).
- `src/design-system/components` — componentes propios con prefijo `Niva*`
  (`NivaButton`, `NivaCard`, `NivaModal`, `NivaTabs`, etc.) — **usar esta capa
  para UI nueva**, no la de `aurora`.
- `src/components/aurora` — sistema legacy/experimental, prefijo `Aurora*`.
  No usar para código nuevo; candidato a limpieza/remoción.
- `src/hooks` — `use-accounts`, `use-movements`, `use-planning-data` (data
  fetching real contra Supabase).
- `src/lib` — utilidades, mapeadores, tipos UI, cálculos (incl.
  `analytics.ts`), navegación, clientes Supabase.
- `src/types/database.ts` — tipos de Supabase.
- `supabase/` — schema, migraciones.

No hay Redux/Zustand/Context global — el estado vive en `useState`/hooks
locales por componente/pantalla.

## Sistema de diseño y tokens (usar estos, no inventar nuevos)

Fuentes de verdad:
- Tokens TypeScript: `src/design/tokens/*` (agregados en
  `src/design/tokens/index.ts`)
- Expuestos a design-system: `src/design-system/tokens.ts`
- CSS variables: `src/app/globals.css` (prefijo `--niva-*`)

**Color** — `semantic`: `background #FAFBFC` · `foreground #111827` ·
`body #1F2937` · `muted #6B7280` · `border #E5E7EB` · `accent #1E7A4E` ·
`accentHover #186640` · `success #1E7A4E` · `warning #6B7280` ·
`danger #454B57` · `info #5B6472`. Escalas completas `neutral` y `green`
disponibles en `src/design/tokens`.

**Tipografía** — `Inter` (sans/UI), `Manrope` (display/headings),
`IBM Plex Mono` (eyebrow, tracking 0.14em), `Archivo` (brand). Tamaños de
`xs` (0.6875rem) a `4xl` (3rem).

**Forma** — radios `sm` 0.5rem a `3xl` 1.625rem, `full` 9999px. Sombras
`xs` a `lg`, más `focus` con ring de acento.

**Motion** — `duration.fast` 120ms / `base` 180ms / `slow` 260ms,
`easing.standard` `cubic-bezier(0.2,0,0,1)`.

**Componentes**: usar `src/design-system/components` (`Niva*`) para todo lo
nuevo. Los primitivos de `src/components/ui` son la capa base sobre la que
se construyen. No tocar ni extender `aurora`.

## Navegación

**Estructura acordada** (tab bar mobile): Inicio / Actividad / Nuevo registro
/ Análisis / Cuentas, con Objetivos y Programados como sub-secciones.

**Estado real en código**:
- Tab bar mobile coincide en los 5 principales (`src/components/mobile/niva-mobile-experience.tsx`).
- Objetivos, Programados, Presupuestos, Deudas y Configuración **no tienen
  jerarquía visual única** — todos viven mezclados dentro de un sheet de
  "Más opciones" (botón flotante). Esto es una divergencia pendiente de
  resolver, no solo una simplificación temporal.
- Desktop usa sidebar definido en `src/lib/navigation.ts`: Inicio
  (`/dashboard`), Actividad (`/movements`), Cuentas (`/accounts`),
  Programados (`/programados`), Análisis (`/categories`), Objetivos
  (`/goals`).

## Rutas y su estado real (no asumir "completo" sin verificar aquí)

| Ruta | Desktop | Mobile | Datos |
|---|---|---|---|
| `/dashboard` | Parcial real, sin loading/error de hooks | Parcial real, con loading/error/empty | Supabase |
| `/movements` | Funcional real | Funcional real | Supabase |
| `/accounts` | Funcional real | Funcional real | Supabase |
| `/goals` | Parcial real, sin empty explícito | Parcial real | Supabase |
| `/programados` | Parcial real, sin loading visible | Funcional real | Supabase + RPC `confirm_scheduled_transaction` |
| `/budgets` | Parcial real, sin empty explícito | Parcial real | Supabase (con bug de categoría, ver abajo) |
| `/liabilities` | Parcial real, sin empty explícito | Parcial real | Supabase |
| `/categories` (Análisis) | Real con loading/error (tabs secundarias y botón Exportar aún placeholder) | Real, misma fuente compartida | Supabase (`monthly_financial_summary` + movimientos, vía `lib/analytics.ts`) |
| `/settings` | Parcial real | Parcial real | Supabase (perfil + auth) |

## Modelo de datos (tablas reales en Supabase)

`profiles`, `accounts`, `account_balances` (view), `categories`, `movements`,
`monthly_budgets`, `savings_goals`, `liabilities`, `scheduled_transactions`,
`user_invitations`. Ver `src/types/database.ts` para campos exactos antes de
asumir un shape.

Enums clave: `account_type` (`cash`, `checking`, `savings`, `credit_card`,
`loan`, `investment`, `other`) · `liability_type` (`credit_card`, `loan`,
`personal_debt`, `other`) · `movement_type` (`income`, `expense`,
`transfer`).

## Deuda técnica conocida — resolver antes o junto con features nuevas

1. **Encoding roto**: mojibake en el código fuente (`AnalÃ­tica`, `NÃ³mina`,
   `ContraseÃ±a`, etc.) y mezcla inglés/español en Movements.
2. **Mobile concentrado en un archivo**: `niva-mobile-experience.tsx` mezcla
   muchas pantallas y helpers — dividir por pantalla facilita mantenerlo.
3. **`useMovements` siembra categorías por defecto desde el cliente** cuando
   no existen — mezcla inicialización de datos con carga de pantalla.
4. **Sin importación CSV/Excel, sin OCR de tickets, sin integración bancaria
   real (Plaid/Belvo/Open Finance)** — si alguna función nueva asume esto,
   confirmar que no existe antes de construir sobre ello.
5. **`DashboardScreen` nunca renderiza `useMovements().error`**: llama
   `useMovements()` sin destructurar `error` y no lo muestra en ningún lado
   (a diferencia de `movements-screen.tsx`, que sí lo hace vía `NivaAlert`).
   Cualquier registro creado desde el quick-add del Dashboard que falle en
   el servidor (cuenta inválida, RPC de MSI rechazado, etc.) falla en
   silencio — el diálogo se queda abierto sin explicación.

## Estados obligatorios en toda función nueva

Loading, vacío y error — varias pantallas existentes hoy no los tienen todos
(ver tabla de rutas). No repetir ese hueco en pantallas nuevas.

## Roadmap — actualizado según lo que ya existe

Ya no es "construir Deudas/Ahorros desde cero" — ya existen como
`/liabilities`, `/budgets`, `/goals` con datos reales pero parciales.
Orden recomendado:

1. **Arreglar deuda técnica de datos** (fecha hardcodeada, bug de categoría
   en budgets, consolidar cálculos duplicados) — bajo esfuerzo, alto impacto,
   evita construir features nuevas sobre una base inconsistente.
2. **Completar estados faltantes** en Goals/Budgets/Liabilities desktop
   (empty states) y dar a Análisis/Categorías loading/error propio.
3. **Migrar Análisis/Categorías de mock a datos reales de Supabase** —
   actualmente es la superficie más "de mentiras" de la app.
4. **Resolver la jerarquía de navegación**: sacar Objetivos/Programados/
   Presupuestos/Deudas/Configuración del cajón único de "Más opciones" y
   darles una estructura clara (tabs secundarios, secciones dentro de
   Cuentas, etc. — decidir con mockup si el patrón visual es nuevo).
5. **Funciones genuinamente nuevas** (una vez lo anterior esté sólido):
   simulador de pago de deuda sobre `/liabilities`, patrimonio neto
   histórico (gráfica de tendencia), score de salud financiera. Estas sí
   introducen patrones visuales nuevos — mockup corto antes de codear.

## Convenciones de trabajo con Claude Code

- Leer `docs/` antes de asumir contexto de producto/handbook.
- Antes de escribir código, verificar el estado real de la ruta en la tabla
  de arriba — no asumir que algo está "completo" porque la ruta existe.
- Usar `src/design-system/components` (`Niva*`) para UI nueva, no `aurora`.
- No modificar el layout de escritorio al tocar mobile, y viceversa.
- Si una función toca disponible/reservado/KPIs, resolver primero la
  duplicación de cálculos entre desktop y mobile en vez de agregar un tercer
  cálculo paralelo.
- Confirmar con el usuario el enfoque antes de generar múltiples archivos
  nuevos de una vez.
