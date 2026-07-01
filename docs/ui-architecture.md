# Arquitectura UI

## 1. Arquitectura de componentes

- `layout/AppShell`: marco general con barra superior, navegacion principal, accion global y perfil.
- `layout/PageScaffold`: composicion de pantalla con sidebar opcional, toolbar y contenido principal.
- `finance/FinanceFilters`: sidebar fijo de filtros para registros y analitica.
- `finance/MetricCard`: tarjeta de indicador con icono, valor, delta y estado.
- `finance/ChartPanel`: contenedor reutilizable para graficas Recharts.
- `finance/DataTable`: tabla densa, clara y responsive para datos financieros.
- `finance/EntityCard`: tarjeta para cuentas, presupuestos, metas y deudas.
- `ui/*`: primitivos visuales inspirados en shadcn/ui: Button, Card, Badge, Progress.

## 2. Layout principal

- Barra superior minimalista y fija.
- Navegacion horizontal desktop, compacta en pantallas pequenas.
- Accion global `Nuevo registro` en el extremo derecho.
- Area de trabajo gris suave con tarjetas blancas.
- En pantallas de analisis o registros: sidebar de filtros fijo y contenido amplio a la derecha.

## 3. Sistema de diseno

- Tema claro por defecto con soporte dark mode por clase `.dark`.
- Fondo: gris frio suave.
- Superficies: blanco / zinc oscuro en dark mode.
- Acento principal: verde profundo propio de la app.
- Estados: verde positivo, rojo negativo, ambar alerta, azul informativo.
- Bordes: 1px suave, radio 8-12px, sombras sutiles.
- Tipografia: sans system, jerarquia clara, metricas con peso alto.

## 4. Componentes reutilizables

- Botones con variantes: primary, secondary, ghost.
- Cards con padding consistente y encabezados.
- Badges para estados.
- Progress bars para presupuestos y metas.
- Tablas con filas escaneables.
- Filtros con inputs visuales no conectados aun.

## 5. Pantallas

- Panel: resumen mensual, cuentas, graficas, ultimos movimientos.
- Cuentas: cuentas y saldos por tipo.
- Registros: sidebar de filtros, tabla de movimientos y estado vacio.
- Analitica: filtros, metricas, barras, dona y tabla por categoria.
- Presupuestos: progreso mensual por categoria.
- Metas: avance de objetivos de ahorro.
- Deudas: tarjetas/deudas con corte, limite de pago y utilizacion.

