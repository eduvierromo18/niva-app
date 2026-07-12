# PS-005 Goals and Daily Planning

## Objetivo

Ayudar al usuario a planear gastos, ahorro, deudas y compromisos recurrentes desde datos persistentes.

## Problema

Presupuestos, metas, deudas y programados existen visualmente, pero sus cambios son locales y no generan alertas confiables.

## Usuario

Persona que quiere anticipar pagos, controlar limites, reducir deuda y avanzar hacia objetivos de ahorro.

## Experiencia

Cada modulo ofrece progreso comprensible, proximo paso y alertas sobrias antes de que el problema ocurra.

## Componentes

- Presupuestos mensuales.
- Metas de ahorro.
- Deudas y tarjetas.
- Transacciones programadas.
- Alertas y proximos compromisos.

## Reglas UX

- No usar lenguaje alarmista.
- Mostrar fechas y porcentajes junto con montos absolutos.
- Una alerta debe incluir una accion posible.
- Los programados no crean movimientos automaticamente sin una regla explicita y auditable.

## Acceptance Criteria

- CRUD de los cuatro modulos persiste por usuario.
- Presupuestos comparan limite contra gasto real del periodo.
- Metas muestran faltante y progreso.
- Deudas muestran utilizacion y proxima fecha relevante.
- Programados soportan activo, pausado y completado.
- Dashboard consume alertas y proximos compromisos reales.

## Estado

Completado en v0.2.0.
