# Database

## Purpose

Define database documentation rules.

## Status

Alpha

## Rules

- Do not change tables without a migration.
- Maintain RLS.
- Each user only sees their own data.
- Do not store logo paths in the database.
- Store only `bank_name` and `bank_custom_name`.
- Resolve logos and color from `src/config/banks.ts`.

## Documentation Rule

This chapter documents constraints. It does not modify schema, policies, migrations, or Supabase behavior.

## Related Chapters

- [Backend](backend.md)
- [Architecture](architecture.md)
- [Decisions](../06-decisions/README.md)

