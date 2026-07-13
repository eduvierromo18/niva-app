-- MANUAL / PENDING migration — DO NOT run via `supabase db push`.
-- Intentionally placed outside supabase/migrations/ so it is not auto-applied.
--
-- Purpose: tighten scheduled_transactions.amount from `>= 0` to `> 0`, matching
-- movements_amount_positive. This closes the "$0.00 saved silently" class of bug
-- at the database level (see the mobile "Crear programado" fix).
--
-- ⚠ ORDER MATTERS: this ALTER will FAIL if any scheduled_transactions row still
-- has amount = 0 (e.g. the "Pago tarjeta Amex" record). Clean those rows FIRST
-- (set the real amount from the app, or delete them), then run this file.
--
-- Step 0 — read-only check: list the offending rows before doing anything.
--   select id, name, type, amount, status, next_due_date, created_at
--   from public.scheduled_transactions
--   where amount = 0
--   order by created_at;
--
-- Run this file (Supabase SQL editor or psql) only after that query returns 0 rows.

begin;

alter table public.scheduled_transactions
  drop constraint if exists scheduled_transactions_amount_nonnegative;

alter table public.scheduled_transactions
  add constraint scheduled_transactions_amount_positive check (amount > 0);

commit;
