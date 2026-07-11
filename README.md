# Niva

Tu espacio financiero.

Niva es una aplicacion web personal para entender, ordenar y operar finanzas personales desde un espacio claro: dashboard, cuentas, movimientos, presupuestos, metas, deudas y transacciones programadas.

El nombre oficial del producto es Niva. Los componentes internos `Aurora*` siguen vigentes por ahora y no deben renombrarse hasta un sprint tecnico dedicado.

## Tecnologias

- Next.js 15 con App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase SSR y Supabase JS
- Recharts
- ESLint con configuracion de Next.js
- Vercel como plataforma objetivo

## Ejecutar localmente

```bash
npm install
npm run dev
```

La aplicacion queda disponible en `http://localhost:3000`.

## Variables de entorno

Crear `.env.local` a partir de `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

Notas:

- `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` son variables publicas usadas por el cliente.
- No versionar `.env`, `.env.local` ni archivos equivalentes con secretos.

## Scripts

```bash
npm run dev     # servidor local
npm run lint    # lint del proyecto
npm run build   # build de produccion
npm run start   # sirve el build localmente
```

## Arquitectura

- `src/app`: rutas de Next.js, layouts, acciones y API routes.
- `src/components`: componentes de UI, pantallas y sistema interno Aurora.
- `src/lib`: utilidades, datos financieros, navegacion y clientes Supabase.
- `src/config`: configuracion de dominio, como bancos soportados.
- `docs`: documentacion de producto, UX, arquitectura y sistema visual.
- `product`: planeacion de producto, vision, backlog, milestones y releases.
- `supabase`: schema y scripts SQL de referencia. No modificar en este sprint.
- `public`: assets estaticos.

## Roadmap resumido

- Consolidar la base profesional del repositorio y CI.
- Mantener el sistema Aurora interno mientras Niva se estabiliza como marca.
- Mejorar timeline de movimientos, dashboard e insights financieros.
- Fortalecer presupuestos, metas y experiencia diaria.
- Planear un sprint tecnico futuro para renombres internos controlados.

## Conventional Commits

Usar mensajes de commit con estos tipos:

- `feat:` nueva funcionalidad
- `fix:` correccion de bug
- `refactor:` cambio interno sin modificar comportamiento
- `docs:` documentacion
- `style:` formato o estilos sin cambio funcional
- `test:` pruebas
- `chore:` mantenimiento, configuracion o infraestructura

Ejemplo:

```bash
git commit -m "docs: update Niva repository foundation"
```

## Vercel

El proyecto conserva metadata local en `.vercel/project.json`, actualmente vinculada al proyecto remoto existente. No desplegar hasta conectar el nuevo repositorio GitHub.

Checklist antes de conectar Vercel al nuevo repositorio:

- Confirmar el proyecto correcto en Vercel.
- Revisar si conviene mantener el proyecto existente o relinkearlo con nombre `niva`.
- Configurar Framework Preset: Next.js.
- Build Command: `npm run build`.
- Install Command: `npm install` o `npm ci`.
- Output Directory: automatico de Next.js.
- Copiar variables de entorno para Production, Preview y Development.
- Conectar el nuevo repositorio GitHub.
- Ejecutar un primer deploy Preview antes de Production.

## GitHub

Repositorio sugerido: `niva`.

Alternativa si ya existe: `niva-personal-finance`.

Este proyecto incluye un workflow de CI para ejecutar instalacion limpia, lint y build en `main` y pull requests.

