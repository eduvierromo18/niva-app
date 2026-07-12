# PS-003 Activity

## Objetivo

Ofrecer un timeline confiable de ingresos, gastos y transferencias con filtros y edicion segura.

## Problema

Los movimientos actuales son demostrativos y no actualizan cuentas, metricas ni presupuestos.

## Usuario

Persona que registra manualmente su actividad financiera y necesita encontrar, corregir y comprender cada operacion.

## Experiencia

Registro rapido, timeline cronologico, filtros por periodo/tipo/cuenta/categoria y confirmacion antes de eliminar.

## Componentes

- Formulario unificado de movimiento.
- Timeline y buscador.
- Filtros de fecha, tipo, cuenta y categoria.
- Edicion y eliminacion.
- Transferencia entre cuentas.

## Reglas UX

- Los montos se capturan positivos; el tipo determina su efecto.
- Una transferencia exige origen y destino distintos.
- Las transferencias se guardan atomicamente como una sola operacion de dominio.
- Fechas se almacenan como fecha financiera y se muestran con locale del usuario.

## Acceptance Criteria

- Crear, editar y eliminar movimientos persiste.
- Una transferencia nunca queda aplicada parcialmente.
- Los filtros son combinables y su estado es visible.
- Cuentas, dashboard y presupuestos reflejan la operacion.
- RLS impide referenciar cuentas o categorias ajenas.

## Estado

Completado en v0.2.0.
