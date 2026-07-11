# Flujo recomendado de desarrollo por etapas

## Etapa 1 - Base tecnica

- Crear el proyecto Next.js con App Router, TypeScript, Tailwind y ESLint.
- Inicializar shadcn/ui y agregar componentes base.
- Configurar Supabase con `@supabase/ssr`.
- Ejecutar `supabase/schema.sql`.
- Crear clientes Supabase para servidor, navegador y proxy de sesion.

## Etapa 2 - Autenticacion y perfil

- Implementar login, registro y cierre de sesion.
- Proteger rutas bajo `/(app)`.
- Mostrar perfil, moneda principal y preferencias regionales.
- Verificar que RLS impida leer datos entre usuarios.
- Configurar en Vercel `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Mantener deshabilitado el aprovisionamiento administrativo hasta contar con roles verificables e invitaciones por enlace.

## Etapa 3 - Catalogos

- CRUD de cuentas.
- CRUD de categorias de ingreso y gasto.
- Estados archivados para no borrar datos historicos.
- Semillas sugeridas por usuario para categorias frecuentes.

## Etapa 4 - Movimientos

- Formulario unico para ingreso, gasto y transferencia.
- Validaciones por tipo de movimiento.
- Tabla filtrable por mes, cuenta, categoria y tipo.
- Edicion y eliminacion con confirmacion.

## Etapa 5 - Dashboard

- Resumen mensual de ingresos, gastos, ahorro y balance.
- Grafica de gasto por categoria con Recharts.
- Lista de ultimos movimientos.
- Comparacion presupuesto vs gasto real.

## Etapa 6 - Presupuestos y metas

- Presupuestos mensuales por categoria.
- Progreso y alertas visuales.
- Metas de ahorro con fecha objetivo.
- Proyeccion simple: monto faltante / meses restantes.

## Etapa 7 - Deudas y tarjetas

- Registrar tarjeta, prestamo o deuda personal.
- Fechas de corte y limite de pago.
- Indicadores de saldo, limite, utilizacion y proximo pago.
- Relacionar pagos como movimientos de gasto o transferencia.

## Etapa 8 - Pulido

- Empty states utiles.
- Importacion CSV opcional.
- Exportacion CSV/PDF.
- Tests de acciones criticas.
- Revision de accesibilidad y responsive.

