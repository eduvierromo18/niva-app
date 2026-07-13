# Niva - resumen tecnico de estado actual

Fecha de inspeccion: 2026-07-13  
Repo inspeccionado: `C:\Users\edu30\NIVA\05_Development\Frontend\niva-app`

Este documento resume lo que existe en el codigo actual. No asume piezas externas no visibles en el repositorio.

## 1. Stack y arquitectura general

### Framework, version y gestor de paquetes

- Framework: Next.js con App Router.
- Versiones declaradas en `package.json`:
  - `next`: `^15.5.19`
  - `react`: `^19.2.7`
  - `react-dom`: `^19.2.7`
  - `typescript`: `latest`
  - `tailwindcss`: `latest`
  - `@tailwindcss/postcss`: `^4.3.1`
  - `@supabase/ssr`: `0.12.0`
  - `@supabase/supabase-js`: `2.108.2`
  - `recharts`: `latest`
  - `lucide-react`: `latest`
  - `vitest`: `^4.1.10`
- Gestor de paquetes: npm. Existe `package-lock.json`.
- Scripts:
  - `npm run dev`: `next dev`
  - `npm run build`: `next build`
  - `npm run start`: `next start`
  - `npm run lint`: `eslint .`
  - `npm test`: `vitest run`
  - `npm run typecheck`: `tsc --noEmit`

### Estructura de carpetas

- `src/app`: rutas App Router, layouts, acciones server y route handlers.
  - `(auth)`: login, signup, check-email, setup-auth.
  - `(app)`: layout autenticado y pantallas privadas.
  - `api/admin/users/route.ts`: route handler administrativo actualmente deshabilitado.
  - `design-system/page.tsx`: catalogo visual.
  - `globals.css`: Tailwind import, fuentes, variables CSS y reglas globales.
  - `layout.tsx`, `page.tsx`, `manifest.ts`, `global-error.tsx`.
- `src/components`: componentes de producto.
  - `auth`: tarjeta login/signup.
  - `brand`: marca Niva.
  - `dashboard`: componentes de dashboard.
  - `finance`: dialogos, tablas, filtros, cards financieras y estados base.
  - `layout`: `AppShell`.
  - `mobile`: experiencia movil iOS-like en un componente grande.
  - `screens`: pantallas desktop por modulo.
  - `ui`: primitivos base simples (`button`, `card`, `dialog`, `badge`, `progress`).
  - `aurora`: sistema interno Aurora todavia presente.
- `src/design`: tokens base en TypeScript.
- `src/design-system`: componentes Niva reutilizables, layout primitives, exports y tokens derivados.
- `src/hooks`: hooks cliente para datos financieros (`use-accounts`, `use-movements`, `use-planning-data`).
- `src/lib`: utilidades, mapeadores, tipos UI, calculos de dashboard/cuentas, navegacion, datos mock/hardcodeados y clientes Supabase.
- `src/types`: tipos generados/manuales de Supabase en `database.ts`.
- `src/config`: catalogo de bancos.
- `docs`: documentacion de producto, handbook, gobernanza, UX y releases.
- `supabase`: schema, migraciones y SQL de referencia.
- `public`: assets estaticos, incluyendo fuentes.

### Data fetching

- La app usa Supabase como fuente real para la mayoria de datos financieros.
- Cliente browser:
  - `src/lib/supabase/client.ts` crea `createBrowserClient<Database>()`.
  - Requiere `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Cliente server:
  - `src/lib/supabase/server.ts` crea `createServerClient<Database>()`.
  - Usa cookies de Next via `next/headers`.
- Middleware:
  - `src/middleware.ts` protege rutas privadas, redirige a `/login` sin usuario y a `/setup-auth` si faltan variables de Supabase.
- Server Components / Server Actions:
  - `src/app/(app)/layout.tsx` obtiene usuario y perfil desde Supabase en servidor.
  - `src/app/(auth)/login/actions.ts` usa `supabase.auth.signInWithPassword`.
  - `src/app/(auth)/signup/actions.ts` usa `supabase.auth.signUp`.
  - `src/app/(auth)/check-email/actions.ts` reenvia confirmacion.
  - `src/app/(app)/actions.ts` contiene sign out.
- Hooks cliente:
  - `useAccounts`: consulta `account_balances`; muta `accounts`.
  - `useMovements`: consulta/siembra `categories`, consulta `account_balances` y `movements`; muta `movements`.
  - `usePlanningData`: consulta `monthly_budgets`, `category_spending_summary`, `savings_goals`, `liabilities`, `scheduled_transactions`, `account_balances`, `categories`; muta presupuestos, metas, deudas y programados.
- API routes propias:
  - Solo existe `POST /api/admin/users`, pero devuelve `403` con mensaje de invitaciones deshabilitadas.
- Datos mock/locales:
  - `src/lib/finance-data.ts` contiene cuentas, metricas, categorias, series, movimientos, presupuestos, metas, deudas y programados hardcodeados.
  - Actualmente se usa en analytics desktop y parte de analytics/home movil para metricas base, deltas o fallback visual.
- No vi llamadas a APIs externas distintas de Supabase.

### Manejo de estado

- No hay Redux, Zustand ni Context global propio.
- El estado UI vive con `useState`, `useMemo`, `useEffect`, `useCallback` dentro de hooks y componentes.
- Los datos remotos se mantienen en estado local de hooks cliente:
  - `accounts`, `movements`, `categories`, `budgets`, `goals`, `liabilities`, `scheduled`.
- La shell mobile mantiene estado local para lock visual, sheets, dialogos, item en edicion y tema oscuro del home.

## 2. Sistema de estilos y design tokens

### Donde viven los tokens

- Tokens TypeScript: `src/design/tokens/*`.
- Agregador TS: `src/design/tokens/index.ts`.
- Tokens expuestos al design-system: `src/design-system/tokens.ts`.
- Variables CSS globales: `src/app/globals.css`.
- Tailwind: se usa Tailwind CSS 4 con `@import "tailwindcss"` y `@theme inline` en `globals.css`. No encontre `tailwind.config.*`.

### Tokens TypeScript existentes

#### `colors`

- `white`: `#FFFFFF`
- `black`: `#111827`
- `transparent`: `transparent`
- `neutral`: `0 #FFFFFF`, `50 #FAFBFC`, `100 #F3F4F6`, `200 #E5E7EB`, `300 #C3C8D0`, `400 #9CA3AF`, `500 #6B7280`, `600 #5B6472`, `700 #454B57`, `800 #1F2937`, `900 #111827`
- `green`: `50 #F3F8F5`, `100 #DCEFE4`, `200 #B9DEC9`, `300 #8FC7A7`, `400 #57A77A`, `500 #1E7A4E`, `600 #186640`, `700 #145536`, `800 #10442B`, `900 #0C3421`
- `semantic`: `background #FAFBFC`, `foreground #111827`, `body #1F2937`, `muted #6B7280`, `placeholder #9CA3AF`, `border #E5E7EB`, `accent #1E7A4E`, `accentHover #186640`, `accentSurface #DCEFE4`, `accentForeground #FFFFFF`, `success #1E7A4E`, `warning #6B7280`, `danger #454B57`, `info #5B6472`
- `brand`: `ultramarine #27409A`, `ultramarineLift #6E8AD6`, `knockout #FCFCFD`

#### `spacing`

- `0`: `0`
- `1`: `0.25rem`
- `2`: `0.5rem`
- `3`: `0.75rem`
- `4`: `1rem`
- `5`: `1.25rem`
- `6`: `1.5rem`
- `8`: `2rem`
- `10`: `2.5rem`
- `12`: `3rem`
- `16`: `4rem`
- `20`: `5rem`
- `24`: `6rem`
- `32`: `8rem`

#### `radius`

- `none`: `0`
- `sm`: `0.5rem`
- `md`: `0.5rem`
- `lg`: `0.75rem`
- `xl`: `1.125rem`
- `2xl`: `1.375rem`
- `3xl`: `1.625rem`
- `full`: `9999px`

#### `shadows`

- `none`: `none`
- `xs`: `0 1px 2px rgb(16 24 40 / 0.04)`
- `sm`: `0 4px 12px rgb(16 24 40 / 0.06)`
- `md`: `0 12px 24px rgb(16 24 40 / 0.08)`
- `lg`: `0 24px 48px rgb(16 24 40 / 0.10)`
- `focus`: `0 0 0 3px rgb(30 122 78 / 0.18)`

#### `motion`

- `duration.instant`: `0ms`
- `duration.fast`: `120ms`
- `duration.base`: `180ms`
- `duration.slow`: `260ms`
- `easing.standard`: `cubic-bezier(0.2, 0, 0, 1)`
- `easing.entrance`: `cubic-bezier(0, 0, 0.2, 1)`
- `easing.exit`: `cubic-bezier(0.4, 0, 1, 1)`
- `transition.colors`: color/background/border transition de `180ms`
- `transition.surface`: box-shadow/transform transition de `180ms`

#### `typography`

- `fontFamily.sans`: `"Inter", ui-sans-serif, system-ui, sans-serif`
- `fontFamily.display`: `"Manrope", "Inter", ui-sans-serif, system-ui, sans-serif`
- `fontFamily.mono`: `"IBM Plex Mono", ui-monospace, monospace`
- `fontFamily.brand`: `"Archivo", "Inter", ui-sans-serif, system-ui, sans-serif`
- `fontWeight`: `light 300`, `regular 400`, `medium 500`, `semibold 600`, `bold 700`
- `fontSize`: `xs 0.6875rem`, `sm 0.8125rem`, `md 0.9375rem`, `lg 1.125rem`, `xl 1.375rem`, `2xl 1.75rem`, `3xl 2.25rem`, `4xl 3rem`
- `lineHeight`: `tight 1.08`, `snug 1.3`, `normal 1.55`, `relaxed 1.7`
- `letterSpacing`: `display -0.035em`, `heading -0.025em`, `normal 0`, `eyebrow 0.14em`
- `textStyle`: `display`, `h1`, `h2`, `h3`, `body`, `bodySmall`, `label`, `eyebrow`

#### `surfaces`

- `app`: background/foreground desde semantic.
- `panel`: white background, semantic border, `radius.lg`, no shadow.
- `card`: white background, semantic border, `radius.xl`, `shadow.xs`.
- `elevatedCard`: white background, semantic border, `radius.xl`, `shadow.sm`.
- `subtle`: neutral 100 background, neutral 200 border, `radius.lg`, no shadow.

### Variables CSS existentes en `:root`

- Fuentes: `--font-niva-sans`, `--font-niva-display`, `--font-niva-mono`, `--font-niva-brand`
- Base: `--background`, `--foreground`, `--surface`
- Color producto: `--niva-color-background`, `--niva-color-foreground`, `--niva-color-body`, `--niva-color-surface`, `--niva-color-border`, `--niva-color-muted`, `--niva-color-muted-surface`, `--niva-color-placeholder`, `--niva-color-ring`, `--niva-color-accent`, `--niva-color-accent-hover`, `--niva-color-accent-foreground`, `--niva-color-accent-surface`, `--niva-color-success`, `--niva-color-success-surface`, `--niva-color-warning`, `--niva-color-warning-surface`, `--niva-color-danger`, `--niva-color-danger-surface`, `--niva-color-danger-surface-strong`, `--niva-color-info`, `--niva-color-info-surface`, `--niva-color-neutral-300`, `--niva-color-overlay`, `--niva-color-inverse-surface`, `--niva-color-inverse-foreground`, `--niva-color-inverse-muted`, `--niva-color-inverse-subtle`
- Color cuentas: `--niva-account-background`, `--niva-account-surface`, `--niva-account-subtle`, `--niva-account-border`, `--niva-account-foreground`, `--niva-account-muted`, `--niva-account-positive`, `--niva-account-positive-surface`, `--niva-account-positive-border`, `--niva-account-review`, `--niva-account-review-surface`, `--niva-account-review-border`
- Radius: `--niva-radius-md`, `--niva-radius-lg`, `--niva-radius-xl`, `--niva-radius-2xl`, `--niva-radius-3xl`, `--niva-radius-full`
- Sombras: `--niva-shadow-xs`, `--niva-shadow-sm`, `--niva-shadow-md`, `--niva-shadow-xl`
- Motion: `--niva-motion-base`, `--niva-ease-standard`

### Convencion de componentes

- Hay dos capas reutilizables:
  - `src/components/ui`: primitivos genericos con nombres simples (`Button`, `Card`, `Dialog`, `Badge`, `Progress`).
  - `src/design-system/components`: componentes Niva con prefijo `Niva*` (`NivaButton`, `NivaInput`, `NivaSelect`, `NivaCard`, `NivaModal`, `NivaTabs`, `NivaSwitch`, etc.).
- Existe una tercera capa interna legacy/experimental `src/components/aurora` con prefijo `Aurora*`.
- Las pantallas desktop viven como `src/components/screens/*-screen.tsx`.
- La experiencia mobile vive casi toda en `src/components/mobile/niva-mobile-experience.tsx`; no esta dividida por pantalla.

## 3. Vistas implementadas hasta hoy

### Rutas existentes

| Ruta | Superficie | Estado | Datos | Estados implementados |
| --- | --- | --- | --- | --- |
| `/` | Publica | Completa como redirect | No consulta datos; `src/app/page.tsx` redirige a `/dashboard` | No aplica |
| `/login` | Auth desktop/mobile responsive | Parcial real | Supabase Auth `signInWithPassword` | Error por query param; no loading submit explicito |
| `/signup` | Auth desktop/mobile responsive | Parcial real | Supabase Auth `signUp` | Error por query param; no loading submit explicito |
| `/check-email` | Auth | Parcial real | Reenvio Supabase Auth | Error y exito por query params; no loading |
| `/setup-auth` | Auth/config | Estatica | Sin datos; muestra variables faltantes | Sin loading/error dinamico |
| `/dashboard` | Desktop | Parcial real | Supabase via `useMovements`, `useAccounts`, `usePlanningData` | No usa loading/error de hooks en desktop; tiene empty para meta principal si no hay meta |
| `/movements` | Desktop | Funcional real | Supabase `movements`, `categories`, `account_balances` | Error alert; loading se muestra como empty state "Cargando actividad"; empty cuando no hay registros/filtros |
| `/accounts` | Desktop | Funcional real | Supabase `account_balances`, `accounts`; tambien lee movimientos para ultima actividad | Loading skeleton; error alert; empty cuando no hay cuentas |
| `/goals` | Desktop | Parcial real | Supabase `savings_goals` | Loading texto; error bloque; no empty explicito cuando no hay metas |
| `/programados` | Desktop | Parcial real | Supabase `scheduled_transactions` + RPC `confirm_scheduled_transaction` | Error bloque; empty por seccion; no loading visible aunque el hook lo tiene |
| `/budgets` | Desktop | Parcial real | Supabase `monthly_budgets`, `category_spending_summary`, `categories` | Loading texto; error bloque; no empty explicito |
| `/liabilities` | Desktop | Parcial real | Supabase `liabilities` | Loading texto; error bloque; no empty explicito |
| `/categories` | Desktop | Solo estatica/mock | `finance-data.ts` para metricas, charts y tabla | No loading/error; tabs locales; export solo cambia mensaje local |
| `/settings` | Desktop | Parcial real | Server fetch de perfil; update a `profiles`; `auth.updateUser`; signOut | Success/error de guardado; no loading inicial |
| `/design-system` | Publica/estatica | Estatica | Tokens/brand hardcodeados | No loading/error |
| `/api/admin/users` | API | Deshabilitada | Sin datos; devuelve `403` | No aplica |

### Mobile

La mobile app se activa en `AppShell` cuando `window.matchMedia("(max-width: 767px)")` coincide y la ruta esta en `mobileRoutes`.

Rutas mobile soportadas en `mobileRoutes`:

- `/dashboard`
- `/movements`
- `/categories`
- `/accounts`
- `/goals`
- `/programados`
- `/budgets`
- `/liabilities`
- `/settings`

| Ruta mobile | Estado | Datos | Estados implementados |
| --- | --- | --- | --- |
| `/dashboard` | Parcial real | Cuentas/movimientos/programados/metas reales; algunos calculos locales | Loading skeleton; error con retry; empty parcial para secciones |
| `/movements` | Funcional real | Movimientos reales | Loading list skeleton; error con retry; empty si no hay filtrados; detalle sheet; editar/eliminar |
| `/categories` | Parcial/mock mixto | Calcula totales desde movimientos reales; usa `metrics` de `finance-data.ts` para delta/iconos y barras hardcodeadas de ultimos 7 dias | No loading/error propio; fallback categorias mock en cero |
| `/accounts` | Funcional real | Cuentas reales | Loading skeleton; error con retry; empty; pull-to-refresh manual por touch |
| `/goals` | Parcial real | Metas reales | Loading skeleton; empty; no error propio en componente |
| `/programados` | Funcional real | Programados reales; confirmar usa RPC | Loading list skeleton; error con retry; empty; editar/pausar/confirmar/eliminar |
| `/budgets` | Parcial real | Presupuestos reales | Loading skeleton; empty; no error propio en componente |
| `/liabilities` | Parcial real | Deudas reales | Loading skeleton; empty; no error propio en componente |
| `/settings` | Parcial real | Perfil real recibido por layout; update a Supabase | Mensaje exito/error compartido en un solo texto; no loading inicial |

## 4. Datos y modelo actual

### Fuente de datos

- Fuente real principal: Supabase Postgres + Supabase Auth.
- Tipos de BD: `src/types/database.ts`.
- Schema/migraciones: `supabase/schema.sql` y `supabase/migrations/*`.
- Proyecto Supabase vinculado localmente: `aowzjfixyelpjudkfwnw` con nombre `finanzas-personales`, segun `supabase/.temp/linked-project.json`.
- Datos mock/hardcodeados aun existentes: `src/lib/finance-data.ts`.

### Modelos principales en BD

Campos exactos segun `src/types/database.ts`.

#### `profiles`

- `id: string`
- `full_name: string | null`
- `avatar_url: string | null`
- `currency_code: string`
- `locale: string`
- `created_at: string`
- `updated_at: string`

#### `accounts`

- `id: string`
- `user_id: string`
- `name: string`
- `alias: string | null`
- `type: account_type`
- `initial_balance: number`
- `currency_code: string`
- `bank_name: string | null`
- `bank_custom_name: string | null`
- `color: string | null`
- `icon: string | null`
- `is_archived: boolean`
- `created_at: string`
- `updated_at: string`

#### `account_balances` view

- Incluye campos de `accounts` y `balance: number | null`.
- La app lee esta view para mostrar balances calculados.

#### `categories`

- `id: string`
- `user_id: string`
- `name: string`
- `type: category_type`
- `parent_id: string | null`
- `color: string | null`
- `icon: string | null`
- `sort_order: number`
- `is_archived: boolean`
- `created_at: string`
- `updated_at: string`

#### `movements`

- `id: string`
- `user_id: string`
- `type: movement_type`
- `amount: number`
- `occurred_on: string`
- `description: string | null`
- `merchant: string | null`
- `notes: string | null`
- `account_id: string | null`
- `from_account_id: string | null`
- `to_account_id: string | null`
- `category_id: string | null`
- `is_recurring: boolean`
- `created_at: string`
- `updated_at: string`

#### `monthly_budgets`

- `id: string`
- `user_id: string`
- `category_id: string`
- `month: string`
- `amount: number`
- `notes: string | null`
- `created_at: string`
- `updated_at: string`

#### `savings_goals`

- `id: string`
- `user_id: string`
- `name: string`
- `target_amount: number`
- `current_amount: number`
- `target_date: string | null`
- `account_id: string | null`
- `color: string | null`
- `status: goal_status`
- `created_at: string`
- `updated_at: string`

#### `liabilities`

- `id: string`
- `user_id: string`
- `name: string`
- `type: liability_type`
- `principal_amount: number`
- `credit_limit: number | null`
- `apr: number | null`
- `payment_due_day: number | null`
- `statement_closing_day: number | null`
- `account_id: string | null`
- `notes: string | null`
- `status: liability_status`
- `created_at: string`
- `updated_at: string`

#### `scheduled_transactions`

- `id: string`
- `user_id: string`
- `name: string`
- `type: string`
- `amount: number`
- `account_id: string | null`
- `destination_account_id: string | null`
- `category_id: string | null`
- `frequency: string`
- `start_date: string`
- `next_due_date: string`
- `end_date: string | null`
- `status: string`
- `notes: string | null`
- `auto_create: boolean`
- `created_at: string`
- `updated_at: string`

#### `user_invitations`

- `id: string`
- `owner_id: string`
- `invited_email: string`
- `invited_name: string`
- `invited_user_id: string | null`
- `role: string`
- `status: invitation_status`
- `created_at: string`

### Enums de BD

- `account_type`: `cash`, `checking`, `savings`, `credit_card`, `loan`, `investment`, `other`
- `category_type`: `income`, `expense`
- `goal_status`: `active`, `paused`, `completed`, `cancelled`
- `invitation_status`: `created`, `revoked`
- `liability_status`: `active`, `paid`, `closed`
- `liability_type`: `credit_card`, `loan`, `personal_debt`, `other`
- `movement_type`: `income`, `expense`, `transfer`

### Funcion RPC

- `confirm_scheduled_transaction(p_scheduled_id: string): string`

### Modelos UI principales

Definidos en `src/lib/finance-types.ts`.

#### `FinanceAccount`

- `id?: string`
- `name: string`
- `alias?: string`
- `type: "Banco" | "Efectivo" | "Ahorro" | "Tarjeta" | "Inversion" | "Deuda"`
- `balance: number`
- `initialBalance?: number`
- `currencyCode?: string`
- `isArchived?: boolean`
- `color: string`
- `icon: LucideIcon`
- `bank_name?: BankName | string`
- `bank_custom_name?: string`

#### `AccountFormValue`

- `name: string`
- `alias?: string`
- `type: AccountType`
- `balance: number`
- `bank_name?: string`
- `bank_custom_name?: string`

#### `FinanceMovement`

- `id?: string`
- `occurredOn?: string`
- `date: string`
- `description: string`
- `accountId?: string`
- `account: string`
- `destinationAccountId?: string`
- `destinationAccount?: string`
- `categoryId?: string`
- `category: string`
- `type: string`
- `amount: number`
- `merchant?: string`

#### `ScheduledTransaction`

- `id: string`
- `name: string`
- `type: "expense" | "income" | "transfer" | "debt_payment" | "subscription"`
- `amount: number`
- `account: string`
- `destinationAccount?: string`
- `category?: string`
- `frequency: "weekly" | "biweekly" | "monthly" | "yearly" | "custom"`
- `startDate: string`
- `nextDueDate: string`
- `endDate?: string`
- `status: "active" | "paused" | "finished"`
- `notes?: string`
- `autoCreate: boolean`

### Inconsistencias y deuda de datos

- `scheduled_transactions.type`, `frequency` y `status` son `string` en la BD, pero el UI los castea a unions TypeScript. La BD no expresa esos enums en `database.ts`.
- `src/lib/finance-data.ts` conserva mock data; todavia alimenta analytics desktop y parte de analytics mobile.
- `useMovements` siembra categorias por defecto desde el cliente cuando no hay categorias. Esto mezcla inicializacion de datos con carga de pantalla.
- `saveBudget` busca una categoria por nombre del formulario y si no la encuentra usa la primera categoria de gasto. Esto puede guardar un presupuesto en una categoria distinta a la que el usuario escribio.
- En `BudgetsScreen`, el campo "Mes" del dialogo no se usa realmente; `saveBudget` siempre usa el mes actual.
- En `DashboardScreen`, `today` esta hardcodeado como `new Date("2026-06-29T00:00:00")`, por lo que los vencimientos no se calculan con la fecha real.
- En `ScheduledScreen`, `movementFromScheduled` crea un movimiento local para mostrar "Registros creados desde programados" despues de llamar la RPC, pero ese objeto no viene de la respuesta real de BD.
- Hay calculos financieros duplicados entre desktop y mobile: disponible, reservado, proximo programado, ingresos/gastos/balance.
- Hay textos con mojibake en codigo fuente (`AnalÃ­tica`, `CategorÃ­a`, `NÃ³mina`, `ContraseÃ±a`, etc.) y mezcla de ingles/espanol en algunas pantallas (`Activity`, `Today`, `Financial timeline`).

## 5. Navegacion implementada

### Desktop

- `src/lib/navigation.ts` define sidebar:
  - Inicio -> `/dashboard`
  - Actividad -> `/movements`
  - Cuentas -> `/accounts`
  - Programados -> `/programados`
  - Analisis -> `/categories`
  - Objetivos -> `/goals`
- El layout desktop usa `NivaAppShell` con sidebar, topbar/search y accion primaria "Nuevo registro" hacia `/movements`.

### Mobile

- La mobile nav esta en `src/components/mobile/niva-mobile-experience.tsx`.
- Hay un tab bar fijo con 5 posiciones visuales:
  - Inicio -> `/dashboard`
  - Actividad -> `/movements`
  - Boton central `+` -> action sheet
  - Analisis -> `/categories`
  - Cuentas -> `/accounts`
- El action sheet central contiene:
  - Añadir gasto
  - Añadir ingreso
  - Transferencia
  - Crear programado
  - Añadir cuenta
- Hay boton flotante "Mas opciones" que abre sheet con:
  - Programados -> `/programados`
  - Objetivos -> `/goals`
  - Presupuestos -> `/budgets`
  - Deudas -> `/liabilities`
  - Configuracion -> `/settings`
- Tambien existe un lock visual inicial en mobile: "Toca para desbloquear". No es autenticacion real; la auth real ya viene de Supabase/layout.

### Comparacion con estructura acordada

Estructura acordada: Inicio / Actividad / Nuevo registro / Analisis / Cuentas, con Objetivos y Programados como sub-secciones.

- Coincide en el tab bar principal: Inicio, Actividad, Nuevo registro, Analisis, Cuentas.
- Objetivos y Programados no estan dentro de una jerarquia visual unica de "sub-secciones"; aparecen en "Mas opciones" y tambien como links desde algunas pantallas.
- Presupuestos, Deudas y Configuracion tambien estan en "Mas opciones".

## 6. Pendientes y deuda tecnica conocida

- Invitaciones/usuarios admin estan deshabilitados: `POST /api/admin/users` devuelve `403` hasta completar modelo de permisos.
- README menciona `.vercel/project.json`, pero durante esta inspeccion no encontre carpeta `.vercel` en el repo.
- Hay mojibake/encoding visible en multiples textos del codigo. Aunque algunos textos renderizados pueden verse bien segun encoding del navegador/build, el fuente contiene caracteres rotos.
- Hay mezcla i18n ingles/espanol en pantallas desktop, especialmente Movements.
- `src/components/mobile/niva-mobile-experience.tsx` concentra muchas pantallas y helpers en un solo archivo grande.
- Analytics desktop usa datos mock/hardcodeados, no datos reales de Supabase.
- Analytics mobile mezcla datos reales de movimientos con barras hardcodeadas y deltas de mock.
- Dashboard desktop no maneja explicitamente loading/error de sus hooks.
- Programados desktop no muestra loading aunque `usePlanningData` si lo expone.
- Goals/Budgets/Liabilities desktop no muestran empty state especifico.
- Budgets no permite elegir categoria por id desde UI; usa nombre y fallback a primera categoria.
- El modelo de permisos/roles compartidos no esta implementado.
- No vi integracion con banco real, Open Finance, Plaid, Belvo u otra API externa.
- No vi importacion CSV/Excel ni OCR de tickets.
- No vi tests e2e. Hay tests unitarios/Vitest para algunas utilidades y compliance visual.

## 7. Como correr y deployar el proyecto

### Desarrollo local

Desde `C:\Users\edu30\NIVA\05_Development\Frontend\niva-app`:

```bash
npm install
npm run dev
```

URL local esperada:

```text
http://localhost:3000
```

Comandos de verificacion:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Variables requeridas en `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`/setup-auth` tambien muestra `SUPABASE_SERVICE_ROLE_KEY`, pero en `.env.example` solo esta comentada como "solo servidor" y no aparece con nombre completo salvo en la pantalla `setup-auth`. En el codigo inspeccionado no vi uso directo de `SUPABASE_SERVICE_ROLE_KEY`.

### Supabase

- Proyecto localmente vinculado en `supabase/.temp/linked-project.json`:
  - `ref`: `aowzjfixyelpjudkfwnw`
  - `name`: `finanzas-personales`
- Existen migraciones en `supabase/migrations`.
- La app usa RLS segun textos de UI/documentacion, pero este resumen no valida las politicas en la base remota; solo confirma que el codigo cliente filtra por usuario indirectamente mediante Supabase Auth/RLS y usa tablas/views publicas.

### Vercel / CI

- No encontre `vercel.json`.
- No encontre `.vercel/project.json` en el arbol actual, aunque el README dice que deberia existir. Por tanto, desde el codigo no puedo confirmar el project id de Vercel.
- README indica Vercel como plataforma objetivo y Next.js como framework preset.
- CI existente: `.github/workflows/ci.yml`.
  - Corre en `push` y `pull_request` a `main`.
  - Usa Node `22`.
  - Usa `npm ci`.
  - Ejecuta lint, typecheck, tests y build.
  - Define variables placeholder para Supabase:
    - `NEXT_PUBLIC_SUPABASE_URL=https://example.supabase.co`
    - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ci_placeholder`
- Branch de produccion: no esta declarada en archivos Vercel del repo. CI usa `main`; si Vercel esta conectado por Git, probablemente `main` sea la rama esperada, pero eso no se puede probar desde los archivos actuales.

### Deploy

Con lo visible en el repo, el flujo verificable es:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
git push origin main
```

El deploy automatico a Vercel depende de configuracion externa de Vercel/GitHub que no esta versionada aqui. No hay comando `vercel --prod` ni workflow de deploy manual en el repo.

