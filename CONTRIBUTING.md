# Contributing

Este repositorio usa Conventional Commits para mantener un historial claro y automatizable.

## Commits

Tipos permitidos:

- `feat:` nueva funcionalidad
- `fix:` correccion de bug
- `refactor:` cambio interno sin modificar comportamiento
- `docs:` documentacion
- `style:` formato o estilos sin cambio funcional
- `test:` pruebas
- `chore:` mantenimiento, configuracion o infraestructura

Ejemplos:

```bash
git commit -m "chore: initialize repository foundation"
git commit -m "docs: update Niva roadmap"
```

## Flujo recomendado

1. Crear una rama corta desde `main`.
2. Ejecutar `npm run lint`.
3. Ejecutar `npm run build`.
4. Abrir pull request con descripcion breve, alcance y verificacion.

## Alcance actual

Niva es el nombre oficial del producto. No renombrar componentes internos `Aurora*` hasta un sprint tecnico futuro.
