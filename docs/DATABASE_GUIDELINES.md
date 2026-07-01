# Database Guidelines

- No cambiar tablas sin migracion.
- Mantener RLS.
- Cada usuario solo ve sus datos.
- No guardar rutas de logos en la base de datos.
- Guardar solo `bank_name` y `bank_custom_name`.
- Logos y color se resuelven desde `src/config/banks.ts`.
