# PS-004 Analytics

## Objetivo

Transformar la actividad persistente en un resumen mensual claro y verificable.

## Problema

Las metricas y graficas actuales son datos estaticos y pueden contradecir los registros del usuario.

## Usuario

Persona que necesita entender ingresos, gastos, balance, ahorro y categorias principales sin realizar calculos manuales.

## Experiencia

Dashboard rapido, calmado y explicable, con rango temporal visible y enlaces al detalle que origina cada cifra.

## Componentes

- Total disponible.
- KPIs mensuales.
- Tendencia de ingresos y gastos.
- Gasto por categoria.
- Actividad reciente.
- Proximos compromisos y alertas.

## Reglas UX

- Toda metrica proviene de cuentas y movimientos persistentes.
- No mezclar periodos ni monedas sin indicarlo.
- Los estados sin datos explican como comenzar.
- Los insights deben indicar la evidencia que los origina.

## Acceptance Criteria

- El dashboard se recalcula al crear, editar o eliminar actividad.
- El periodo seleccionado se aplica a todas las metricas.
- Las cifras coinciden con consultas de base de datos verificables.
- La interfaz tiene estados de carga, error y vacio.

## Estado

En implementacion
