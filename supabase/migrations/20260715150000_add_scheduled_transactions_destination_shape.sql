-- Close the gap where a scheduled_transactions row of type transfer/debt_payment
-- can be saved with destination_account_id null, unlike movements_shape which
-- already enforces to_account_id not null for type='transfer' on the movements
-- table. The frontend (ScheduledTransactionDialog) already only ever sends
-- destination_account_id for these two types, so this codifies existing
-- behavior rather than changing it.

alter table public.scheduled_transactions
  add constraint scheduled_transactions_destination_shape
  check (
    (
      type in ('transfer', 'debt_payment')
      and destination_account_id is not null
      and destination_account_id <> account_id
    )
    or
    (
      type not in ('transfer', 'debt_payment')
      and destination_account_id is null
    )
  );
