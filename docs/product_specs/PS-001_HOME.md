# PS-001 Home

## Objetivo

Home debe ofrecer una lectura rapida, tranquila y accionable del estado diario del dinero del usuario.

## Problema

El usuario necesita entender que puede pagar, que debe revisar y que accion conviene tomar sin entrar primero a modulos detallados.

## Usuario

Persona que administra sus finanzas manualmente y necesita claridad cotidiana sobre saldos, pagos cercanos, actividad, metas y oportunidades de mejora.

## Experiencia

La pantalla debe sentirse cercana, simple y profesional. El concepto visible principal es "Tu dinero".

No usar "Patrimonio" como termino visible en Home. Cuando el usuario necesite navegar al detalle, usar copys como "Ver detalle", "Total disponible" o "Tu dinero disponible", segun contexto.

## Componentes

- Hero con "Tu dinero".
- Focus Card.
- KPIs: ingresos, gastos, balance y ahorro.
- Acciones rapidas.
- Mis cuentas.
- Proximos pagos.
- Actividad reciente.
- Insights.
- Metas.

## Reglas UX

- Usar Niva Design System; Aurora permanece como implementacion interna heredada.
- Mantener aire, superficies claras, jerarquia calmada y sombras sutiles.
- Evitar graficas grandes en Home.
- Toda cifra debe provenir de la capa de datos persistente.

## Acceptance Criteria

- Home no muestra la palabra "Patrimonio".
- Home consume cuentas, metricas, movimientos, pagos programados y metas persistentes cuando Supabase esta configurado.
- Home permite abrir las acciones de nueva cuenta y nuevo movimiento.
- Cuenta con estados de carga, error y vacio.
- Lint, pruebas y build pasan correctamente.

## Estado

Completado en v0.2.0.
