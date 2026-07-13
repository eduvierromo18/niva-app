-- Tighten scheduled_transactions.amount from `>= 0` to `> 0`, matching
-- movements_amount_positive. Prevents scheduled records being saved at $0.00
-- (see the mobile "Crear programado" fix).
--
-- This was first applied directly in the SQL editor against prod (after the
-- existing $0.00 rows were cleaned). The drop-if-exists on both the old and new
-- constraint names keeps this migration safe to (re)apply via `supabase db push`
-- on top of that manual change.

alter table public.scheduled_transactions
  drop constraint if exists scheduled_transactions_amount_nonnegative;

alter table public.scheduled_transactions
  drop constraint if exists scheduled_transactions_amount_positive;

alter table public.scheduled_transactions
  add constraint scheduled_transactions_amount_positive check (amount > 0);
