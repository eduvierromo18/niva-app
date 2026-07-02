# Architecture

## Purpose

Describe the current architecture at a documentation level.

## Status

Alpha

## Current Structure

- `src/app`: Next.js routes, layouts, actions, and API routes.
- `src/components`: UI, screens, and internal Aurora system.
- `src/lib`: utilities, finance data, navigation, and Supabase clients.
- `src/config`: domain configuration such as supported banks.
- `docs`: documentation.
- `product`: historical product planning documents.
- `supabase`: schema and SQL references.
- `public`: static assets.

## Rule

Documentation changes must not alter architecture or runtime behavior.

## Related Chapters

- [Frontend](frontend.md)
- [Backend](backend.md)
- [Database](database.md)

