# PS-002 Financial Workspace

## Objetivo

Permitir que el usuario organice y opere sus cuentas, categorias y saldos desde un espacio persistente y confiable.

## Problema

La UI actual permite manipular cuentas solo en memoria; los cambios se pierden al recargar y no alimentan el resto del producto.

## Usuario

Persona que administra cuentas bancarias, efectivo, ahorro, credito e inversiones en MXN u otras monedas.

## Experiencia

El usuario puede crear, editar, archivar y consultar cuentas con feedback inmediato, estados de carga/error y confirmaciones claras.

## Componentes

- Catalogo de categorias.
- Listado y agrupacion de cuentas.
- Dialogo de cuenta.
- Totales, distribucion y estados de saldo.
- Acciones de editar y archivar.

## Reglas UX

- No borrar historico financiero al retirar una cuenta: archivar por defecto.
- Mostrar moneda y saldos con locale del perfil.
- No calcular saldos exclusivamente en el cliente.
- Mantener aislamiento por usuario mediante RLS.

## Acceptance Criteria

- CRUD de categorias y cuentas persiste en Supabase.
- Recargar conserva los cambios.
- Una cuenta con movimientos se archiva y no se elimina accidentalmente.
- Errores de red o validacion se muestran sin perder el formulario.
- Un usuario no puede leer ni modificar datos de otro.

## Estado

Completado en v0.2.0.
