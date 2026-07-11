# Current Iteration

## Estado

En ejecucion

## Product Specs activos

- PS-002 Financial Workspace
- PS-003 Activity
- PS-004 Analytics
- PS-005 Goals

## Objetivo

Convertir la interfaz validada de Niva en un MVP financiero persistente: datos reales por usuario, CRUD completo, dashboard calculado, pruebas y despliegue.

## Alcance

1. Capa de datos Supabase tipada y segura.
2. Categorias, cuentas, movimientos y transferencias.
3. Dashboard alimentado por datos persistentes.
4. Presupuestos, metas, deudas y programados.
5. Pruebas, CI y despliegue.

## Definition of Done

- Los cambios sobreviven una recarga y estan aislados por RLS.
- No se usan datos demo cuando Supabase esta configurado.
- Lint, typecheck, pruebas y build pasan en CI.
- Los flujos criticos se verifican en Preview antes de Production.
