-- Meses Sin Intereses (MSI) support, part 1/3: schema.
--
-- An MSI purchase records ONE movement for the full amount (existing expense
-- flow, unchanged — the card balance rises immediately, like a real card).
-- The N informational scheduled_transactions rows below (one per
-- installment) are billing reminders only: confirming one must NOT create a
-- second movement, or the purchase would be double-counted. is_informational
-- is the flag confirm_scheduled_transaction() checks to skip movement
-- creation for these rows (see the next migration).
--
-- movement_id doubles as both traceability back to the originating purchase
-- and the grouping key for an installment's siblings (every row from the
-- same MSI purchase shares one movement_id) — no separate plan_id needed
-- since each MSI purchase creates exactly one movement.

alter table public.scheduled_transactions
  add column is_informational boolean not null default false,
  add column movement_id uuid,
  add column total_installments smallint,
  add column installment_number smallint;

alter table public.scheduled_transactions
  drop constraint scheduled_transactions_type_valid;
alter table public.scheduled_transactions
  add constraint scheduled_transactions_type_valid
  check (type in ('expense', 'income', 'transfer', 'debt_payment', 'subscription', 'msi_installment'));

alter table public.scheduled_transactions
  add constraint scheduled_transactions_installment_number_valid
  check (installment_number is null or installment_number >= 1),
  add constraint scheduled_transactions_total_installments_valid
  check (total_installments is null or total_installments >= 1),
  add constraint scheduled_transactions_installment_within_total
  check (
    installment_number is null
    or total_installments is null
    or installment_number <= total_installments
  ),
  add constraint scheduled_transactions_msi_shape
  check (
    (
      type = 'msi_installment'
      and is_informational
      and movement_id is not null
      and total_installments is not null
      and installment_number is not null
    )
    or (
      type <> 'msi_installment'
      and not is_informational
      and movement_id is null
      and total_installments is null
      and installment_number is null
    )
  );

-- Composite ownership FK to movements, matching the pattern already used for
-- accounts/categories (see harden_financial_data_layer.sql). movements needs
-- an (id, user_id) unique target before it can be referenced this way — it
-- doesn't have one yet, unlike accounts/categories.
alter table public.movements
  add constraint movements_id_user_key unique (id, user_id);

alter table public.scheduled_transactions
  add constraint scheduled_transactions_movement_owner_fkey
  foreign key (movement_id, user_id) references public.movements(id, user_id) on delete set null (movement_id);

create index scheduled_transactions_movement_idx on public.scheduled_transactions(movement_id);
