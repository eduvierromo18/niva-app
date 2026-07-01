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

- Usar Aurora Design System.
- Mantener mucho aire, fondo suave, cards blancas, bordes de 20px y sombras sutiles.
- Evitar graficas grandes en Home.
- No modificar logica financiera, rutas ni integraciones de datos desde esta pantalla.

## Acceptance Criteria

- Home no muestra la palabra "Patrimonio".
- Home mantiene los datos existentes de cuentas, metricas, movimientos, pagos programados y metas.
- Home permite abrir las acciones existentes de nueva cuenta y nuevo movimiento.
- La pantalla compila correctamente con lint y build.

## Estado

Implementado en UI-001.
